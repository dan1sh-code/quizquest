<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class QuizReview extends Model {
    protected $fillable=['quiz_id','user_id','rating','comment'];
    public function quiz() { return $this->belongsTo(Quiz::class); }
    public function user() { return $this->belongsTo(User::class); }
}
