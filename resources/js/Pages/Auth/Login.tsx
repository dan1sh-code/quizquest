import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { LogIn, Eye, EyeOff, Zap } from 'lucide-react'
import Button from '@/Components/ui/Button'

interface Props { canResetPassword?: boolean; status?: string }

export default function Login({ canResetPassword, status }: Props) {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false })
    const [showPassword, setShowPassword] = React.useState(false)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        post('/login')
    }

    return (
        <div className="min-h-screen hero-bg flex items-center justify-center p-4">
            <Head title="Masuk" />
            <div className="absolute top-20 left-10 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                className="relative z-10 w-full max-w-md">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-3xl">🎯</span>
                        <span className="font-black text-2xl text-white">QuizQuest</span>
                    </Link>
                    <h1 className="text-3xl font-black text-white mb-2">Selamat Datang!</h1>
                    <p className="text-white/60">Masuk untuk melanjutkan perjalanan belajarmu</p>
                </div>

                <div className="glass rounded-3xl p-8">
                    {status && <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl px-4 py-3 text-sm">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required autoFocus
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="nama@email.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} required
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-white/40 hover:text-white/80 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4 rounded border-white/30 bg-white/10" />
                                <span className="text-sm text-white/70">Ingat saya</span>
                            </label>
                        </div>

                        <Button type="submit" loading={processing} className="w-full justify-center" size="lg" icon={<LogIn className="w-5 h-5" />}>
                            Masuk ke QuizQuest
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-white/60 text-sm">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-violet-300 hover:text-white font-semibold transition-colors">
                                Daftar Gratis →
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <div className="inline-flex items-center gap-2 text-white/40 text-xs">
                        <Zap className="w-3 h-3" /> Demo: guru@quizquest.id / password123
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
