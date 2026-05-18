<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherQuestionBankController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->user()->id;

        $quizzes = Quiz::query()
            ->where('teacher_id', $teacherId)
            ->with('category:id,name,slug,icon,color')
            ->withCount('questions')
            ->select('id', 'category_id', 'title', 'status', 'difficulty', 'time_limit')
            ->orderBy('title')
            ->get()
            ->map(fn (Quiz $quiz) => [
                'id' => $quiz->id,
                'category_id' => $quiz->category_id,
                'categoryName' => $quiz->category?->name,
                'title' => $quiz->title,
                'status' => $quiz->status,
                'difficulty' => $quiz->difficulty,
                'time_limit' => $quiz->time_limit,
                'questions_count' => $quiz->questions_count,
            ]);

        $categories = Category::query()
            ->where('is_active', true)
            ->select('id', 'name', 'slug', 'icon', 'color')
            ->orderBy('name')
            ->get();

        $questions = Question::query()
            ->whereHas('quiz', fn ($query) => $query->where('teacher_id', $teacherId))
            ->with([
                'quiz:id,category_id,title',
                'options:id,question_id,option_text,is_correct,order',
                'matchingPairs:id,question_id,left_item,right_item,order',
            ])
            ->withCount('answers')
            ->withMax('answers', 'created_at')
            ->latest()
            ->get()
            ->map(fn (Question $question) => $this->serializeQuestion($question));

        return Inertia::render('Teacher/QuestionBank', [
            'categories' => $categories,
            'questions' => $questions,
            'quizzes' => $quizzes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateQuestion($request);

        $question = DB::transaction(function () use ($validated) {
            $order = Question::where('quiz_id', $validated['quiz_id'])->max('order') + 1;

            $question = Question::create([
                'quiz_id' => $validated['quiz_id'],
                'question_text' => $validated['text'],
                'type' => $validated['type'],
                'points' => $validated['points'],
                'difficulty' => $validated['difficulty'],
                'explanation' => $validated['explanation'] ?? null,
                'order' => $order,
                'has_ai_discussion' => true,
            ]);

            $this->syncAnswers($question, $validated);

            return $question;
        });

        return response()->json($this->freshQuestion($question), 201);
    }

    public function update(Request $request, Question $question): JsonResponse
    {
        $this->ensureOwnedByTeacher($request, $question);
        $validated = $this->validateQuestion($request);

        DB::transaction(function () use ($question, $validated) {
            $question->update([
                'quiz_id' => $validated['quiz_id'],
                'question_text' => $validated['text'],
                'type' => $validated['type'],
                'points' => $validated['points'],
                'difficulty' => $validated['difficulty'],
                'explanation' => $validated['explanation'] ?? null,
            ]);

            $this->syncAnswers($question, $validated);
        });

        return response()->json($this->freshQuestion($question));
    }

    public function duplicate(Request $request, Question $question): JsonResponse
    {
        $this->ensureOwnedByTeacher($request, $question);

        $copy = DB::transaction(function () use ($question) {
            $question->load(['options', 'matchingPairs']);

            $copy = $question->replicate(['order']);
            $copy->question_text = $question->question_text . ' (Salinan)';
            $copy->order = Question::where('quiz_id', $question->quiz_id)->max('order') + 1;
            $copy->push();

            foreach ($question->options as $option) {
                $option->replicate(['question_id'])->fill(['question_id' => $copy->id])->save();
            }

            foreach ($question->matchingPairs as $pair) {
                $pair->replicate(['question_id'])->fill(['question_id' => $copy->id])->save();
            }

            return $copy;
        });

        return response()->json($this->freshQuestion($copy), 201);
    }

    public function destroy(Request $request, Question $question): JsonResponse
    {
        $this->ensureOwnedByTeacher($request, $question);
        $question->delete();

        return response()->json(['ok' => true]);
    }

    public function destroyQuiz(Request $request, Quiz $quiz): JsonResponse
    {
        abort_unless($quiz->teacher_id === $request->user()->id, 403);

        $quiz->delete();

        return response()->json(['ok' => true]);
    }

    private function validateQuestion(Request $request): array
    {
        $teacherId = $request->user()->id;

        return $request->validate([
            'quiz_id' => [
                'required',
                Rule::exists('quizzes', 'id')->where(fn ($query) => $query->where('teacher_id', $teacherId)),
            ],
            'text' => ['required', 'string', 'max:5000'],
            'type' => ['required', Rule::in(['multiple_choice', 'true_false', 'essay', 'fill_blank', 'matching'])],
            'points' => ['required', 'integer', 'min:1', 'max:1000'],
            'difficulty' => ['required', Rule::in(['easy', 'medium', 'hard'])],
            'explanation' => ['nullable', 'string', 'max:5000'],
            'options' => ['array'],
            'options.*.text' => ['nullable', 'string', 'max:1000'],
            'options.*.is_correct' => ['boolean'],
            'pairs' => ['array'],
            'pairs.*.left' => ['nullable', 'string', 'max:1000'],
            'pairs.*.right' => ['nullable', 'string', 'max:1000'],
            'fill_answer' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function syncAnswers(Question $question, array $data): void
    {
        $question->options()->delete();
        $question->matchingPairs()->delete();

        if (in_array($data['type'], ['multiple_choice', 'true_false'], true)) {
            foreach (($data['options'] ?? []) as $index => $option) {
                if (!empty($option['text'])) {
                    $question->options()->create([
                        'option_text' => $option['text'],
                        'is_correct' => $option['is_correct'] ?? false,
                        'order' => $index + 1,
                    ]);
                }
            }
        }

        if ($data['type'] === 'fill_blank' && !empty($data['fill_answer'])) {
            $question->options()->create([
                'option_text' => $data['fill_answer'],
                'is_correct' => true,
                'order' => 1,
            ]);
        }

        if ($data['type'] === 'matching') {
            foreach (($data['pairs'] ?? []) as $index => $pair) {
                if (!empty($pair['left']) && !empty($pair['right'])) {
                    $question->matchingPairs()->create([
                        'left_item' => $pair['left'],
                        'right_item' => $pair['right'],
                        'order' => $index + 1,
                    ]);
                }
            }
        }
    }

    private function ensureOwnedByTeacher(Request $request, Question $question): void
    {
        abort_unless(
            $question->quiz()->where('teacher_id', $request->user()->id)->exists(),
            403
        );
    }

    private function freshQuestion(Question $question): array
    {
        return $this->serializeQuestion(
            $question->fresh()
                ->load(['quiz:id,category_id,title', 'options:id,question_id,option_text,is_correct,order', 'matchingPairs:id,question_id,left_item,right_item,order'])
                ->loadCount('answers')
                ->loadMax('answers', 'created_at')
        );
    }

    private function serializeQuestion(Question $question): array
    {
        return [
            'id' => $question->id,
            'quiz_id' => $question->quiz_id,
            'category_id' => $question->quiz?->category_id,
            'quizTitle' => $question->quiz?->title,
            'text' => $question->question_text,
            'type' => $question->type,
            'points' => $question->points,
            'difficulty' => $question->difficulty,
            'explanation' => $question->explanation,
            'options' => $question->options->map(fn ($option) => [
                'text' => $option->option_text,
                'is_correct' => $option->is_correct,
            ])->values(),
            'pairs' => $question->matchingPairs->map(fn ($pair) => [
                'left' => $pair->left_item,
                'right' => $pair->right_item,
            ])->values(),
            'fill_answer' => $question->type === 'fill_blank'
                ? $question->options->firstWhere('is_correct', true)?->option_text
                : '',
            'usageCount' => $question->answers_count ?? 0,
            'lastUsed' => $question->answers_max_created_at,
            'created_at' => $question->created_at?->toDateTimeString(),
        ];
    }
}
