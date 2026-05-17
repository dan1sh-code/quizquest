<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Announcement extends Model {
    protected $fillable=['user_id','title','content','type','target_role','is_active','expires_at'];
    protected $casts=['expires_at'=>'datetime','is_active'=>'boolean'];
    public function creator() { return $this->belongsTo(User::class,'user_id'); }
}
