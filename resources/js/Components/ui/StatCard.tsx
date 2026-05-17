import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    sub?: string
    color?: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'orange'
    index?: number
}

const colorMap = {
    violet:  'from-violet-500 to-indigo-600 shadow-violet-500/20',
    blue:    'from-blue-500 to-cyan-600 shadow-blue-500/20',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    amber:   'from-amber-500 to-orange-600 shadow-amber-500/20',
    rose:    'from-rose-500 to-pink-600 shadow-rose-500/20',
    orange:  'from-orange-500 to-red-600 shadow-orange-500/20',
}

export default function StatCard({ icon, label, value, sub, color = 'violet', index = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm card-hover"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg',
                    colorMap[color]
                )}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-emerald-500 font-semibold mt-1">{sub}</p>}
        </motion.div>
    )
}
