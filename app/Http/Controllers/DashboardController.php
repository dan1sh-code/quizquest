<?php
namespace App\Http\Controllers;
use Illuminate\Http\{Request,RedirectResponse};
class DashboardController extends Controller {
    public function index(Request $r): RedirectResponse {
        $u=$r->user();
        if($u->isAdmin())   return redirect()->route('admin.dashboard');
        if($u->isTeacher()) return redirect()->route('teacher.dashboard');
        return redirect()->route('student.dashboard');
    }
}
