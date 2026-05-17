<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class QuizAttempt extends Model {
    protected $fillable=['quiz_id','user_id','status','score','max_score','percentage','passed','correct_answers','wrong_answers','skipped_answers','time_taken','xp_earned','started_at','completed_at','attempt_number'];
    protected $casts=['started_at'=>'datetime','completed_at'=>'datetime','passed'=>'boolean'];
    public function quiz()    { return $this->belongsTo(Quiz::class); }
    public function user()    { return $this->belongsTo(User::class); }
    public function answers() { return $this->hasMany(AttemptAnswer::class,'attempt_id'); }
}
