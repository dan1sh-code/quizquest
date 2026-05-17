import React from 'react'
import { Trophy, Crown, Flame, Star, Medal } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import { motion } from 'framer-motion'
import { cn, getLevelName } from '@/lib/utils'
import type { User } from '@/types'

interface Props {
    leaderboard: User[]
}

export default function Leaderboard({ leaderboard = [] }: Props) {
    return (
        <AppLayout title="Leaderboard Global">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] mx-auto rotate-12">
                            <Trophy className="w-10 h-10 text-white -rotate-12" />
                        </div>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 drop-shadow-lg relative z-10">
                        Aula <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Pahlawan</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg uppercase tracking-widest text-sm relative z-10">Pemain Terbaik QuizQuest</p>
                </div>

                <div className="space-y-4">
                    {leaderboard.map((student, i) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                                "rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 border shadow-sm transition-all hover:-translate-y-1",
                                i === 0 ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/50" :
                                i === 1 ? "bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-800/30 border-slate-200 dark:border-slate-700/50" :
                                i === 2 ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-200 dark:border-orange-800/40" :
                                "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md"
                            )}
                        >
                            <div className="w-12 sm:w-16 text-center flex-shrink-0">
                                {i === 0 ? <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 mx-auto drop-shadow-md" /> :
                                 i === 1 ? <Medal className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400 mx-auto drop-shadow-md" /> :
                                 i === 2 ? <Medal className="w-7 h-7 sm:w-9 sm:h-9 text-orange-600 mx-auto drop-shadow-md" /> :
                                 <span className="text-2xl sm:text-3xl font-black text-slate-300 dark:text-slate-600">#{i + 1}</span>}
                            </div>
                            
                            <div className="relative flex-shrink-0">
                                <img src={student.avatar_url} className={cn(
                                    "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md",
                                    i === 0 ? "ring-4 ring-amber-400" : i === 1 ? "ring-4 ring-slate-300" : i === 2 ? "ring-4 ring-orange-500" : "ring-2 ring-slate-100 dark:ring-slate-700"
                                )} alt={student.name} />
                                {student.streak_days > 2 && (
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-1 shadow-lg border-2 border-white dark:border-slate-900" title={`${student.streak_days} Hari Streak!`}>
                                        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">{student.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Lv.{student.level} {getLevelName(student.level)}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs truncate">
                                        {student.school ?? 'QuizQuest Scholar'}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className={cn(
                                    "text-2xl sm:text-3xl font-black",
                                    i === 0 ? "text-amber-500" : i === 1 ? "text-slate-500 dark:text-slate-400" : i === 2 ? "text-orange-600" : "text-violet-600 dark:text-violet-400"
                                )}>
                                    {student.xp.toLocaleString()}
                                </p>
                                <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider">XP</p>
                            </div>
                        </motion.div>
                    ))}
                    {leaderboard.length === 0 && (
                        <div className="text-center py-24 text-slate-500 dark:text-slate-400">
                            <Crown className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-semibold">Belum ada pahlawan di sini.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
