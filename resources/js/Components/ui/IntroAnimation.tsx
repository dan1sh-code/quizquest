import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gamepad2 } from 'lucide-react'

export default function IntroAnimation() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const hasPlayed = sessionStorage.getItem('introPlayed')
        if (!hasPlayed) {
            setShow(true)
            // Save immediately so it won't play again
            sessionStorage.setItem('introPlayed', 'true')
            
            // Hide after 2.5 seconds
            const timer = setTimeout(() => {
                setShow(false)
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 pointer-events-none overflow-hidden"
                >
                    {/* Background glows */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.3, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, delay: 0.2 }}
                        className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"
                    />

                    {/* Logo content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)] border-2 border-amber-300">
                            <Gamepad2 className="w-12 h-12 text-slate-900" />
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] font-display" style={{ fontFamily: 'Cinzel, serif' }}>
                            QuizQuest
                        </h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mt-6 flex items-center gap-2 text-amber-400 uppercase tracking-[0.3em] text-sm font-bold"
                        >
                            <Sparkles className="w-4 h-4" />
                            Memasuki Dunia
                            <Sparkles className="w-4 h-4" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
