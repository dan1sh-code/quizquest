<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Category extends Model {
    protected $fillable=['name','slug','icon','color','description','is_active'];
    public function quizzes() { return $this->hasMany(Quiz::class); }
}
