import React from 'react'
import { Link } from '@inertiajs/react'
import { PlusCircle, Edit, Trash2, Eye, Play, BarChart2, CheckCircle, XCircle } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function QuizIndex({ quizzes }: any) {
    return (
        <AppLayout title="Quiz Saya" subtitle="Kelola semua kuis yang telah Anda buat">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Kuis</h2>
                    <p className="text-slate-500">Terdapat total {quizzes.total} kuis</p>
                </div>
                <Link href="/teacher/quizzes/create">
                    <Button className="rounded-2xl shadow-xl shadow-violet-500/30 gap-2">
                        <PlusCircle className="w-5 h-5" /> Buat Kuis Baru
                    </Button>
                </Link>
            </div>

            {quizzes.data.length === 0 ? (
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📝</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada Kuis</h3>
                    <p className="text-slate-500 mb-6">Mulai buat kuis pertamamu sekarang juga!</p>
                    <Link href="/teacher/quizzes/create">
                        <Button variant="secondary" className="rounded-xl">Mulai Membuat Kuis</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.data.map((quiz: any) => (
                        <div key={quiz.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="h-32 bg-gradient-to-br from-violet-500 to-fuchsia-600 relative overflow-hidden p-5 flex flex-col justify-between">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                        {quiz.category?.name ?? 'Umum'}
                                    </span>
                                    <span className={cn('text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-md', quiz.status === 'published' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/50' : 'bg-slate-800/40 text-slate-200 border border-slate-500/50')}>
                                        {quiz.status === 'published' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                                        {quiz.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-black text-xl text-white drop-shadow-md truncate">{quiz.title}</h3>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <p className="text-lg font-black text-slate-700 dark:text-slate-300">{quiz.questions_count ?? 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Soal</p>
                                    </div>
                                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <p className="text-lg font-black text-slate-700 dark:text-slate-300">{quiz.attempts_count ?? 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pengerjaan</p>
                                    </div>
                                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <p className="text-lg font-black text-violet-600 dark:text-violet-400">+{quiz.xp_reward}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">XP Base</p>
                                    </div>
                                </div>

                                <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-2 text-slate-500">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Kode:</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white tracking-widest">{quiz.join_code}</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(quiz.join_code)
                                            alert('Kode Kuis disalin: ' + quiz.join_code)
                                        }}
                                        className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                                        title="Salin Kode Kuis"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/teacher/quizzes/${quiz.id}/edit`} className="flex-1">
                                        <Button variant="secondary" className="w-full text-xs gap-1 py-2 rounded-xl">
                                            <Edit className="w-3.5 h-3.5" /> Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/teacher/quizzes/${quiz.id}/results`} className="flex-1">
                                        <Button variant="outline" className="w-full text-xs gap-1 py-2 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800">
                                            <BarChart2 className="w-3.5 h-3.5" /> Hasil
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    )
}
