<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'                  => $user->id,
                    'name'                => $user->name,
                    'username'            => $user->username,
                    'email'               => $user->email,
                    'avatar'              => $user->avatar,
                    'avatar_url'          => $user->avatar_url,
                    'xp'                  => $user->xp,
                    'level'               => $user->level,
                    'streak_days'         => $user->streak_days,
                    'is_active'           => $user->is_active,
                    'school'              => $user->school,
                    'grade'               => $user->grade,
                    'bio'                 => $user->bio,
                    'phone'               => $user->phone,
                    'subject_expertise'   => $user->subject_expertise,
                    'education'           => $user->education,
                    'certification'       => $user->certification,
                    'website'             => $user->website,
                    'linkedin'            => $user->linkedin,
                    'portfolio_path'      => $user->portfolio_path,
                    'portfolio_name'      => $user->portfolio_name,
                    'portfolio_url'       => $user->portfolio_path ? asset("storage/{$user->portfolio_path}") : null,
                    'roles'               => $user->roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name]),
                    'level_data'          => $user->level_data,
                    'xp_progress_percent' => $user->xp_progress_percent,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'notifications' => $user ? [
                'unread_count' => $user->unreadNotifications()->count(),
                'items' => $user->notifications()
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn ($notification) => [
                        'id' => $notification->id,
                        'kind' => $notification->data['kind'] ?? 'info',
                        'title' => $notification->data['title'] ?? 'Notifikasi',
                        'message' => $notification->data['message'] ?? '',
                        'url' => $notification->data['url'] ?? null,
                        'read_at' => $notification->read_at,
                        'created_at' => $notification->created_at?->diffForHumans(),
                    ]),
            ] : ['unread_count' => 0, 'items' => []],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
