<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\{Quiz, User, Achievement};
use App\Notifications\TeacherStudentActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class StudentDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('roles');

        $totalAttempts = $user->quizAttempts()->where('status','completed')->count();
        $avgScore      = $user->quizAttempts()->where('status','completed')->avg('percentage') ?? 0;

        $recentAttempts = $user->quizAttempts()
            ->with(['quiz:id,title,category_id','quiz.category:id,name,icon,color'])
            ->where('status','completed')->latest('completed_at')->limit(5)->get();

        $classIds = $user->classes()->pluck('classes.id');
        $availableQuizzes = Quiz::where(fn($q) => $q->whereIn('class_id', $classIds)->orWhere('is_public', true))->where('status','published')
            ->with(['teacher:id,name,avatar','category:id,name,icon,color'])
            ->withCount(['questions','attempts'])
            ->whereDoesntHave('attempts',fn($q)=>$q->where('user_id',$user->id)->where('status','completed'))
            ->limit(6)->get();

        $leaderboard = User::role('student')->select('id','name','avatar','xp','level','school','streak_days')
            ->orderByDesc('xp')->limit(10)->get()
            ->map(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url]);

        $userAchievements = $user->achievements()->latest('earned_at')->limit(6)->get();
        $allAchievements  = Achievement::where('is_active',true)->get();

        $streakData = collect(range(6,0))->map(function($d) use($user){
            $date   = Carbon::today()->subDays($d);
            $streak = $user->streaks()->whereDate('date',$date)->first();
            return ['date'=>$date->format('D'),'done'=>$streak?->quizzes_done??0,'xp'=>$streak?->xp_earned??0];
        });

        return Inertia::render('Student/Dashboard',[
            'totalAttempts'    => $totalAttempts,
            'avgScore'         => round($avgScore,1),
            'totalXp'          => $user->xp,
            'recentAttempts'   => $recentAttempts,
            'availableQuizzes' => $availableQuizzes,
            'leaderboard'      => $leaderboard,
            'userAchievements' => $userAchievements,
            'allAchievements'  => $allAchievements,
            'streakData'       => $streakData,
        ]);
    }

    public function joinQuiz(Request $request)
    {
        $request->validate(['code'=>'required|string|max:10']);
        $quiz = Quiz::where('join_code',strtoupper(trim($request->code)))->first();
        if (!$quiz) return back()->with('error','Kode quiz tidak ditemukan!');
        if (!$quiz->isAvailable()) return back()->with('error','Quiz ini sedang tidak tersedia!');

        if ($quiz->class_id) {
            $classroom = $quiz->classroom()->with('teacher')->first();
            $alreadyJoined = $request->user()->classes()->where('classes.id', $quiz->class_id)->exists();

            if ($classroom && !$alreadyJoined) {
                $classroom->students()->attach($request->user()->id, [
                    'status' => 'active',
                    'joined_at' => now(),
                ]);
                $classroom->teacher?->notify(new TeacherStudentActivity('student_joined_class', $request->user(), $classroom));
            }
        }

        return redirect()->route('student.quiz.start',$quiz->id);
    }

    public function leaderboard()
    {
        $leaderboard = collect(User::role('student')->select('id','name','avatar','xp','level','school','streak_days')
            ->orderByDesc('xp')->get())
            ->map(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url]);

        return Inertia::render('Student/Leaderboard', [
            'leaderboard' => $leaderboard,
        ]);
    }

    public function achievements(Request $request)
    {
        $user = $request->user();
        $userAchievements = $user->achievements()->get();
        $allAchievements = Achievement::where('is_active', true)->get();

        return Inertia::render('Student/Achievements', [
            'userAchievements' => $userAchievements,
            'allAchievements' => $allAchievements,
        ]);
    }

    public function classes(Request $request)
    {
        $classes = $request->user()->classes()
            ->with(['teacher:id,name,avatar'])
            ->withCount(['students', 'quizzes'])
            ->get()
            ->map(function ($cls) {
                if ($cls->teacher) {
                    $cls->teacher->avatar_url = $cls->teacher->avatar_url;
                }
                return $cls;
            });

        return Inertia::render('Student/Classes', [
            'classes' => $classes,
        ]);
    }
}
