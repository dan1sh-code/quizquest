<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\{RedirectResponse,Request};
use Illuminate\Support\Facades\{Auth,Hash};
use Illuminate\Validation\Rules;
use Inertia\{Inertia,Response};
class RegisteredUserController extends Controller {
    public function create(): Response { return Inertia::render('Auth/Register'); }
    public function store(Request $r): RedirectResponse {
        $r->validate(['name'=>['required','string','max:255'],'email'=>['required','string','lowercase','email','max:255','unique:'.User::class],'password'=>['required','confirmed',Rules\Password::defaults()],'role'=>['required','in:student,teacher']]);
        $user=User::create(['name'=>$r->name,'email'=>$r->email,'password'=>Hash::make($r->password),'is_active'=>true,'xp'=>0,'level'=>1]);
        $user->assignRole($r->role);
        event(new Registered($user));
        Auth::login($user);
        return redirect()->route('dashboard');
    }
}
