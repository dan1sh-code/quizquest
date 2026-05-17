<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Achievement extends Model {
    protected $fillable=['name','slug','description','badge_emoji','badge_image','type','threshold','xp_reward','rarity','is_active'];
    protected $casts=['is_active'=>'boolean'];
    public function users() { return $this->belongsToMany(User::class,'user_achievements')->withPivot('earned_at'); }
}
