<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class Quiz extends Model {
    use SoftDeletes;
    protected $fillable=['teacher_id','class_id','category_id','title','slug','description','cover_image','join_code','status','difficulty','time_limit','time_per_question','question_time_limit','max_attempts','shuffle_questions','shuffle_options','show_result_immediately','show_answer_after','is_public','passing_score','xp_reward','starts_at','ends_at','tags'];
    protected $casts=['tags'=>'array','starts_at'=>'datetime','ends_at'=>'datetime','shuffle_questions'=>'boolean','shuffle_options'=>'boolean','show_result_immediately'=>'boolean','show_answer_after'=>'boolean','is_public'=>'boolean','time_per_question'=>'boolean'];
    protected static function booted(): void {
        static::creating(function(Quiz $q){
            if(!$q->join_code) $q->join_code=strtoupper(Str::random(8));
            if(!$q->slug)      $q->slug=Str::slug($q->title).'-'.time();
        });
    }
    public function teacher()   { return $this->belongsTo(User::class,'teacher_id'); }
    public function classroom() { return $this->belongsTo(ClassRoom::class,'class_id'); }
    public function category()  { return $this->belongsTo(Category::class); }
    public function questions() { return $this->hasMany(Question::class)->orderBy('order'); }
    public function attempts()  { return $this->hasMany(QuizAttempt::class); }
    public function reviews()   { return $this->hasMany(QuizReview::class); }
    public function isAvailable(): bool {
        if($this->status!=='published') return false;
        if($this->starts_at&&now()->lt($this->starts_at)) return false;
        if($this->ends_at  &&now()->gt($this->ends_at))   return false;
        return true;
    }
}
