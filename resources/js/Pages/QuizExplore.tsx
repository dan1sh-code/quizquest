import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Search, Filter, Play, Users, Star, Award, Zap } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function QuizExplore({ quizzes, categories }: any) {
    const { auth } = usePage<any>().props
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    return (
        <AppLayout title="Jelajahi Kuis" subtitle="Temukan kuis publik menarik dari seluruh guru">
            
            {/* Search Hero */}
            <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-600 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">Mau belajar apa hari ini?</h2>
                    <p className="text-white/80 text-lg mb-8">Ribuan kuis publik siap menantang kemampuanmu!</p>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            className="block w-full p-5 pl-14 text-lg text-slate-900 border-0 rounded-2xl bg-white shadow-2xl focus:ring-4 focus:ring-white/30 outline-none placeholder:text-slate-400 transition-all" 
                            placeholder="Cari topik kuis, matematika, sejarah..." 
                        />
                        <button className="text-white absolute right-2.5 bottom-2.5 bg-slate-900 hover:bg-slate-800 font-bold rounded-xl text-sm px-6 py-3 transition-colors">
                            Cari
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Filter className="w-5 h-5 text-violet-500"/> Kategori Populer</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                    <button 
                        onClick={() => setActiveCategory(null)}
                        className={cn("whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all border", activeCategory === null ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-violet-300")}
                    >
                        ✨ Semua Topik
                    </button>
                    {categories.map((cat: any) => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn("whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all border flex items-center gap-2", activeCategory === cat.id ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-violet-300")}
                        >
                            <span>{cat.icon}</span> {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quizzes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {quizzes.data.map((quiz: any) => (
                    <div key={quiz.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10">
                        <div className="h-40 relative p-5 flex flex-col justify-between" style={{ backgroundColor: `${quiz.category?.color || '#8b5cf6'}20` }}>
                            <div className="flex justify-between items-start">
                                <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ color: quiz.category?.color || '#8b5cf6' }}>
                                    {quiz.category?.icon} {quiz.category?.name || 'Umum'}
                                </span>
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                </div>
                            </div>
                            <div className="w-16 h-16 absolute -bottom-8 right-6 bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                                <img src={quiz.teacher?.avatar_url} className="w-full h-full rounded-xl object-cover" />
                            </div>
                        </div>
                        <div className="p-6 pt-10">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-violet-600 transition-colors">{quiz.title}</h3>
                            <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">Oleh <span className="font-semibold text-slate-700 dark:text-slate-300">{quiz.teacher?.name}</span></p>
                            
                            <div className="flex items-center gap-4 mb-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> {quiz.attempts_count || 0} main</div>
                                <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> +{quiz.xp_reward} XP</div>
                            </div>
                            
                            <Link href={auth?.user ? `/student/quiz/${quiz.id}/start` : '/login'}>
                                <Button className="w-full rounded-xl shadow-lg shadow-violet-500/20 gap-2 group-hover:bg-violet-700">
                                    <Play className="w-4 h-4 fill-current" /> Mainkan Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {quizzes.data.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Kuis tidak ditemukan</h3>
                    <p className="text-slate-500">Belum ada kuis publik yang tersedia untuk saat ini.</p>
                </div>
            )}
        </AppLayout>
    )
}
