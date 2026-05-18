<?php

namespace Database\Seeders;

use App\Models\AttemptAnswer;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherQuizResultSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('email', 'guru@quizquest.id')->first();

        if (! $teacher) {
            $this->command?->warn('Teacher demo belum ada. Jalankan DatabaseSeeder terlebih dahulu.');
            return;
        }

        $students = collect($this->students())->map(function (array $data) {
            $student = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'username' => $data['username'],
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                    'xp' => $data['xp'],
                    'level' => $data['level'],
                    'school' => 'SMAN 1 Jakarta',
                    'grade' => 'XII IPA 1',
                    'is_active' => true,
                ]
            );

            $student->syncRoles(['student']);

            return $student;
        });

        $quizzes = Quiz::query()
            ->where('teacher_id', $teacher->id)
            ->where('status', 'published')
            ->with(['questions.options', 'questions.matchingPairs'])
            ->orderBy('id')
            ->limit(8)
            ->get();

        foreach ($quizzes as $quizIndex => $quiz) {
            foreach ($students as $studentIndex => $student) {
                $targetPercentage = $this->targetPercentage($quizIndex, $studentIndex);

                $attempt = QuizAttempt::firstOrCreate(
                    [
                        'quiz_id' => $quiz->id,
                        'user_id' => $student->id,
                        'attempt_number' => 1,
                    ],
                    [
                        'status' => 'completed',
                        'started_at' => now()->subDays(8 - $quizIndex)->subMinutes(45 + ($studentIndex * 3)),
                        'completed_at' => now()->subDays(8 - $quizIndex)->subMinutes($studentIndex * 7),
                        'time_taken' => 420 + ($quizIndex * 35) + ($studentIndex * 28),
                        'xp_earned' => 0,
                    ]
                );

                if ($attempt->answers()->exists()) {
                    continue;
                }

                $this->createAnswers($attempt, $quiz, $targetPercentage);
            }
        }
    }

    private function createAnswers(QuizAttempt $attempt, Quiz $quiz, int $targetPercentage): void
    {
        $questions = $quiz->questions;
        $maxScore = $questions->sum('points');
        $targetScore = (int) round($maxScore * ($targetPercentage / 100));
        $score = 0;
        $correct = 0;
        $wrong = 0;
        $skipped = 0;

        foreach ($questions as $index => $question) {
            $remainingTarget = $targetScore - $score;
            $isCorrect = $remainingTarget >= max(1, (int) ceil($question->points / 2));
            $pointsEarned = $isCorrect ? $question->points : 0;
            $selectedOption = null;
            $fillAnswer = null;
            $essayAnswer = null;
            $matchingAnswer = null;
            $gradeStatus = 'auto_graded';

            if (in_array($question->type, ['multiple_choice', 'true_false'], true)) {
                $selectedOption = $isCorrect
                    ? $question->options->firstWhere('is_correct', true)
                    : ($question->options->firstWhere('is_correct', false) ?? $question->options->first());
            } elseif ($question->type === 'fill_blank') {
                $fillAnswer = $isCorrect
                    ? $question->options->firstWhere('is_correct', true)?->option_text
                    : 'jawaban lain';
            } elseif ($question->type === 'matching') {
                $matchingAnswer = $question->matchingPairs
                    ->mapWithKeys(fn ($pair) => [$pair->left_item => $isCorrect ? $pair->right_item : 'Tidak cocok'])
                    ->toArray();
            } elseif ($question->type === 'essay') {
                $essayAnswer = $isCorrect
                    ? 'Jawaban menjelaskan konsep utama dengan contoh yang relevan.'
                    : 'Jawaban masih kurang lengkap dan perlu diperbaiki.';
                $gradeStatus = 'graded';
            }

            AttemptAnswer::create([
                'attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'selected_option_id' => $selectedOption?->id,
                'essay_answer' => $essayAnswer,
                'fill_answer' => $fillAnswer,
                'matching_answer' => $matchingAnswer,
                'is_correct' => $question->type === 'essay' ? null : $isCorrect,
                'points_earned' => $pointsEarned,
                'time_spent' => 45 + ($index * 12),
                'teacher_feedback' => $question->type === 'essay' ? 'Contoh jawaban demo untuk halaman hasil quiz.' : null,
                'grade_status' => $gradeStatus,
            ]);

            $score += $pointsEarned;
            if ($isCorrect) {
                $correct++;
            } else {
                $wrong++;
            }
        }

        $percentage = $maxScore > 0 ? round(($score / $maxScore) * 100, 2) : 0;

        $attempt->update([
            'status' => 'completed',
            'score' => $score,
            'max_score' => $maxScore,
            'percentage' => $percentage,
            'passed' => $percentage >= $quiz->passing_score,
            'correct_answers' => $correct,
            'wrong_answers' => $wrong,
            'skipped_answers' => $skipped,
            'xp_earned' => $percentage >= $quiz->passing_score ? $quiz->xp_reward : 5,
        ]);
    }

    private function targetPercentage(int $quizIndex, int $studentIndex): int
    {
        $scores = [95, 88, 76, 68, 54, 82, 91, 73];

        return $scores[($quizIndex + $studentIndex) % count($scores)];
    }

    private function students(): array
    {
        return [
            ['name' => 'Rina Wijaya', 'username' => 'rina_w', 'email' => 'murid@quizquest.id', 'xp' => 350, 'level' => 3],
            ['name' => 'Andi Pratama', 'username' => 'andi_p', 'email' => 'andi@quizquest.id', 'xp' => 420, 'level' => 3],
            ['name' => 'Siti Aulia', 'username' => 'siti_a', 'email' => 'siti@quizquest.id', 'xp' => 510, 'level' => 3],
            ['name' => 'Dimas Ramadhan', 'username' => 'dimas_r', 'email' => 'dimas@quizquest.id', 'xp' => 280, 'level' => 2],
            ['name' => 'Nadia Putri', 'username' => 'nadia_p', 'email' => 'nadia@quizquest.id', 'xp' => 690, 'level' => 4],
        ];
    }
}
