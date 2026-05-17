<?php
namespace App\Http\Controllers;
use App\Models\{Quiz,User,Category};
use Inertia\{Inertia,Response};
class HomeController extends Controller {
    public function index(): Response {
        return Inertia::render('Welcome',[
            'featuredQuizzes'=>Quiz::where('status','published')->where('is_public',true)->with(['teacher:id,name,avatar','category:id,name,slug,icon,color'])->withCount('attempts')->orderByDesc('attempts_count')->limit(6)->get(),
            'topStudents'=>User::role('student')->select('id','name','avatar','xp','level','school','streak_days')->orderByDesc('xp')->limit(10)->get()->map(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url]),
            'categories'=>Category::where('is_active',true)->withCount('quizzes')->orderByDesc('quizzes_count')->get(),
            'totalStudents'=>User::role('student')->count(),
            'totalQuizzes'=>Quiz::where('status','published')->count(),
        ]);
    }
    public function leaderboard(): Response {
        return Inertia::render('Leaderboard',['students'=>User::role('student')->select('id','name','avatar','xp','level','school','streak_days')->orderByDesc('xp')->limit(50)->get()->map(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url])]);
    }
    public function explore(): Response {
        return Inertia::render('QuizExplore',['quizzes'=>Quiz::where('status','published')->where('is_public',true)->with(['teacher:id,name,avatar','category'])->withCount('attempts')->latest()->paginate(12),'categories'=>Category::where('is_active',true)->get()]);
    }
}
