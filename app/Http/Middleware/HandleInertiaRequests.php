<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use App\Models\Announcement;
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
        $role = $user?->roles->first()?->name;

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
                    'roles'               => $user->roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name]),
                    'level_data'          => $user->level_data,
                    'xp_progress_percent' => $user->xp_progress_percent,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'notifications' => fn() => $user ? Announcement::query()
                ->where('is_active', true)
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })
                ->where(function ($query) use ($role) {
                    $query->where('target_role', 'all')
                        ->when($role, fn($query) => $query->orWhere('target_role', $role));
                })
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'content', 'type', 'target_role', 'created_at'])
                ->map(fn($announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'type' => $announcement->type,
                    'target_role' => $announcement->target_role,
                    'created_at' => $announcement->created_at,
                    'created_at_human' => $announcement->created_at->diffForHumans(),
                ])
                : [],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
