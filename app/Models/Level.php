<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Level extends Model {
    protected $fillable=['level_number','name','badge_emoji','badge_color','xp_required','perks'];
    protected $casts=['perks'=>'array'];
}
