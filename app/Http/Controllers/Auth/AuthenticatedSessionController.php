<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\{RedirectResponse,Request};
use Illuminate\Support\Facades\{Auth,Route};
use Inertia\{Inertia,Response};
class AuthenticatedSessionController extends Controller {
    public function create(): Response { return Inertia::render('Auth/Login',['canResetPassword'=>Route::has('password.request'),'status'=>session('status')]); }
    public function store(LoginRequest $r): RedirectResponse { $r->authenticate(); $r->session()->regenerate(); return redirect()->intended(route('dashboard',absolute:false)); }
    public function destroy(Request $r): RedirectResponse { Auth::guard('web')->logout(); $r->session()->invalidate(); $r->session()->regenerateToken(); return redirect('/'); }
}
