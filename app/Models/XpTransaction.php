<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class XpTransaction extends Model {
    protected $fillable=['user_id','amount','type','description','source_type','source_id','balance_after'];
    public function user()   { return $this->belongsTo(User::class); }
    public function source() { return $this->morphTo(); }
}
