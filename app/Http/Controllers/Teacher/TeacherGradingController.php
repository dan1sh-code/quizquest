<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
use App\Models\{AttemptAnswer,QuizAttempt,Setting};
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class TeacherGradingController extends Controller {
    public function index(Request $r): Response {
        return Inertia::render('Teacher/Grading',['pendingAnswers'=>AttemptAnswer::whereHas('attempt.quiz',fn($q)=>$q->where('teacher_id',$r->user()->id))->where('grade_status','pending')->with(['attempt.user:id,name,avatar','question:id,question_text,points'])->latest()->paginate(20)->through(fn($a)=>[...$a->toArray(),'attempt'=>[...$a->attempt->toArray(),'user'=>[...$a->attempt->user->toArray(),'avatar_url'=>$a->attempt->user->avatar_url]]])]);
    }
    public function grade(Request $r, AttemptAnswer $answer) {
        $r->validate(['points_earned'=>'required|integer|min:0','teacher_feedback'=>'nullable|string|max:500']);
        $answer->update(['points_earned'=>$r->points_earned,'teacher_feedback'=>$r->teacher_feedback,'grade_status'=>'graded','is_correct'=>$r->points_earned>0]);
        $attempt=$answer->attempt;
        $allGraded=!$attempt->answers()->where('grade_status','pending')->exists();
        if($allGraded){
            $totalScore=$attempt->answers()->sum('points_earned');
            $pct=$attempt->max_score>0?round(($totalScore/$attempt->max_score)*100,2):0;
            
            $quiz=$attempt->quiz;
            $xpEarned=$quiz->xp_reward+(int)Setting::get('quiz_xp_base',10);
            if($pct==100) $xpEarned+=(int)Setting::get('quiz_xp_perfect',50);
            elseif($pct>=80) $xpEarned+=20;

            $attempt->update(['status'=>'completed','score'=>$totalScore,'percentage'=>$pct,'passed'=>$pct>=$attempt->quiz->passing_score,'completed_at'=>now(),'xp_earned'=>$xpEarned]);
            
            $attempt->user->addXp($xpEarned,'quiz_complete',"Menyelesaikan: {$quiz->title}",$quiz);
            $this->updateStreak($attempt->user,$xpEarned);
        }
        return back()->with('success','Essay dinilai! ✅');
    }

    private function updateStreak($user, int $xp): void {
        $today=$user->streaks()->whereDate('date',today())->first();
        if($today){ $today->increment('quizzes_done'); $today->increment('xp_earned',$xp); return; }
        $user->streaks()->create(['date'=>today(),'quizzes_done'=>1,'xp_earned'=>$xp]);
        $hadYesterday=$user->streaks()->whereDate('date',today()->subDay())->exists();
        $newStreak=$hadYesterday?$user->streak_days+1:1;
        $user->update(['streak_days'=>$newStreak,'last_active'=>today()]);
        $streakXp=(int)Setting::get('quiz_xp_streak',5);
        if($streakXp>0) $user->addXp($streakXp,'streak',"Streak {$newStreak} hari!");
    }
}
