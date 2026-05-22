<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $sessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'device' => $this->deviceName($session->user_agent),
                'browser' => $this->browserName($session->user_agent),
                'ip_address' => $session->ip_address,
                'location' => $this->locationLabel($session->ip_address),
                'last_activity' => date('d M Y H:i', $session->last_activity),
                'is_current' => $session->id === $request->session()->getId(),
            ]);

        $securityLogs = ActivityLog::where('user_id', $user->id)
            ->whereIn('action', ['login', 'logout', 'update'])
            ->latest()
            ->limit(10)
            ->get(['id', 'action', 'description', 'ip_address', 'user_agent', 'created_at'])
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
                'browser' => $this->browserName($log->user_agent),
                'created_at' => $log->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Profile', [
            'profile' => [
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'language' => $user->language ?? 'id',
                'avatar_url' => $user->avatar_url,
                'role' => 'Administrator',
            ],
            'sessions' => $sessions,
            'securityLogs' => $securityLogs,
            'twoFactor' => [
                'enabled' => false,
                'secret' => 'QZQT-' . str_pad((string) $user->id, 6, '0', STR_PAD_LEFT),
                'issuer' => 'QuizQuest',
                'account' => $user->email,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'language' => ['required', 'in:id,en'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        } else {
            unset($validated['avatar']);
        }

        $user->update($validated);

        return back()->with('success', 'Profil admin berhasil diperbarui.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    public function logoutOtherSessions(Request $request): RedirectResponse
    {
        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return back()->with('success', 'Semua sesi lain berhasil dikeluarkan.');
    }

    public function deactivate(Request $request): RedirectResponse
    {
        $request->user()->update(['is_active' => false]);

        return back()->with('success', 'Akun admin dinonaktifkan.');
    }

    private function browserName(?string $agent): string
    {
        if (!$agent) return 'Tidak diketahui';
        if (str_contains($agent, 'Edg')) return 'Microsoft Edge';
        if (str_contains($agent, 'Chrome')) return 'Chrome';
        if (str_contains($agent, 'Firefox')) return 'Firefox';
        if (str_contains($agent, 'Safari')) return 'Safari';
        return 'Browser lain';
    }

    private function deviceName(?string $agent): string
    {
        if (!$agent) return 'Perangkat tidak diketahui';
        if (str_contains($agent, 'Mobile')) return 'Mobile';
        if (str_contains($agent, 'Windows')) return 'Windows PC';
        if (str_contains($agent, 'Macintosh')) return 'Mac';
        if (str_contains($agent, 'Linux')) return 'Linux';
        return 'Desktop';
    }

    private function locationLabel(?string $ip): string
    {
        if (!$ip || in_array($ip, ['127.0.0.1', '::1'], true)) return 'Localhost';
        return 'Tidak tersedia';
    }
}
