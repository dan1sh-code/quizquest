import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Target, Medal, Zap } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import { cn } from '@/lib/utils'
import { usePage } from '@inertiajs/react'
import LevelIcon from '@/Components/ui/LevelIcon'

export default function Leaderboard({ students }: any) {
    const { auth } = usePage<any>().props
    const myRank = students.findIndex((s: any) => s.id === auth?.user?.id) + 1

    const topThree = students.slice(0, 3)
    const theRest = students.slice(3)

    return (
        <AppLayout title="Leaderboard Global" subtitle="Peringkat 50 besar murid terbaik">
            
            {/* Podium Section */}
            <div className="mt-12 mb-16 pt-8">
                <div className="flex items-end justify-center gap-2 sm:gap-6 max-w-4xl mx-auto h-64">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-1/3 flex flex-col items-center">
                            <div className="relative mb-4 group">
                                <div className="absolute -inset-4 bg-slate-200 dark:bg-slate-700 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                <img src={topThree[1].avatar_url} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-300 dark:border-slate-600 object-cover relative z-10 shadow-xl" />
                                <div className="absolute -bottom-3 -right-2 bg-slate-300 text-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg z-20">2</div>
                            </div>
                            <div className="text-center w-full h-32 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-t-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-end pb-4 px-2">
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{topThree[1].name}</p>
                                <p className="text-xs font-black text-violet-600 dark:text-violet-400 mt-1">{topThree[1].xp.toLocaleString()} XP</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-1/3 flex flex-col items-center relative z-10">
                            <div className="absolute -top-16 text-6xl drop-shadow-xl animate-bounce">👑</div>
                            <div className="relative mb-4 group">
                                <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                                <img src={topThree[0].avatar_url} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-yellow-400 object-cover relative z-10 shadow-2xl" />
                                <div className="absolute -bottom-4 -right-2 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg text-lg z-20">1</div>
                            </div>
                            <div className="text-center w-full h-40 bg-gradient-to-t from-yellow-300 to-yellow-100 dark:from-yellow-900/60 dark:to-yellow-900/20 rounded-t-3xl border border-yellow-300 dark:border-yellow-700/50 flex flex-col items-center justify-end pb-6 px-2 shadow-[0_-10px_40px_-15px_rgba(250,204,21,0.5)]">
                                <p className="font-black text-slate-900 dark:text-white line-clamp-1 text-lg">{topThree[0].name}</p>
                                <p className="text-sm font-black text-yellow-600 dark:text-yellow-400 mt-1 drop-shadow-sm">{topThree[0].xp.toLocaleString()} XP</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="w-1/3 flex flex-col items-center">
                            <div className="relative mb-4 group">
                                <div className="absolute -inset-4 bg-amber-600 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition duration-500"></div>
                                <img src={topThree[2].avatar_url} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-600 object-cover relative z-10 shadow-xl" />
                                <div className="absolute -bottom-3 -right-2 bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg z-20">3</div>
                            </div>
                            <div className="text-center w-full h-24 bg-gradient-to-t from-amber-200 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 rounded-t-3xl border border-amber-200 dark:border-amber-800/50 flex flex-col items-center justify-end pb-4 px-2">
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{topThree[2].name}</p>
                                <p className="text-xs font-black text-amber-700 dark:text-amber-500 mt-1">{topThree[2].xp.toLocaleString()} XP</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Rest of the leaderboard list */}
            <div className="max-w-4xl mx-auto space-y-3">
                {myRank > 3 && (
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg shadow-violet-500/30 mb-8 border border-white/20">
                        <div className="w-10 text-center font-black text-xl text-white/80">#{myRank}</div>
                        <img src={auth?.user?.avatar_url} className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" />
                        <div className="flex-1">
                            <p className="font-bold">Peringkat Kamu</p>
                            <p className="text-xs text-violet-200">Terus kerjakan kuis untuk naik peringkat!</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl">{auth?.user?.xp.toLocaleString()}</p>
                            <p className="text-xs text-violet-200 uppercase tracking-widest font-bold">XP</p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
                    {theRest.map((student: any, idx: number) => {
                        const rank = idx + 4
                        const isMe = student.id === auth?.user?.id
                        return (
                            <div key={student.id} className={cn("flex items-center gap-4 p-4 rounded-2xl transition-colors", isMe ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
                                <div className="w-10 text-center font-bold text-slate-400 dark:text-slate-500 text-lg">
                                    {rank}
                                </div>
                                <img src={student.avatar_url} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={cn("font-bold", isMe ? "text-violet-700 dark:text-violet-400" : "text-slate-900 dark:text-white")}>
                                            {student.name}
                                        </p>
                                        <span className="text-sm text-amber-500" title={`Level ${student.level}`}><LevelIcon level={student.level} className="w-4 h-4" /></span>
                                    </div>
                                    <p className="text-xs text-slate-500">{student.school || 'QuizQuest Student'}</p>
                                </div>
                                {student.streak_days > 2 && (
                                    <div className="hidden sm:flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg text-xs font-bold mr-4">
                                        <Flame className="w-3.5 h-3.5" /> {student.streak_days}
                                    </div>
                                )}
                                <div className="text-right">
                                    <p className="font-black text-slate-800 dark:text-slate-200">{student.xp.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
