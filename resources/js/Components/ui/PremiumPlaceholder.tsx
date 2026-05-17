import React from 'react'
import { motion } from 'framer-motion'
import { Wrench, Sparkles, Rocket } from 'lucide-react'

interface Props {
    title?: string
    description?: string
}

export default function PremiumPlaceholder({ 
    title = 'Fitur Segera Hadir', 
    description = 'Tim engineer kami sedang merakit fitur luar biasa ini. Pantau terus update selanjutnya!' 
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-8">
            {/* Ambient Glowing Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="inline-flex relative mb-8"
                >
                    {/* Glowing ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 blur-xl opacity-50 animate-spin-slow" />
                    
                    {/* Main Icon container */}
                    <div className="relative w-32 h-32 bg-white dark:bg-slate-950 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                        <Wrench className="w-16 h-16 text-violet-600 dark:text-violet-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>

                    {/* Decorative mini icons */}
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 w-12 h-12 bg-fuchsia-100 dark:bg-fuchsia-900/50 rounded-2xl flex items-center justify-center border border-fuchsia-200 dark:border-fuchsia-700 shadow-lg rotate-12 backdrop-blur-md">
                        <Sparkles className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
                    </motion.div>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute -bottom-2 -left-4 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-700 shadow-lg -rotate-12 backdrop-blur-md">
                        <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
                        {description}
                    </p>
                </motion.div>

                {/* Progress bar decoration */}
                <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-8 overflow-hidden"
                >
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="h-full w-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    />
                </motion.div>
            </div>
        </div>
    )
}
