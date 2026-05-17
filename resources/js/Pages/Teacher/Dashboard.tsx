import React from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { PlusCircle, School, Edit3, BarChart2 } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import StatCard from '@/Components/ui/StatCard'
import { cn } from '@/lib/utils'
import type { Quiz, ClassRoom, QuizAttempt, User } from '@/types'

interface Props {
    auth: { user: User }
    totalClasses: number
    totalQuizzes: number
    totalStudents: number
    totalAttempts: number
    myQuizzes: Quiz[]
    myClasses: ClassRoom[]
    recentAttempts: QuizAttempt[]
    pendingEssays: QuizAttempt[]
}

export default function TeacherDashboard({ auth, totalClasses, totalQuizzes, totalStudents, totalAttempts, myQuizzes, myClasses, recentAttempts, pendingEssays }: Props) {
    return (
        <AppLayout title="Dashboard Guru" subtitle="Kelola kelas dan quiz dengan mudah">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard index={0} icon="🏫" label="Total Kelas"    value={totalClasses}   color="blue" />
                <StatCard index={1} icon="📋" label="Total Quiz"     value={totalQuizzes}   color="violet" />
                <StatCard index={2} icon="👨‍🎓" label="Total Murid"  value={totalStudents}  color="emerald" />
                <StatCard index={3} icon="🎯" label="Total Percobaan" value={totalAttempts} color="amber" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20">
                    <h3 className="font-bold text-lg mb-5 flex items-center gap-2">⚡ Aksi Cepat</h3>
                    <div className="space-y-3">
                        {[
                            { href:'/teacher/quizzes/create', icon:<PlusCircle className="w-5 h-5" />, title:'Buat Quiz Baru', desc:'5 tipe soal tersedia' },
                            { href:'/teacher/classes/create', icon:<School className="w-5 h-5" />, title:'Buat Kelas Baru', desc:'Undang murid dengan kode' },
                            { href:'/teacher/grading', icon:<Edit3 className="w-5 h-5" />, title:'Nilai Essay', desc:`${pendingEssays.length} menunggu`, badge:pendingEssays.length },
                            { href:'/teacher/analytics', icon:<BarChart2 className="w-5 h-5" />, title:'Lihat Analitik', desc:'Performa kelas & quiz' },
                        ].map(({href,icon,title,desc,badge}) => (
                            <Link key={href} href={href} className="flex items-center gap-3 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-3.5 transition-all group">
                                <span className="text-white/70 group-hover:text-white">{icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{title}</p>
                                    <p className="text-white/60 text-xs">{desc}</p>
                                </div>
                                {badge ? <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{badge}</span> : null}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* My Quizzes */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">📋 Quiz Terbaru</h3>
                        <Link href="/teacher/quizzes" className="text-sm text-violet-600 hover:underline font-medium">Semua Quiz</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {myQuizzes.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="text-5xl mb-3">📋</div>
                                <p className="font-semibold text-slate-900 dark:text-white">Belum ada quiz</p>
                                <Link href="/teacher/quizzes/create" className="inline-block mt-3 text-violet-600 hover:underline text-sm font-medium">Buat Quiz Pertama →</Link>
                            </div>
                        ) : myQuizzes.map((quiz) => (
                            <div key={quiz.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background:`${quiz.category?.color ?? '#7c3aed'}20` }}>
                                    {quiz.category?.icon ?? '📝'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{quiz.title}</p>
                                    <div className="flex gap-2 mt-0.5">
                                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', quiz.status==='published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
                                            {quiz.status === 'published' ? 'Aktif' : 'Draft'}
                                        </span>
                                        <span className="text-xs text-slate-500">👥 {quiz.attempts_count} percobaan</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/teacher/quizzes/${quiz.id}/results`} className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-all text-sm">📊</Link>
                                    <Link href={`/teacher/quizzes/${quiz.id}/edit`} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all text-sm">✏️</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Attempts Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">🎯 Percobaan Quiz Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {['Murid','Quiz','Skor','Status','Waktu'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {recentAttempts.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada percobaan quiz</td></tr>
                            ) : recentAttempts.map((attempt) => (
                                <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={(attempt.user as any)?.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{attempt.user?.name}</p>
                                                <p className="text-xs text-slate-500">Lv.{attempt.user?.level}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{attempt.quiz?.title?.substring(0,30)}{(attempt.quiz?.title?.length ?? 0) > 30 ? '...' : ''}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn('font-black text-lg', attempt.passed ? 'text-emerald-600' : 'text-red-500')}>{Math.round(attempt.percentage)}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', attempt.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                                            {attempt.passed ? '✅ Lulus' : '❌ Tidak Lulus'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}
