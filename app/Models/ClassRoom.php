<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class ClassRoom extends Model {
    protected $table='classes';
    protected $fillable=['teacher_id','name','code','description','cover_image','subject','grade_level','is_active','max_students'];
    public function teacher()  { return $this->belongsTo(User::class,'teacher_id'); }
    public function students() { return $this->belongsToMany(User::class,'class_students','class_id','user_id')->withPivot('status','joined_at'); }
    public function quizzes()  { return $this->hasMany(Quiz::class,'class_id'); }
    protected static function booted(): void {
        static::creating(function($c){ if(!$c->code) $c->code=strtoupper(Str::random(6)); });
    }
}
