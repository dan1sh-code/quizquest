import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, CheckCircle2 } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import { cn } from '@/lib/utils'
import type { Achievement } from '@/types'

interface Props {
    userAchievements: Achievement[]
    allAchievements: Achievement[]
}

export default function Achievements({ userAchievements = [], allAchievements = [] }: Props) {
    const userAchievementIds = new Set(userAchievements.map(a => a.id))

    return (
        <AppLayout title="Pencapaian & Badge">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden shadow-xl shadow-violet-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg shrink-0">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-black mb-2">Koleksi Badge</h2>
                            <p className="text-indigo-200">Selesaikan misi dan kumpulkan semua badge eksklusif QuizQuest!</p>
                            <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                                <div className="bg-white/20 px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm whitespace-nowrap">
                                    {userAchievements.length} / {allAchievements.length} Terkumpul
                                </div>
                                <div className="w-full md:max-w-xs h-2 bg-black/20 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${(userAchievements.length / Math.max(allAchievements.length, 1)) * 100}%` }} 
                                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allAchievements.map((achievement, i) => {
                        const isEarned = userAchievementIds.has(achievement.id)
                        return (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "relative rounded-2xl p-6 border transition-all flex flex-col items-center text-center group",
                                    isEarned 
                                        ? "bg-white dark:bg-slate-900 border-yellow-200 dark:border-yellow-900/50 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1" 
                                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
                                )}
                            >
                                {isEarned && (
                                    <div className="absolute top-3 right-3 text-emerald-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                                {!isEarned && (
                                    <div className="absolute top-3 right-3 text-slate-400 dark:text-slate-600">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                )}
                                
                                <div className={cn(
                                    "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 transition-transform group-hover:scale-110 duration-300 shadow-inner",
                                    isEarned ? "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20" : "bg-slate-200 dark:bg-slate-800"
                                )}>
                                    <span className={cn(isEarned ? "drop-shadow-md" : "opacity-50")}>{achievement.badge_emoji}</span>
                                </div>
                                
                                <h3 className={cn("font-bold text-lg mb-1", isEarned ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
                                    {achievement.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex-1">
                                    {achievement.description}
                                </p>
                                
                                <div className="w-full mt-auto">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block",
                                        isEarned ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                                    )}>
                                        {achievement.xp_reward} XP
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
