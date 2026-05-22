<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class AdminSettingsController extends Controller {
    public function index(): Response { return Inertia::render('Admin/Settings',['settings'=>Setting::all()->keyBy('key')->map(fn($s)=>$s->value)]); }
    public function update(Request $r) {
        foreach(['site_name','site_tagline','openrouter_model','quiz_xp_base','quiz_xp_perfect','quiz_xp_streak'] as $k) if($r->has($k)) Setting::set($k,$r->input($k));
        foreach(['ai_enabled','allow_registration','maintenance_mode'] as $k) Setting::set($k,$r->has($k)?'1':'0');
        if($r->filled('openrouter_api_key')) Setting::set('openrouter_api_key',$r->openrouter_api_key);
        return back()->with('success','Pengaturan berhasil disimpan! ✅');
    }
}
