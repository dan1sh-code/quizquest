<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Streak extends Model {
    protected $fillable=['user_id','date','quizzes_done','xp_earned'];
    protected $casts=['date'=>'date'];
    public function user() { return $this->belongsTo(User::class); }
}
