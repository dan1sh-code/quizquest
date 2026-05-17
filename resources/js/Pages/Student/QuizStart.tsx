import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Play, Clock, HelpCircle, Trophy, User, ArrowLeft, Target, ShieldAlert } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function QuizStart({ quiz, attemptCount }: any) {
    const { post, processing } = useForm()
    const isMaxReached = attemptCount >= quiz.max_attempts

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isMaxReached) {
            post(`/student/quiz/${quiz.id}/begin`)
        }
    }

    return (
        <AppLayout title={quiz.title}>
            <div className="max-w-4xl mx-auto py-8">
                <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-6 font-semibold transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Kembali ke Dashboard
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
                    <div className="h-48 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-8 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
                                {quiz.category?.icon ?? '📝'}
                            </div>
                            <div className="text-white">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
                                    {quiz.category?.name ?? 'Umum'}
                                </span>
                                <h1 className="text-3xl font-black mt-2 drop-shadow-md">{quiz.title}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Deskripsi</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {quiz.description || 'Tidak ada deskripsi untuk quiz ini.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <img src={quiz.teacher?.avatar_url || `https://ui-avatars.com/api/?name=${quiz.teacher?.name}&background=random`} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dibuat Oleh</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{quiz.teacher?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400"><HelpCircle className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase">Total Soal</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{quiz.questions?.length ?? 0} Pertanyaan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><Clock className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase">Waktu</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{quiz.time_limit ? `${quiz.time_limit} Menit` : 'Tanpa Batas'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Target className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase">KKM</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{quiz.passing_score} / 100</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400"><Trophy className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase">Reward</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{quiz.xp_reward} XP Base</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {isMaxReached && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
                                        <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-red-700 dark:text-red-400">Kamu telah mencapai batas maksimal ({quiz.max_attempts} percobaan).</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-500">Percobaan ke-{attemptCount + 1} dari {quiz.max_attempts}</p>
                            <form onSubmit={handleStart}>
                                <Button type="submit" size="lg" disabled={isMaxReached} loading={processing} className="px-10 text-lg shadow-xl shadow-violet-500/30 rounded-2xl gap-2">
                                    <Play className="w-5 h-5 fill-current" /> Mulai Petualangan
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
