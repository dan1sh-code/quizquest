<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\{User,Quiz,QuizAttempt,Category,Setting};
use Carbon\Carbon;
use Inertia\{Inertia,Response};
class AdminDashboardController extends Controller {
    public function index(): Response {
        return Inertia::render('Admin/Dashboard',[
            'stats'=>['total_users'=>User::count(),'total_students'=>User::role('student')->count(),'total_teachers'=>User::role('teacher')->count(),'total_quizzes'=>Quiz::count(),'published_quizzes'=>Quiz::where('status','published')->count(),'total_attempts'=>QuizAttempt::where('status','completed')->count()],
            'userGrowth'=>collect(range(6,0))->map(fn($d)=>['date'=>Carbon::today()->subDays($d)->format('d/m'),'count'=>User::whereDate('created_at',Carbon::today()->subDays($d))->count()]),
            'topCategories'=>Category::withCount('quizzes')->orderByDesc('quizzes_count')->limit(5)->get(),
            'recentUsers'=>User::with('roles')->latest()->limit(10)->get()->map(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url]),
            'recentQuizzes'=>Quiz::with(['teacher:id,name','category:id,name,icon,color'])->latest()->limit(10)->get(),
            'aiEnabled'=>(bool)Setting::get('ai_enabled',true),
        ]);
    }
}
