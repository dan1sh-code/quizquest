<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $teacher = $request->user();

        $completed = QuizAttempt::query()
            ->whereHas('quiz', fn ($query) => $query->where('teacher_id', $teacher->id))
            ->where('status', 'completed');

        $completedCount = (clone $completed)->count();
        $passedCount = (clone $completed)->where('passed', true)->count();

        $quizPerformance = Quiz::query()
            ->where('teacher_id', $teacher->id)
            ->with('category:id,name,icon,color')
            ->withCount([
                'questions',
                'attempts as completed_attempts_count' => fn ($query) => $query->where('status', 'completed'),
            ])
            ->withAvg(['attempts as avg_score' => fn ($query) => $query->where('status', 'completed')], 'percentage')
            ->orderByDesc('completed_attempts_count')
            ->limit(8)
            ->get()
            ->map(fn (Quiz $quiz) => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'category' => $quiz->category,
                'questions_count' => $quiz->questions_count,
                'completed_attempts_count' => $quiz->completed_attempts_count,
                'avg_score' => round($quiz->avg_score ?? 0, 1),
                'status' => $quiz->status,
            ]);

        $topStudents = (clone $completed)
            ->with('user:id,name,avatar,level')
            ->get()
            ->groupBy('user_id')
            ->map(function ($attempts) {
                $first = $attempts->first();

                return [
                    'user' => [
                        ...$first->user->toArray(),
                        'avatar_url' => $first->user->avatar_url,
                    ],
                    'attempts_count' => $attempts->count(),
                    'avg_score' => round($attempts->avg('percentage'), 1),
                    'passed_count' => $attempts->where('passed', true)->count(),
                    'xp_earned' => $attempts->sum('xp_earned'),
                ];
            })
            ->sortByDesc('avg_score')
            ->values()
            ->take(6);

        return Inertia::render('Teacher/Analytics', [
            'summary' => [
                'totalQuizzes' => $teacher->quizzes()->count(),
                'publishedQuizzes' => $teacher->quizzes()->where('status', 'published')->count(),
                'totalClasses' => $teacher->taughtClasses()->count(),
                'totalStudents' => ClassRoom::where('teacher_id', $teacher->id)
                    ->withCount('students')
                    ->get()
                    ->sum('students_count'),
                'completedAttempts' => $completedCount,
                'avgScore' => round((clone $completed)->avg('percentage') ?? 0, 1),
                'passRate' => $completedCount > 0 ? round($passedCount / $completedCount * 100) : 0,
                'avgTime' => round((clone $completed)->avg('time_taken') ?? 0),
            ],
            'dailyTrend' => $this->dailyTrend($teacher->id),
            'quizPerformance' => $quizPerformance,
            'topStudents' => $topStudents,
        ]);
    }

    private function dailyTrend(int $teacherId): array
    {
        return collect(range(6, 0))
            ->map(function (int $daysAgo) use ($teacherId) {
                $date = Carbon::today()->subDays($daysAgo);
                $attempts = QuizAttempt::query()
                    ->whereHas('quiz', fn ($query) => $query->where('teacher_id', $teacherId))
                    ->where('status', 'completed')
                    ->whereDate('completed_at', $date)
                    ->get();

                return [
                    'label' => $date->translatedFormat('d M'),
                    'attempts' => $attempts->count(),
                    'avg_score' => round($attempts->avg('percentage') ?? 0, 1),
                ];
            })
            ->values()
            ->all();
    }
}
