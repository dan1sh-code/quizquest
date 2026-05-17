<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class AdminAnnouncementController extends Controller {
    public function index(): Response { return Inertia::render('Admin/Announcements',['announcements'=>Announcement::with('creator:id,name')->latest()->paginate(15)]); }
    public function store(Request $r) {
        $r->validate(['title'=>'required|string','content'=>'required|string','type'=>'required|in:info,warning,success,danger','target_role'=>'required|string']);
        Announcement::create([...$r->only('title','content','type','target_role','is_active','expires_at'),'user_id'=>auth()->id()]);
        return back()->with('success','Pengumuman dibuat!');
    }
    public function update(Request $r, Announcement $announcement) { $announcement->update($r->only('title','content','type','target_role','is_active','expires_at')); return back()->with('success','Pengumuman diperbarui!'); }
    public function destroy(Announcement $announcement) { $announcement->delete(); return back()->with('success','Pengumuman dihapus!'); }
}
