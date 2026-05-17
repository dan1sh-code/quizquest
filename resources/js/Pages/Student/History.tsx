import React from 'react'
import { Link } from '@inertiajs/react'
import { History as HistoryIcon, Target, CheckCircle, XCircle, Search } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function History({ attempts }: any) {
    return (
        <AppLayout title="Riwayat Kuis" subtitle="Lihat kembali performa ujianmu sebelumnya">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Jejak Petualangan</h2>
                    <p className="text-slate-500">Kamu telah menyelesaikan {attempts.total} kuis</p>
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari riwayat..." className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-violet-500 outline-none transition-colors" />
                </div>
            </div>

            {attempts.data.length === 0 ? (
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HistoryIcon className="w-10 h-10 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Riwayat</h3>
                    <p className="text-slate-500 mb-6">Mulai petualangan belajarmu dengan mengerjakan kuis pertama!</p>
                    <Link href="/quiz/explore">
                        <Button className="rounded-xl shadow-lg shadow-violet-500/30">Jelajahi Kuis</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-4">Informasi Kuis</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4 text-center">Skor / XP</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {attempts.data.map((attempt: any) => (
                                    <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${attempt.quiz?.category?.color || '#8b5cf6'}20` }}>
                                                    {attempt.quiz?.category?.icon || '📝'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{attempt.quiz?.title}</p>
                                                    <p className="text-xs text-slate-500">{attempt.quiz?.category?.name || 'Umum'} · Percobaan ke-{attempt.attempt_number}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {new Date(attempt.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(attempt.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex flex-col items-center justify-center">
                                                <p className={cn("font-black text-lg", attempt.passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
                                                    {Math.round(attempt.percentage)}%
                                                </p>
                                                <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md mt-1 border border-amber-200/50 dark:border-amber-700/50">
                                                    +{attempt.xp_earned} XP
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {attempt.passed ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle className="w-3 h-3" /> Lulus
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-red-800">
                                                    <XCircle className="w-3 h-3" /> Gagal
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/student/quiz/${attempt.quiz_id}/results`}>
                                                <Button variant="secondary" className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
