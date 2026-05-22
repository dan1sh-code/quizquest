import React, { useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import {
    Activity,
    Clock,
    Download,
    Eye,
    LogIn,
    LogOut,
    Pencil,
    Plus,
    Search,
    ShieldAlert,
    Trash2,
    Users,
    X,
} from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import { cn } from '@/lib/utils'

type ActivityLog = {
    id: number
    user_name: string
    user_email?: string
    role: string
    action: string
    description: string
    method: string
    path: string
    ip_address?: string
    status_code?: number
    created_at: string
    duration_ms?: number
}

type Paginated<T> = {
    data: T[]
    current_page: number
    last_page: number
    total: number
    from?: number
    to?: number
    prev_page_url?: string
    next_page_url?: string
}

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    teacher: 'Guru',
    student: 'Murid',
    unknown: 'Tidak diketahui',
}

const actionLabels: Record<string, string> = {
    view: 'Lihat',
    create: 'Tambah',
    update: 'Ubah',
    delete: 'Hapus',
    export: 'Export',
    login: 'Login',
    logout: 'Logout',
}

const actionIcons: Record<string, React.ElementType> = {
    view: Eye,
    create: Plus,
    update: Pencil,
    delete: Trash2,
    export: Download,
    login: LogIn,
    logout: LogOut,
}

export default function Logs({ logs, filters = {}, stats }: { logs: Paginated<ActivityLog>, filters: any, stats: any }) {
    const [search, setSearch] = useState(filters.search || '')
    const [role, setRole] = useState(filters.role || '')
    const [action, setAction] = useState(filters.action || '')

    const hasFilters = useMemo(() => search || role || action, [search, role, action])

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const next = {
            search,
            role,
            action,
            ...overrides,
        }

        router.get('/admin/logs', next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    }

    const resetFilters = () => {
        setSearch('')
        setRole('')
        setAction('')
        router.get('/admin/logs', {}, { preserveState: true, replace: true })
    }

    return (
        <AppLayout title="Log Aktivitas" subtitle="Pantau aktivitas admin, guru, dan murid di QuizQuest">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    <StatCard icon={Activity} label="Total Log" value={stats.total} tone="violet" />
                    <StatCard icon={Clock} label="Hari Ini" value={stats.today} tone="emerald" />
                    <StatCard icon={ShieldAlert} label="Admin" value={stats.admins} tone="rose" />
                    <StatCard icon={Users} label="Guru" value={stats.teachers} tone="blue" />
                    <StatCard icon={Users} label="Murid" value={stats.students} tone="amber" />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Riwayat Aktivitas</h2>
                                <p className="text-sm text-slate-500">Menampilkan {logs.from || 0}-{logs.to || 0} dari {logs.total} aktivitas</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        placeholder="Cari user, email, path..."
                                        className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:border-violet-500 outline-none"
                                    />
                                </div>

                                <select
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value)
                                        applyFilters({ role: e.target.value })
                                    }}
                                    className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500"
                                >
                                    <option value="">Semua Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="teacher">Guru</option>
                                    <option value="student">Murid</option>
                                </select>

                                <select
                                    value={action}
                                    onChange={(e) => {
                                        setAction(e.target.value)
                                        applyFilters({ action: e.target.value })
                                    }}
                                    className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500"
                                >
                                    <option value="">Semua Aksi</option>
                                    {Object.entries(actionLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>

                                {hasFilters && (
                                    <button onClick={resetFilters} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <X className="w-4 h-4" />
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-5 py-4">Waktu</th>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Aktivitas</th>
                                    <th className="px-5 py-4">Request</th>
                                    <th className="px-5 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-14 text-center">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Activity className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white">Belum ada log yang cocok</p>
                                            <p className="text-sm text-slate-500">Coba ubah filter atau lakukan aktivitas baru di aplikasi.</p>
                                        </td>
                                    </tr>
                                ) : logs.data.map((log) => (
                                    <LogRow key={log.id} log={log} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500">Halaman {logs.current_page} dari {logs.last_page}</p>
                        <div className="flex gap-2">
                            <button
                                disabled={!logs.prev_page_url}
                                onClick={() => router.get(logs.prev_page_url || '/admin/logs', {}, { preserveScroll: true })}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Sebelumnya
                            </button>
                            <button
                                disabled={!logs.next_page_url}
                                onClick={() => router.get(logs.next_page_url || '/admin/logs', {}, { preserveScroll: true })}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function StatCard({ icon: Icon, label, value, tone }: { icon: React.ElementType, label: string, value: number, tone: string }) {
    const tones: Record<string, string> = {
        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300',
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-semibold">{label}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{Number(value || 0).toLocaleString()}</p>
                </div>
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', tones[tone])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}

function LogRow({ log }: { log: ActivityLog }) {
    const Icon = actionIcons[log.action] || Activity
    const isError = Number(log.status_code || 0) >= 400

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-5 py-4 whitespace-nowrap">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{log.created_at}</p>
                <p className="text-xs text-slate-500">{log.duration_ms ? `${log.duration_ms} ms` : 'Durasi tidak tersedia'}</p>
            </td>
            <td className="px-5 py-4">
                <div className="min-w-48">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{log.user_name}</p>
                    <p className="text-xs text-slate-500 truncate">{log.user_email}</p>
                    <span className={cn(
                        'inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border',
                        log.role === 'admin' && 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800',
                        log.role === 'teacher' && 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
                        log.role === 'student' && 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800',
                        log.role === 'unknown' && 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    )}>
                        {roleLabels[log.role] || log.role}
                    </span>
                </div>
            </td>
            <td className="px-5 py-4">
                <div className="flex items-start gap-3 min-w-72">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{actionLabels[log.action] || log.action}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{log.description}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4">
                <div className="min-w-56">
                    <p className="text-xs font-black text-slate-500 uppercase">{log.method}</p>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">{log.path}</p>
                    <p className="text-xs text-slate-500">{log.ip_address || '-'}</p>
                </div>
            </td>
            <td className="px-5 py-4 text-right">
                <span className={cn(
                    'inline-flex items-center justify-center min-w-14 px-2.5 py-1 rounded-full text-xs font-black border',
                    isError
                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                )}>
                    {log.status_code || '-'}
                </span>
            </td>
        </tr>
    )
}
