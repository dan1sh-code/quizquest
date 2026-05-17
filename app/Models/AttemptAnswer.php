<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AttemptAnswer extends Model {
    protected $fillable=['attempt_id','question_id','selected_option_id','essay_answer','fill_answer','matching_answer','is_correct','points_earned','time_spent','teacher_feedback','grade_status'];
    protected $casts=['matching_answer'=>'array','is_correct'=>'boolean'];
    public function attempt()       { return $this->belongsTo(QuizAttempt::class,'attempt_id'); }
    public function question()      { return $this->belongsTo(Question::class); }
    public function selectedOption(){ return $this->belongsTo(QuestionOption::class,'selected_option_id'); }
}
