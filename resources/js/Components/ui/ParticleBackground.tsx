import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function ParticleBackground() {
    // Generate static stars to prevent jumping on re-renders
    const stars = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            duration: Math.random() * 30 + 15,
            delay: Math.random() * -30,
        }))
    }, [])

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a1a]">
            {/* Deep space background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0a0a1a] to-[#050510]"></div>
            
            {/* Nebulas / Glowing Gas */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                    rotate: [0, 45, 0]
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/30 rounded-full blur-[150px] mix-blend-screen"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.25, 0.1],
                    rotate: [0, -45, 0]
                }}
                transition={{ duration: 50, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen"
            />

            {/* Moving Stars (Parallax Upwards) */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                    animate={{
                        y: ["0vh", "-100vh"],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5]
                    }}
                    transition={{
                        y: {
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: star.delay
                        },
                        opacity: {
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: star.delay,
                            times: [0, 0.5, 1]
                        },
                        scale: {
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: star.delay,
                            times: [0, 0.5, 1]
                        }
                    }}
                />
            ))}
        </div>
    )
}
