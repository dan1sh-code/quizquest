<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
use App\Models\{ClassRoom,QuizAttempt};
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class TeacherDashboardController extends Controller {
    public function index(Request $r): Response {
        $user=$r->user();
        return Inertia::render('Teacher/Dashboard',[
            'totalClasses'  =>$user->taughtClasses()->count(),
            'totalQuizzes'  =>$user->quizzes()->count(),
            'totalStudents' =>ClassRoom::where('teacher_id',$user->id)->withCount('students')->get()->sum('students_count'),
            'totalAttempts' =>QuizAttempt::whereHas('quiz',fn($q)=>$q->where('teacher_id',$user->id))->where('status','completed')->count(),
            'myQuizzes'     =>$user->quizzes()->with('category:id,name,icon,color')->withCount('attempts')->latest()->limit(6)->get(),
            'myClasses'     =>$user->taughtClasses()->withCount('students')->latest()->limit(6)->get(),
            'recentAttempts'=>QuizAttempt::whereHas('quiz',fn($q)=>$q->where('teacher_id',$user->id))->with(['user:id,name,avatar,level,xp','quiz:id,title'])->where('status','completed')->latest('completed_at')->limit(10)->get()->map(fn($a)=>[...$a->toArray(),'user'=>[...$a->user->toArray(),'avatar_url'=>$a->user->avatar_url]]),
            'pendingEssays' =>QuizAttempt::whereHas('quiz',fn($q)=>$q->where('teacher_id',$user->id))->whereHas('answers',fn($q)=>$q->where('grade_status','pending'))->with(['user:id,name','quiz:id,title'])->latest()->limit(5)->get(),
        ]);
    }
}
