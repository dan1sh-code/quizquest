<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Category;
use App\Models\ClassRoom;
use App\Exports\StudentPerformanceExport;
use App\Exports\QuizAnalyticsExport;
use App\Exports\ClassReportExport;
use App\Exports\AchievementReportExport;
use App\Exports\UserActivityExport;
use App\Exports\LeaderboardExport;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports', [
            'students' => User::whereHas('roles', function ($query) {
                $query->where('name', 'student');
            })->count(),
            'quizzes' => Quiz::count(),
            'classes' => ClassRoom::count(),
            'categories' => Category::count(),
        ]);
    }

    /**
     * Laporan Performa Siswa
     */
    public function studentPerformance(Request $request)
    {
        $query = User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })->with(['quizAttempts', 'roles']);

        if ($request->class_id) {
            $query->whereHas('classrooms', function ($q) {
                $q->where('class_id', request('class_id'));
            });
        }

        if ($request->category_id) {
            $query->whereHas('quizAttempts.quiz', function ($q) {
                $q->where('category_id', request('category_id'));
            });
        }

        $students = $query->get()->map(function ($student) {
            $attempts = $student->quizAttempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('percentage'), 2) : 0;
            $passCount = $attempts->where('passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'level' => $student->level,
                'xp' => $student->xp,
                'total_attempts' => $totalAttempts,
                'avg_score' => $avgScore,
                'pass_rate' => $passRate,
                'pass_count' => $passCount,
            ];
        });

        return response()->json($students);
    }

    /**
     * Export Student Performance ke Excel
     */
    public function exportStudentPerformanceExcel(Request $request)
    {
        return Excel::download(
            new StudentPerformanceExport($request->class_id, $request->category_id),
            'Laporan_Performa_Siswa_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Export Student Performance ke PDF
     */
    public function exportStudentPerformancePdf(Request $request)
    {
        $query = User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })->with(['quizAttempts', 'roles']);

        if ($request->class_id) {
            $query->whereHas('classrooms', function ($q) {
                $q->where('class_id', request('class_id'));
            });
        }

        if ($request->category_id) {
            $query->whereHas('quizAttempts.quiz', function ($q) {
                $q->where('category_id', request('category_id'));
            });
        }

        $students = $query->get()->map(function ($student) {
            $attempts = $student->quizAttempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('score'), 2) : 0;
            $passCount = $attempts->where('is_passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'level' => $student->level,
                'xp' => $student->xp,
                'total_attempts' => $totalAttempts,
                'avg_score' => $avgScore,
                'pass_rate' => $passRate,
                'pass_count' => $passCount,
            ];
        });

        $pdf = Pdf::loadView('reports.student-performance', ['students' => $students]);
        return $pdf->download('Laporan_Performa_Siswa_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Laporan Quiz Analytics
     */
    public function quizAnalytics(Request $request)
    {
        $query = Quiz::with('category', 'questions');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $quizzes = $query->get()->map(function ($quiz) {
            $attempts = $quiz->attempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('score'), 2) : 0;
            $passCount = $attempts->where('is_passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;
            $questionsCount = $quiz->questions->count();

            return [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'category' => $quiz->category->name ?? 'N/A',
                'questions_count' => $questionsCount,
                'total_attempts' => $totalAttempts,
                'avg_score' => $avgScore,
                'pass_rate' => $passRate,
                'pass_count' => $passCount,
            ];
        });

        return response()->json($quizzes);
    }

    /**
     * Export Quiz Analytics ke Excel
     */
    public function exportQuizAnalyticsExcel(Request $request)
    {
        return Excel::download(
            new QuizAnalyticsExport($request->category_id),
            'Laporan_Analitik_Quiz_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Export Quiz Analytics ke PDF
     */
    public function exportQuizAnalyticsPdf(Request $request)
    {
        $query = Quiz::with('category', 'questions');

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $quizzes = $query->get()->map(function ($quiz) {
            $attempts = $quiz->attempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('score'), 2) : 0;
            $passCount = $attempts->where('is_passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;
            $questionsCount = $quiz->questions->count();

            return [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'category' => $quiz->category->name ?? 'N/A',
                'questions_count' => $questionsCount,
                'total_attempts' => $totalAttempts,
                'avg_score' => $avgScore,
                'pass_rate' => $passRate,
                'pass_count' => $passCount,
            ];
        });

        $pdf = Pdf::loadView('reports.quiz-analytics', ['quizzes' => $quizzes]);
        return $pdf->download('Laporan_Analitik_Quiz_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Laporan Kelas
     */
    public function classReport(Request $request)
    {
        $query = ClassRoom::with('students', 'teacher');

        if ($request->class_id) {
            $query->where('id', $request->class_id);
        }

        $classes = $query->get()->map(function ($class) {
            $students = $class->students;
            $studentCount = $students->count();

            $avgScore = $studentCount > 0 ? round($students->flatMap(fn($s) => $s->quizAttempts)->avg('score'), 2) : 0;
            $avgLevel = $studentCount > 0 ? round($students->avg('level'), 1) : 0;

            return [
                'id' => $class->id,
                'name' => $class->name,
                'code' => $class->code,
                'teacher' => $class->teacher->name ?? 'N/A',
                'student_count' => $studentCount,
                'avg_score' => $avgScore,
                'avg_level' => $avgLevel,
            ];
        });

        return response()->json($classes);
    }

    /**
     * Export Class Report ke Excel
     */
    public function exportClassReportExcel(Request $request)
    {
        return Excel::download(
            new ClassReportExport($request->class_id),
            'Laporan_Kelas_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Laporan Achievement & Streak
     */
    public function achievementReport()
    {
        $topAchievers = User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })
            ->withCount('achievements')
            ->orderByDesc('achievements_count')
            ->limit(50)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'level' => $user->level,
                    'xp' => $user->xp,
                    'achievements_count' => $user->achievements_count,
                    'current_streak' => $user->current_streak ?? 0,
                ];
            });

        return response()->json($topAchievers);
    }

    /**
     * Export Achievement Report ke Excel
     */
    public function exportAchievementReportExcel()
    {
        return Excel::download(
            new AchievementReportExport(),
            'Laporan_Pencapaian_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Laporan Aktivitas Pengguna
     */
    public function userActivity(Request $request)
    {
        $query = User::with('quizAttempts');

        if ($request->role) {
            $query->whereHas('roles', function ($q) {
                $q->where('name', request('role'));
            });
        }

        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first() ?? 'N/A',
                'total_attempts' => $user->quizAttempts->count(),
                'last_activity' => $user->updated_at->format('Y-m-d H:i'),
            ];
        })->sortByDesc('total_attempts');

        return response()->json($users->values());
    }

    /**
     * Export User Activity ke Excel
     */
    public function exportUserActivityExcel(Request $request)
    {
        return Excel::download(
            new UserActivityExport($request->role),
            'Laporan_Aktivitas_Pengguna_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Export User Activity ke PDF
     */
    public function exportUserActivityPdf(Request $request)
    {
        $query = User::with(['quizAttempts', 'roles']);

        if ($request->role) {
            $query->whereHas('roles', function ($q) {
                $q->where('name', request('role'));
            });
        }

        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first() ?? 'N/A',
                'total_attempts' => $user->quizAttempts->count(),
                'last_activity' => $user->updated_at->format('Y-m-d H:i'),
            ];
        })->sortByDesc('total_attempts')->values();

        $pdf = Pdf::loadView('reports.user-activity', ['users' => $users]);
        return $pdf->download('Laporan_Aktivitas_Pengguna_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Laporan Leaderboard
     */
    public function leaderboard()
    {
        $topUsers = User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })
            ->orderByDesc('xp')
            ->limit(100)
            ->get()
            ->map(function ($user, $index) {
                return [
                    'rank' => $index + 1,
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'level' => $user->level,
                    'xp' => $user->xp,
                    'attempts' => $user->quizAttempts->count(),
                ];
            });

        return response()->json($topUsers);
    }

    /**
     * Export Leaderboard ke Excel
     */
    public function exportLeaderboardExcel()
    {
        return Excel::download(
            new LeaderboardExport(),
            'Laporan_Leaderboard_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Dapatkan filter options (untuk dropdown)
     */
    public function getFilterOptions()
    {
        return response()->json([
            'categories' => Category::select('id', 'name')->get(),
            'classes' => ClassRoom::select('id', 'name')->get(),
            'roles' => ['student', 'teacher', 'admin'],
        ]);
    }
}
