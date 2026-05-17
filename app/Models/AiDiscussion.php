<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AiDiscussion extends Model {
    protected $fillable=['question_id','attempt_id','user_id','conversation','model_used','tokens_used'];
    protected $casts=['conversation'=>'array'];
    public function question() { return $this->belongsTo(Question::class); }
    public function attempt()  { return $this->belongsTo(QuizAttempt::class,'attempt_id'); }
    public function user()     { return $this->belongsTo(User::class); }
}
