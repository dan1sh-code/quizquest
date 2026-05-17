import React from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, School, FileText, CheckCircle, Target, TrendingUp, Tag, ClipboardList, Bot, AlertTriangle } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import AppLayout from '@/Components/Layout/AppLayout'
import StatCard from '@/Components/ui/StatCard'
import { Link } from '@inertiajs/react'
import { avatarUrl } from '@/lib/utils'
import type { User, Quiz, Category } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface GrowthPoint { date: string; count: number }

interface Props {
    auth: { user: User }
    stats: {
        total_users: number
        total_students: number
        total_teachers: number
        total_quizzes: number
        published_quizzes: number
        total_attempts: number
    }
    userGrowth: GrowthPoint[]
    topCategories: Category[]
    recentUsers: User[]
    recentQuizzes: Quiz[]
    aiEnabled: boolean
}

export default function AdminDashboard({ auth, stats, userGrowth, topCategories, recentUsers, recentQuizzes, aiEnabled }: Props) {
    const chartData = {
        labels: userGrowth.map(d => d.date),
        datasets: [{
            label: 'User Baru',
            data: userGrowth.map(d => d.count),
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.12)',
            borderWidth: 3,
            fill: true,
            tension: 0.45,
            pointBackgroundColor: '#7c3aed',
            pointRadius: 5,
            pointHoverRadius: 8,
        }]
    }

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { precision: 0 } },
            x: { grid: { display: false } },
        },
    }

    return (
        <AppLayout title="Admin Dashboard" subtitle="Pantau & kelola seluruh platform QuizQuest">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                    { icon:<Users className="w-6 h-6"/>, label:'Total User',        value: stats.total_users,          color:'violet' as const },
                    { icon:<GraduationCap className="w-6 h-6"/>, label:'Murid',           value: stats.total_students,        color:'blue' as const },
                    { icon:<School className="w-6 h-6"/>, label:'Guru',             value: stats.total_teachers,        color:'emerald' as const },
                    { icon:<FileText className="w-6 h-6"/>, label:'Total Quiz',        value: stats.total_quizzes,         color:'amber' as const },
                    { icon:<CheckCircle className="w-6 h-6"/>, label:'Quiz Aktif',        value: stats.published_quizzes,     color:'emerald' as const },
                    { icon:<Target className="w-6 h-6"/>, label:'Total Percobaan',   value: stats.total_attempts,        color:'rose' as const },
                ].map((s, i) => (
                    <StatCard key={s.label} index={i} icon={s.icon} label={s.label} value={s.value.toLocaleString()} color={s.color} />
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Pertumbuhan User (7 Hari)</h3>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold">Live</span>
                    </div>
                    <Line data={chartData} options={chartOptions} height={100} />
                </div>

                {/* Top Categories */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><Tag className="w-5 h-5"/> Kategori Populer</h3>
                    <div className="space-y-4">
                        {topCategories.map((cat, i) => (
                            <div key={cat.id} className="flex items-center gap-3">
                                <span className="text-xl">{cat.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                                        <span className="text-slate-500">{cat.quizzes_count}</span>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                                            style={{ width: `${topCategories[0] ? (cat.quizzes_count! / topCategories[0].quizzes_count! * 100) : 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Users */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Users className="w-5 h-5"/> User Terbaru</h3>
                        <Link href="/admin/users" className="text-sm text-violet-600 hover:underline font-medium">Kelola Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {recentUsers.slice(0,7).map((u) => (
                            <div key={u.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <img src={u.avatar_url} className="w-9 h-9 rounded-full object-cover" alt={u.name} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{u.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                </div>
                                {u.roles?.map(r => (
                                    <span key={r.name} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.name==='admin' ? 'bg-red-100 text-red-700' : r.name==='teacher' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {r.name==='admin' ? 'Admin' : r.name==='teacher' ? 'Guru' : 'Murid'}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Quizzes */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-5 h-5"/> Quiz Terbaru</h3>
                        <Link href="/admin/quizzes" className="text-sm text-violet-600 hover:underline font-medium">Lihat Semua</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {recentQuizzes.slice(0,7).map((quiz) => (
                            <div key={quiz.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                    style={{ background: `${quiz.category?.color ?? '#7c3aed'}20` }}>
                                    {quiz.category?.icon ?? <FileText className="w-5 h-5"/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{quiz.title}</p>
                                    <p className="text-xs text-slate-500">{quiz.teacher?.name}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${quiz.status==='published' ? 'bg-emerald-100 text-emerald-700' : quiz.status==='draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                                    {quiz.status==='published' ? 'Aktif' : quiz.status==='draft' ? 'Draft' : quiz.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Status */}
            <div className={`rounded-2xl p-5 border ${aiEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${aiEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`}><Bot className="w-6 h-6 text-white"/></div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Status AI Tutor: {aiEnabled ? <><CheckCircle className="w-4 h-4 text-emerald-500"/> Aktif</> : <><AlertTriangle className="w-4 h-4 text-amber-500"/> Tidak Aktif</>}</p>
                        <p className={`text-sm ${aiEnabled ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                            {aiEnabled ? 'AI Assistant berjalan dengan Groq API' : 'Konfigurasi Groq API Key di pengaturan untuk mengaktifkan AI'}
                        </p>
                    </div>
                    <Link href="/admin/settings" className="text-sm font-semibold text-violet-600 hover:underline">Konfigurasi →</Link>
                </div>
            </div>
        </AppLayout>
    )
}
