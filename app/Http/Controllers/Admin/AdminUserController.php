<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
use Spatie\Permission\Models\Role;
class AdminUserController extends Controller {
    public function index(Request $r): Response {
        $query=User::with('roles')->withCount('quizAttempts');
        if($s=$r->search) $query->where(fn($q)=>$q->where('name','like',"%$s%")->orWhere('email','like',"%$s%"));
        if($role=$r->role) $query->role($role);
        if($r->has('status')) $query->where('is_active',$r->status==='active');
        return Inertia::render('Admin/Users',['users'=>$query->latest()->paginate(15)->through(fn($u)=>[...$u->toArray(),'avatar_url'=>$u->avatar_url]),'roles'=>Role::all(),'filters'=>$r->only(['search','role','status'])]);
    }
    public function update(Request $r, User $user) {
        $r->validate(['name'=>'required|string|min:2','email'=>'required|email|unique:users,email,'.$user->id,'role'=>'required|in:admin,teacher,student']);
        $user->update($r->only('name','email','school','is_active'));
        $user->syncRoles([$r->role]);
        return back()->with('success','User berhasil diperbarui!');
    }
    public function toggleStatus(User $user) {
        if($user->id===auth()->id()) return back()->with('error','Tidak dapat mengubah status akun sendiri!');
        $user->update(['is_active'=>!$user->is_active]);
        return back()->with('success',$user->fresh()->is_active?'User diaktifkan!':'User dinonaktifkan!');
    }
    public function destroy(User $user) {
        if($user->id===auth()->id()) return back()->with('error','Tidak dapat menghapus akun sendiri!');
        $user->delete(); return back()->with('success','User berhasil dihapus!');
    }
}
