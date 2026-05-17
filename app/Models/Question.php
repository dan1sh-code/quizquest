<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Question extends Model {
    protected $fillable=['quiz_id','question_text','question_image','type','explanation','has_ai_discussion','points','order','difficulty'];
    protected $casts=['has_ai_discussion'=>'boolean'];
    public function quiz()          { return $this->belongsTo(Quiz::class); }
    public function options()       { return $this->hasMany(QuestionOption::class)->orderBy('order'); }
    public function matchingPairs() { return $this->hasMany(MatchingPair::class)->orderBy('order'); }
    public function answers()       { return $this->hasMany(AttemptAnswer::class); }
    public function aiDiscussions() { return $this->hasMany(AiDiscussion::class); }
}
