import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Zap, Target, Trophy, Flame, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import StatCard from '@/Components/ui/StatCard'
import XPBar from '@/Components/Shared/XPBar'
import Button from '@/Components/ui/Button'
import { getLevelName, avatarUrl, cn } from '@/lib/utils'
import LevelIcon from '@/Components/ui/LevelIcon'
import type { User, Quiz, QuizAttempt, Achievement } from '@/types'

interface StreakDay { date: string; done: number; xp: number }

interface Props {
    auth: { user: User }
    totalAttempts: number
    avgScore: number
    totalXp: number
    recentAttempts: QuizAttempt[]
    availableQuizzes: Quiz[]
    leaderboard: User[]
    userAchievements: Achievement[]
    allAchievements: Achievement[]
    streakData: StreakDay[]
}

export default function StudentDashboard({
    auth, totalAttempts, avgScore, totalXp,
    recentAttempts, availableQuizzes, leaderboard,
    userAchievements, allAchievements, streakData,
}: Props) {
    const user = auth.user
    const { data, setData, post, processing, errors } = useForm({ code: '' })

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        post('/student/join-quiz')
    }

    return (
        <AppLayout title={`Dashboard`} subtitle={`Selamat datang, ${user.name}! 👋`}>

            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-3xl p-8 mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20"><div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" /></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img src={user.avatar_url || avatarUrl(user.name, user.avatar)} className="w-20 h-20 rounded-2xl ring-4 ring-white/30 object-cover shadow-xl" alt={user.name} />
                        <span className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-slate-100 shadow-lg text-amber-500">
                            <LevelIcon level={user.level} className="w-5 h-5" />
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black text-white">Halo, {user.name}! 👋</h2>
                            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-semibold">
                                Level {user.level} · {getLevelName(user.level)}
                            </span>
                            {user.streak_days > 0 && (
                                <span className="bg-orange-500/30 border border-orange-400/40 text-orange-200 text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                    <Flame className="w-4 h-4" /> {user.streak_days} Hari Streak
                                </span>
                            )}
                        </div>
                        <p className="text-white/80 mb-4">{user.xp.toLocaleString()} XP · {totalAttempts} quiz · Rata-rata {Math.round(avgScore)}%</p>
                        <XPBar user={user} showDetails />
                    </div>

                    {/* Join Quiz */}
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <form onSubmit={handleJoin} className="flex gap-2">
                            <input
                                value={data.code}
                                onChange={e => setData('code', e.target.value.toUpperCase())}
                                placeholder="Kode Quiz..."
                                maxLength={10}
                                className="bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-xl px-4 py-2.5 text-sm font-bold uppercase tracking-widest w-36 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <Button type="submit" loading={processing} variant="secondary" className="!bg-white !text-violet-700 whitespace-nowrap">
                                🚀 Join
                            </Button>
                        </form>
                        <p className="text-white/60 text-xs mt-1.5 text-center">Masukkan kode dari guru</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard index={0} icon="🎯" label="Quiz Selesai"    value={totalAttempts}              color="violet" />
                <StatCard index={1} icon="📊" label="Rata-rata Skor"  value={`${Math.round(avgScore)}%`} color="blue" />
                <StatCard index={2} icon="⚡" label="Total XP"         value={`${user.xp.toLocaleString()} XP`} color="amber" />
                <StatCard index={3} icon="🔥" label="Streak"           value={`${user.streak_days} Hari`} color="rose" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Available Quizzes */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-violet-500" /> Quiz Tersedia</h3>
                        <a href="/quiz/explore" className="text-sm text-violet-600 hover:underline font-medium">Lihat semua</a>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {availableQuizzes.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="text-5xl mb-3">🎉</div>
                                <p className="font-semibold text-slate-900 dark:text-white">Semua quiz sudah dikerjakan!</p>
                                <p className="text-sm text-slate-500 mt-1">Tunggu quiz baru dari guru.</p>
                            </div>
                        ) : availableQuizzes.map((quiz) => (
                            <div key={quiz.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: `${quiz.category?.color ?? '#7c3aed'}20` }}>
                                    {quiz.category?.icon ?? '📝'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white truncate">{quiz.title}</p>
                                    <p className="text-sm text-slate-500">{quiz.teacher?.name} · {quiz.questions_count ?? 0} soal{quiz.time_limit ? ` · ⏱ ${quiz.time_limit} mnt` : ''}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">+{quiz.xp_reward} XP</span>
                                    <a href={`/student/quiz/${quiz.id}/start`}
                                        className="text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-all">
                                        Mulai →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Sidebar */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl overflow-hidden shadow-lg shadow-violet-500/20">
                    <div className="px-5 py-4 border-b border-white/20 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4" /> Leaderboard</h3>
                        <a href="/student/leaderboard" className="text-white/70 hover:text-white text-xs">Semua</a>
                    </div>
                    <div className="p-4 space-y-2">
                        {leaderboard.slice(0,7).map((player, i) => (
                            <div key={player.id} className={cn(
                                'flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2.5 transition-all',
                                player.id === user.id && 'ring-2 ring-yellow-400'
                            )}>
                                <span className="text-sm font-bold text-white/60 w-5 text-center">
                                    {i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : `#${i+1}`}
                                </span>
                                <img src={player.avatar_url} className="w-7 h-7 rounded-full object-cover" alt={player.name} />
                                <p className={cn('flex-1 text-sm font-semibold truncate', player.id === user.id ? 'text-yellow-300' : 'text-white')}>
                                    {player.id === user.id ? 'Kamu' : player.name}
                                </p>
                                <span className="text-yellow-300 font-black text-sm">{player.xp.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent + Achievements */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Attempts */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-violet-500" /> Riwayat Quiz</h3>
                        <a href="/student/history" className="text-sm text-violet-600 hover:underline font-medium">Semua</a>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {recentAttempts.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="text-5xl mb-3">📝</div>
                                <p className="text-slate-500">Belum ada quiz dikerjakan</p>
                            </div>
                        ) : recentAttempts.map((attempt) => (
                            <div key={attempt.id} className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                                        attempt.passed ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-red-100 dark:bg-red-900/20')}>
                                        {attempt.passed ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{attempt.quiz?.title}</p>
                                        <p className="text-xs text-slate-500">{new Date(attempt.completed_at!).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={cn('font-black text-lg', attempt.passed ? 'text-emerald-600' : 'text-red-500')}>{Math.round(attempt.percentage)}%</p>
                                        <p className="text-xs text-violet-500 font-semibold">+{attempt.xp_earned} XP</p>
                                    </div>
                                </div>
                                <div className="mt-2 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                    <div className={cn('h-1.5 rounded-full', attempt.passed ? 'bg-emerald-500' : 'bg-red-500')}
                                        style={{ width: `${attempt.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">🎖️ Pencapaian</h3>
                        <a href="/student/achievements" className="text-sm text-violet-600 hover:underline font-medium">Semua</a>
                    </div>
                    <div className="p-6">
                        {userAchievements.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {userAchievements.slice(0,6).map((ach) => (
                                    <div key={ach.id} className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-100 dark:border-yellow-800/30" title={`${ach.name}: ${ach.description}`}>
                                        <span className="text-3xl block mb-1">{ach.badge_emoji}</span>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{ach.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-3">🎖️</div>
                                <p className="font-semibold text-slate-900 dark:text-white">Belum ada pencapaian</p>
                                <p className="text-sm text-slate-500 mt-1">Selesaikan quiz pertamamu!</p>
                            </div>
                        )}
                        <p className="text-center text-sm text-slate-500 mb-4">{userAchievements.length} dari {allAchievements.length} pencapaian</p>

                        {/* Streak Calendar */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Aktivitas 7 Hari Terakhir</p>
                            <div className="grid grid-cols-7 gap-1">
                                {streakData.map((day, i) => (
                                    <div key={i} className="text-center">
                                        <div className={cn('w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold',
                                            day.done > 0 ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                                            {day.done > 0 ? '✓' : '·'}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{day.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
