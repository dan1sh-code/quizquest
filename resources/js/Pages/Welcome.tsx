import React, { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Trophy, Bot, BookOpen, Flame, Star, ChevronRight, PenTool, BarChart, Target, Sparkles, UserPlus, LogIn, Eye, Calculator, Crown, Rocket } from 'lucide-react'
import type { Quiz, Category, User } from '@/types'
import ParticleBackground from '@/Components/ui/ParticleBackground'

interface Props {
    featuredQuizzes: Quiz[]
    topStudents: User[]
    categories: Category[]
    totalStudents: number
    totalQuizzes: number
}

export default function Welcome({ featuredQuizzes, topStudents, categories, totalStudents, totalQuizzes }: Props) {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    const features = [
        { icon: <Bot className="w-10 h-10 text-violet-500" />, title: 'AI Tutor Pintar',     desc: 'Pembahasan soal otomatis dengan OpenRouter. Tanya apa saja 24/7!' },
        { icon: <Zap className="w-10 h-10 text-yellow-400" />, title: 'XP & 10 Level',        desc: 'Dari Pemula hingga Immortal. Naik level dengan belajar!' },
        { icon: <Trophy className="w-10 h-10 text-orange-400" />, title: 'Leaderboard Real-time',desc: 'Bersaing dengan ribuan murid secara real-time.' },
        { icon: <PenTool className="w-10 h-10 text-emerald-500" />, title: '5 Tipe Soal',          desc: 'Pilihan Ganda, Essay, Benar/Salah, Isian, Menjodohkan.' },
        { icon: <Flame className="w-10 h-10 text-red-500" />, title: 'Streak Harian',         desc: 'Bonus XP untuk konsistensi belajar setiap hari.' },
        { icon: <BarChart className="w-10 h-10 text-blue-500" />, title: 'Analitik Mendalam',     desc: 'Guru lihat performa kelas, soal tersulit, dan distribusi nilai.' },
    ]

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200">
            <ParticleBackground />
            {/* Navbar */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg"
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0], filter: ['drop-shadow(0 0 5px rgba(139,92,246,0.3))', 'drop-shadow(0 0 15px rgba(139,92,246,0.8))', 'drop-shadow(0 0 5px rgba(139,92,246,0.3))'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <Rocket className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className={`font-black text-2xl tracking-wide ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>QuizQuest</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        {['#features','#leaderboard','#how-it-works'].map((href, i) => (
                            <a key={href} href={href} className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-violet-600 dark:text-slate-300' : 'text-white/80 hover:text-white'}`}>
                                {['Fitur','Leaderboard','Cara Kerja'][i]}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${scrolled ? 'border-violet-200 text-violet-600 hover:bg-violet-50' : 'border-white/30 text-white hover:bg-white/10'}`}>
                            Masuk
                        </Link>
                        <Link href="/register" className="text-sm font-bold px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all">
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
                <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-white/90 text-sm font-medium">Platform Quiz #1 di Indonesia</span>
                                <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                                className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-wide drop-shadow-2xl"
                            >
                                Belajar Seru,<br />
                                <span className="gradient-text-sleek">
                                    Raih Bintang!
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                                className="text-xl text-white/70 mb-10 leading-relaxed"
                            >
                                Platform quiz edukasi dengan <strong className="text-white">AI Tutor</strong>, sistem XP & level, leaderboard real-time, dan 5 tipe soal interaktif.
                            </motion.p>

                            <motion.div
                                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                                className="flex flex-wrap gap-4 mb-12"
                            >
                                <Link href="/register" className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all hover:-translate-y-1 border border-amber-300/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <Zap className="w-5 h-5" />
                                    <span className="tracking-widest uppercase text-sm">Mulai Petualangan</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/login" className="flex items-center gap-2 glass-sleek text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
                                    <Eye className="w-5 h-5 text-cyan-400"/> Demo
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                                className="flex gap-8"
                            >
                                {[
                                    { value: `${totalStudents.toLocaleString()}+`, label: 'Murid Aktif' },
                                    { value: `${totalQuizzes.toLocaleString()}+`, label: 'Quiz Tersedia' },
                                    { value: '10', label: 'Level Prestasi' },
                                ].map(({ value, label }, i) => (
                                    <div key={i} className={i > 0 ? 'pl-8 border-l border-white/20' : ''}>
                                        <p className="text-3xl font-black text-white">{value}</p>
                                        <p className="text-white/60 text-sm">{label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Hero Image / Cards */}
                        <div className="relative h-[550px] hidden lg:flex items-center justify-center perspective-1000">
                            {/* Main Object with 3D Spin */}
                            <motion.div
                                animate={{ y: [-15, 15, -15], rotateY: [0, 360] }}
                                transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut" }, rotateY: { repeat: Infinity, duration: 25, ease: "linear" } }}
                                style={{ perspective: 1000 }}
                                className="relative z-10 w-full max-w-[480px] preserve-3d cursor-pointer group"
                            >
                                <div className="w-[320px] h-[420px] mx-auto rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(139,92,246,0.4)] group-hover:shadow-[0_30px_70px_rgba(139,92,246,0.7)] transition-all duration-500 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent pointer-events-none" />
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.6)] mb-8 group-hover:scale-110 transition-transform duration-500">
                                        <Rocket className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="space-y-4 text-center w-full relative z-10">
                                        <div className="h-4 bg-white/20 rounded-full w-3/4 mx-auto" />
                                        <div className="h-4 bg-white/10 rounded-full w-1/2 mx-auto" />
                                        <div className="h-4 bg-white/10 rounded-full w-2/3 mx-auto" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-violet-900/50 to-transparent pointer-events-none" />
                                </div>
                            </motion.div>

                            {/* Floating Ornaments */}
                            <motion.div 
                                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 right-4 glass-sleek rounded-2xl p-4 flex items-center gap-4 shadow-2xl z-20 border border-white/20 backdrop-blur-xl bg-white/5"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg leading-none">Rank #1</p>
                                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider mt-1">Leaderboard</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-16 left-0 glass-sleek rounded-2xl p-4 flex items-center gap-4 shadow-2xl z-20 border border-white/20 backdrop-blur-xl bg-white/5"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">AI Tutor</p>
                                    <p className="text-indigo-200/80 text-xs">Siap membantu!</p>
                                </div>
                            </motion.div>
                            
                            {/* Glow Behind */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-violet-500/20 to-amber-500/20 blur-[100px] -z-10 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 inset-x-0">
                    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="fill-white dark:fill-slate-950">
                        <path d="M0,40 C360,90 1080,0 1440,40 L1440,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
                        <span className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 rounded-full px-4 py-2 mb-4 text-sm font-bold uppercase tracking-widest border border-cyan-500/30"><Sparkles className="w-4 h-4" /> Fitur Unggulan</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                            Kekuatan untuk<br /> <span className="gradient-text-sleek">Meningkatkan Peringkatmu</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity:0, y:24 }}
                                whileInView={{ opacity:1, y:0 }}
                                viewport={{ once:true }}
                                transition={{ delay: i*0.08 }}
                                className="glass-sleek rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="mb-4">{f.icon}</div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leaderboard */}
            <section id="leaderboard" className="py-24 relative overflow-hidden bg-transparent">
                <div className="absolute inset-0 bg-slate-950/40" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12 relative">
                        <h2 className="text-4xl font-black text-white mb-3 flex items-center justify-center gap-3 drop-shadow-lg"><Trophy className="w-10 h-10 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"/> Aula Pahlawan</h2>
                        <p className="text-amber-200/60 text-lg uppercase tracking-widest text-sm">Petualang Terhebat QuizQuest</p>
                    </div>
                    <div className="space-y-3">
                        {topStudents.slice(0,10).map((student, i) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity:0, x:-20 }}
                                whileInView={{ opacity:1, x:0 }}
                                viewport={{ once:true }}
                                transition={{ delay:i*0.05 }}
                                className="glass-sleek rounded-xl px-6 py-4 flex items-center gap-4 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all transform hover:scale-[1.02]"
                            >
                                <div className="w-10 text-center">
                                    {i===0 ? <Crown className="w-7 h-7 text-amber-400 mx-auto drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"/> : i===1 ? <Crown className="w-6 h-6 text-slate-300 mx-auto"/> : i===2 ? <Crown className="w-6 h-6 text-amber-600 mx-auto"/> : <span className="text-white/50 font-bold">#{i+1}</span>}
                                </div>
                                <img src={student.avatar_url} className="w-10 h-10 rounded-full ring-2 ring-white/30 object-cover" alt={student.name} />
                                <div className="flex-1">
                                    <p className="font-bold text-white">{student.name}</p>
                                    <p className="text-white/50 text-xs">Lv.{student.level} · {student.school ?? 'QuizQuest'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-yellow-400 text-lg">{student.xp.toLocaleString()}</p>
                                    <p className="text-white/40 text-xs">XP</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/leaderboard" className="inline-flex items-center gap-2 glass-sleek hover:bg-white/10 text-white font-bold px-10 py-4 rounded-xl transition-all uppercase tracking-widest text-sm">
                            Lihat Semua Pahlawan <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-24 bg-transparent relative">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">Panduan <span className="gradient-text-sleek">Petualang</span></h2>
                    <p className="text-slate-400 text-lg mb-16 uppercase tracking-widest text-sm">3 Langkah Menuju Puncak</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num:'1', icon:<UserPlus className="w-8 h-8 text-white"/>, title:'Daftar Gratis', desc:'Buat akun dalam 30 detik, pilih role Murid atau Guru.' },
                            { num:'2', icon:<Target className="w-8 h-8 text-white"/>, title:'Ikuti atau Buat Quiz', desc:'Murid join dengan kode kelas. Guru buat quiz kreatif.' },
                            { num:'3', icon:<Trophy className="w-8 h-8 text-white"/>, title:'Belajar & Naik Level', desc:'Kerjakan quiz, raih XP, naik level, dan diskusi dengan AI!' },
                        ].map(({ num, icon, title, desc }) => (
                            <div key={num} className="text-center group">
                                <div className="relative inline-flex w-24 h-24 rounded-2xl bg-slate-800 border-2 border-amber-500/30 items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] group-hover:-translate-y-2 transition-all duration-300 rotate-3 group-hover:rotate-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl" />
                                    {icon}
                                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-amber-500 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-lg shadow-lg rotate-12">{num}</div>
                                </div>
                                <h3 className="font-bold text-xl text-white mb-3 tracking-wide">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" />
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="glass-sleek rounded-3xl p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent" />
                        <div className="relative z-10">
                            <div className="mb-6"><Sparkles className="w-16 h-16 text-amber-400 mx-auto drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl tracking-wide">Siap Memulai Petualangan?</h2>
                            <p className="text-xl text-amber-200/80 mb-10"><strong className="text-amber-400">100% Gratis</strong> · Buka Potensimu Sekarang</p>
                            <div className="flex flex-wrap gap-6 justify-center">
                                <Link href="/register" className="group flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black px-10 py-5 rounded-xl text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all uppercase tracking-widest relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <UserPlus className="w-6 h-6"/> Daftar Sekarang
                                </Link>
                                <Link href="/login" className="flex items-center gap-2 glass-sleek border border-white/20 text-white font-bold px-10 py-5 rounded-xl text-lg hover:bg-white/10 transition-all uppercase tracking-widest">
                                    <LogIn className="w-6 h-6 text-cyan-400" /> Masuk
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950/80 backdrop-blur-md text-white py-12 border-t border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg opacity-90"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        >
                            <Rocket className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">QuizQuest</span>
                    </div>
                    <p className="text-slate-400 text-sm">© {new Date().getFullYear()} QuizQuest. Dibuat dengan ❤️ untuk pendidikan Indonesia.</p>
                </div>
            </footer>
        </div>
    )
}
