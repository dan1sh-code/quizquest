<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Setting extends Model {
    protected $fillable=['key','value','group','type','label'];
    public static function get(string $key, $default=null) {
        $s=static::where('key',$key)->first();
        if(!$s) return $default;
        return match($s->type) { 'boolean'=>(bool)$s->value,'integer'=>(int)$s->value,'json'=>json_decode($s->value,true),default=>$s->value };
    }
    public static function set(string $key, $value): void { static::updateOrCreate(['key'=>$key],['value'=>$value]); }
}
