<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = ActivityLog::query()
            ->when($request->search, function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('user_name', 'like', "%{$search}%")
                        ->orWhere('user_email', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('path', 'like', "%{$search}%");
                });
            })
            ->when($request->role, fn ($query, string $role) => $query->where('role', $role))
            ->when($request->action, fn ($query, string $action) => $query->where('action', $action))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (ActivityLog $log) => [
                'id' => $log->id,
                'user_name' => $log->user_name ?? 'User terhapus',
                'user_email' => $log->user_email,
                'role' => $log->role ?? 'unknown',
                'action' => $log->action,
                'description' => $log->description,
                'method' => $log->method,
                'path' => $log->path,
                'ip_address' => $log->ip_address,
                'status_code' => $log->status_code,
                'created_at' => $log->created_at?->format('d M Y H:i'),
                'duration_ms' => $log->metadata['duration_ms'] ?? null,
            ]);

        return Inertia::render('Admin/Logs', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'role', 'action']),
            'stats' => [
                'total' => ActivityLog::count(),
                'today' => ActivityLog::whereDate('created_at', today())->count(),
                'admins' => ActivityLog::where('role', 'admin')->count(),
                'teachers' => ActivityLog::where('role', 'teacher')->count(),
                'students' => ActivityLog::where('role', 'student')->count(),
            ],
        ]);
    }
}
