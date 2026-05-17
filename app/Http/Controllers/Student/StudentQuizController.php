<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\{Quiz, QuizAttempt, AttemptAnswer, Setting};
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class StudentQuizController extends Controller
{
    public function start(Request $request, Quiz $quiz)
    {
        if (!$quiz->isAvailable()) return redirect()->route('student.dashboard')->with('error','Quiz tidak tersedia.');
        $user = $request->user();
        $attemptCount = $user->quizAttempts()->where('quiz_id',$quiz->id)->where('status','completed')->count();
        if ($attemptCount >= $quiz->max_attempts) return redirect()->route('student.dashboard')->with('error',"Kamu sudah mencapai batas {$quiz->max_attempts}x percobaan.");
        $inProgress = $user->quizAttempts()->where('quiz_id',$quiz->id)->where('status','in_progress')->first();
        if ($inProgress) return redirect()->route('student.quiz.take',$inProgress->id);
        $quiz->load(['questions:id,quiz_id,question_text,type,points,order','category:id,name,icon,color','teacher:id,name,avatar']);
        return Inertia::render('Student/QuizStart',['quiz'=>$quiz,'attemptCount'=>$attemptCount]);
    }

    public function begin(Request $request, Quiz $quiz)
    {
        $user = $request->user();
        $attempt = QuizAttempt::create([
            'quiz_id'=>$quiz->id,'user_id'=>$user->id,'status'=>'in_progress',
            'max_score'=>$quiz->questions()->sum('points'),'started_at'=>now(),
            'attempt_number'=>$user->quizAttempts()->where('quiz_id',$quiz->id)->count()+1,
        ]);
        return redirect()->route('student.quiz.take',$attempt->id);
    }

    public function take(Request $request, QuizAttempt $attempt)
    {
        if ($attempt->user_id !== $request->user()->id) abort(403);
        if ($attempt->status !== 'in_progress') return redirect()->route('student.quiz.result',$attempt->id);
        $quiz = $attempt->quiz->load(['questions.options','questions.matchingPairs']);
        $questions = $quiz->shuffle_questions ? $quiz->questions->shuffle()->values() : $quiz->questions->sortBy('order')->values();
        return Inertia::render('Student/QuizTake',[
            'attempt'  => $attempt->only('id','quiz_id','started_at','max_score'),
            'quiz'     => $quiz->only('id','title','time_limit','time_per_question','question_time_limit','shuffle_options','passing_score'),
            'questions'=> $questions,
        ]);
    }

    public function submit(Request $request, QuizAttempt $attempt)
    {
        if ($attempt->user_id !== $request->user()->id) abort(403);
        $quiz      = $attempt->quiz->load('questions.options','questions.matchingPairs');
        $answers   = $request->input('answers',[]);
        $timeTaken = $request->input('time_taken',0);
        $totalScore=$correctCount=$wrongCount=$skipCount=0; $hasEssay=false;

        foreach ($quiz->questions as $q) {
            $answerData=$answers[$q->id]??null; $pointsEarned=0; $isCorrect=null;
            $record=['attempt_id'=>$attempt->id,'question_id'=>$q->id];
            if (is_null($answerData)) { $skipCount++; $isCorrect=false; }
            else {
                switch ($q->type) {
                    case 'multiple_choice': case 'true_false':
                        $opt=$q->options->find($answerData); $isCorrect=$opt?->is_correct??false; $record['selected_option_id']=$answerData; break;
                    case 'fill_blank':
                        $correct=strtolower(trim((string) ($q->options->where('is_correct',true)->first()?->option_text??'')));
                        $isCorrect=strtolower(trim(is_string($answerData)?$answerData:''))===$correct; $record['fill_answer']=is_string($answerData)?$answerData:''; break;
                    case 'essay':
                        $record['essay_answer']=$answerData; $record['grade_status']='pending'; $isCorrect=null; $hasEssay=true; break;
                    case 'matching':
                        $pairs=$q->matchingPairs; $correctPairs=0; $answerArr=is_array($answerData)?$answerData:[];
                        foreach($pairs as $pair){ if(isset($answerArr[$pair->id])&&$answerArr[$pair->id]===$pair->right_item) $correctPairs++; }
                        $isCorrect=$correctPairs===$pairs->count();
                        $pointsEarned=$pairs->count()>0?(int)(($correctPairs/$pairs->count())*$q->points):0;
                        $record['matching_answer']=$answerData; break;
                }
                if (!in_array($q->type,['matching','essay'])) $pointsEarned=$isCorrect?$q->points:0;
                if ($q->type==='essay') $pointsEarned=0;
            }
            if ($isCorrect===true) $correctCount++;
            elseif ($isCorrect===false&&!is_null($answerData)) $wrongCount++;
            $totalScore+=$pointsEarned;
            AttemptAnswer::updateOrCreate(
                ['attempt_id'=>$attempt->id,'question_id'=>$q->id],
                array_merge($record,['is_correct'=>$isCorrect,'points_earned'=>$pointsEarned,'grade_status'=>$record['grade_status']??'auto_graded'])
            );
        }

        $maxScore=$quiz->questions->sum('points');
        $percentage=$maxScore>0?round(($totalScore/$maxScore)*100,2):0;
        $passed=$percentage>=$quiz->passing_score;
        $status = $hasEssay ? 'grading' : 'completed';
        $xpEarned = 0;
        
        if (!$hasEssay) {
            $xpEarned=$quiz->xp_reward+(int)Setting::get('quiz_xp_base',10);
            if($percentage==100) $xpEarned+=(int)Setting::get('quiz_xp_perfect',50);
            elseif($percentage>=80) $xpEarned+=20;
        }

        $attempt->update(['status'=>$status,'score'=>$totalScore,'max_score'=>$maxScore,'percentage'=>$percentage,'passed'=>$passed,'correct_answers'=>$correctCount,'wrong_answers'=>$wrongCount,'skipped_answers'=>$skipCount,'time_taken'=>$timeTaken,'xp_earned'=>$xpEarned,'completed_at'=>now()]);
        
        if (!$hasEssay) {
            $request->user()->addXp($xpEarned,'quiz_complete',"Menyelesaikan: {$quiz->title}",$quiz);
            $this->updateStreak($request->user(),$xpEarned);
        }
        
        return redirect()->route('student.quiz.result',$attempt->id);
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

    public function result(Request $request, QuizAttempt $attempt): Response
    {
        if ($attempt->user_id !== $request->user()->id) abort(403);
        $attempt->load(['quiz:id,title,passing_score,show_answer_after,max_attempts','quiz.questions.options','quiz.questions.matchingPairs','answers.question.options','answers.question.matchingPairs','answers.selectedOption']);
        $rank=QuizAttempt::where('quiz_id',$attempt->quiz_id)->where('status','completed')->where('percentage','>',$attempt->percentage)->count()+1;
        $totalParticipants=QuizAttempt::where('quiz_id',$attempt->quiz_id)->where('status','completed')->count();
        if ($attempt->status === 'grading') $rank = null;
        return Inertia::render('Student/QuizResult',['attempt'=>$attempt,'rank'=>$rank,'totalParticipants'=>$totalParticipants]);
    }

    public function history(Request $request): Response
    {
        return Inertia::render('Student/History',['attempts'=>$request->user()->quizAttempts()->with(['quiz:id,title,category_id','quiz.category:id,name,icon,color'])->where('status','completed')->latest('completed_at')->paginate(15)]);
    }
}
