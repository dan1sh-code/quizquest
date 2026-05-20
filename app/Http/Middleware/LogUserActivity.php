<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogUserActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);
        $userBeforeResponse = $request->user();

        $response = $next($request);

        $user = Auth::user() ?: $userBeforeResponse;

        if ($user && $this->shouldLog($request)) {
            ActivityLog::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role' => $user->roles->first()?->name,
                'action' => $this->actionFor($request),
                'description' => $this->descriptionFor($request),
                'method' => $request->method(),
                'path' => '/' . ltrim($request->path(), '/'),
                'route_name' => $request->route()?->getName(),
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 1000),
                'status_code' => $response->getStatusCode(),
                'metadata' => [
                    'duration_ms' => round((microtime(true) - $startedAt) * 1000, 2),
                    'query' => $request->query(),
                ],
            ]);
        }

        return $response;
    }

    private function shouldLog(Request $request): bool
    {
        if ($request->isMethod('HEAD') || $request->is('up')) {
            return false;
        }

        return $request->route() !== null;
    }

    private function actionFor(Request $request): string
    {
        $routeName = (string) $request->route()?->getName();

        if (str_contains($routeName, 'login') || $request->is('login')) {
            return 'login';
        }

        if (str_contains($routeName, 'logout') || $request->is('logout')) {
            return 'logout';
        }

        if (str_contains($routeName, 'export') || str_contains($request->path(), 'export')) {
            return 'export';
        }

        return match ($request->method()) {
            'POST' => 'create',
            'PUT', 'PATCH' => 'update',
            'DELETE' => 'delete',
            default => 'view',
        };
    }

    private function descriptionFor(Request $request): string
    {
        $actionLabels = [
            'login' => 'masuk ke sistem',
            'logout' => 'keluar dari sistem',
            'export' => 'mengekspor data',
            'create' => 'menambahkan data',
            'update' => 'memperbarui data',
            'delete' => 'menghapus data',
            'view' => 'membuka halaman',
        ];

        $action = $this->actionFor($request);
        $routeName = $request->route()?->getName();
        $target = $routeName ? str_replace(['admin.', 'teacher.', 'student.', '.', '-'], ['', '', '', ' ', ' '], $routeName) : $request->path();

        return trim(($actionLabels[$action] ?? 'melakukan aktivitas') . ' ' . $target);
    }
}
