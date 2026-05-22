<?php

namespace App\Services;

use App\Models\AiDiscussion;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterAiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl = 'https://openrouter.ai/api/v1';

    public function __construct()
    {
        $this->apiKey = Setting::get('openrouter_api_key') ?: config('services.openrouter.api_key', '');
        $model = Setting::get('openrouter_model');
        // Auto-fix broken models directly in database
        if (in_array($model, ['meta-llama/llama-3.1-8b-instruct:free', 'google/gemini-2.0-flash-lite-preview-02-05:free'])) {
            $model = 'openrouter/free';
            Setting::set('openrouter_model', $model);
        }
        $this->model = $model ?: config('services.openrouter.model', 'openrouter/free');
    }

    public function generateDiscussion(Question $question, QuizAttempt $attempt, ?string $studentAnswer = null): array
    {
        $typeLabel = match($question->type) {
            'multiple_choice' => 'Pilihan Ganda', 'true_false' => 'Benar/Salah',
            'essay' => 'Essay', 'fill_blank' => 'Isian Singkat', 'matching' => 'Menjodohkan',
            default => 'Soal',
        };
        $correctAnswer = match($question->type) {
            'multiple_choice','true_false','fill_blank' => $question->options()->where('is_correct',true)->first()?->option_text ?? '',
            'essay'    => '(Jawaban terbuka)',
            'matching' => $question->matchingPairs()->get()->map(fn($p) => "{$p->left_item} → {$p->right_item}")->join(', '),
            default    => '',
        };

        $system  = 'Kamu adalah AI Tutor QuizQuest yang cerdas dan ramah. Berikan pembahasan soal yang jelas, mudah dipahami, gunakan bahasa Indonesia yang baik, dan sertakan langkah penyelesaian jika perlu. Gunakan emoji secukupnya. Jawaban maksimal 200 kata.';
        $userMsg = "Soal ({$typeLabel}): {$question->question_text}\n";
        if ($studentAnswer) $userMsg .= "Jawaban siswa: {$studentAnswer}\n";
        if ($correctAnswer) $userMsg .= "Jawaban benar: {$correctAnswer}\n";
        if ($question->explanation) $userMsg .= "Hint dari guru: {$question->explanation}\n";
        $userMsg .= "\nTolong berikan pembahasan yang lengkap dan mudah dipahami!";

        $response = $this->chat([
            ['role'=>'system','content'=>$system],
            ['role'=>'user',  'content'=>$userMsg],
        ]);

        if ($response['success']) {
            $discussion = AiDiscussion::create([
                'question_id' => $question->id, 'attempt_id' => $attempt->id, 'user_id' => $attempt->user_id,
                'conversation' => [['role'=>'user','content'=>$userMsg],['role'=>'assistant','content'=>$response['content']]],
                'model_used' => $this->model, 'tokens_used' => $response['tokens_used'] ?? 0,
            ]);
            return ['success'=>true,'content'=>$response['content'],'discussion_id'=>$discussion->id];
        }
        return ['success'=>false,'content'=>'Maaf, AI tidak tersedia saat ini. '.($question->explanation ?: 'Pelajari materi terkait.'),'discussion_id'=>null];
    }

    public function continueDiscussion(int $discussionId, string $userMessage): array
    {
        $discussion = AiDiscussion::find($discussionId);
        if (!$discussion) return ['success'=>false,'content'=>'Diskusi tidak ditemukan.'];

        $messages = array_merge(
            [['role'=>'system','content'=>'Kamu adalah AI Tutor QuizQuest. Lanjutkan diskusi dengan siswa secara ramah dan informatif dalam bahasa Indonesia.']],
            $discussion->conversation,
            [['role'=>'user','content'=>$userMessage]]
        );
        $response = $this->chat($messages);

        if ($response['success']) {
            $newConv = array_merge($discussion->conversation, [
                ['role'=>'user','content'=>$userMessage], ['role'=>'assistant','content'=>$response['content']],
            ]);
            $discussion->update(['conversation'=>$newConv,'tokens_used'=>($discussion->tokens_used??0)+($response['tokens_used']??0)]);
            return ['success'=>true,'content'=>$response['content']];
        }
        return ['success'=>false,'content'=>'AI tidak dapat merespons saat ini.'];
    }

    private function chat(array $messages): array
    {
        if (empty($this->apiKey)) {
            $mockResponse = "Halo! Saya adalah AI Tutor QuizQuest (Mode Simulasi). Karena API Key OpenRouter belum diatur, saya menggunakan balasan otomatis.\n\nPertanyaan Anda sangat bagus! Mari diskusikan lebih lanjut.";
            return ['success'=>true,'content'=>$mockResponse,'tokens_used'=>150];
        }
        try {
            $response = Http::timeout(45)
                ->withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'HTTP-Referer' => config('app.url'),
                    'X-Title' => config('app.name'),
                    'Content-Type' => 'application/json'
                ])
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $this->model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return ['success'=>true,'content'=>$data['choices'][0]['message']['content']??'','tokens_used'=>$data['usage']['total_tokens']??0];
            }
            Log::error('OpenRouter API Error',['status'=>$response->status(),'body'=>$response->body()]);
            return ['success'=>false,'content'=>'Terjadi kesalahan pada layanan AI. Coba lagi nanti.'];
        } catch (\Exception $e) {
            Log::error('OpenRouter API Exception',['message'=>$e->getMessage()]);
            return ['success'=>false,'content'=>'Koneksi ke AI gagal. Periksa koneksi internet.'];
        }
    }
}
