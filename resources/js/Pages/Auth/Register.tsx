import React, { FormEvent } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import Button from '@/Components/ui/Button'

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'student',
    })
    const [showPassword, setShowPassword] = React.useState(false)

    const submit = (e: FormEvent) => {
        e.preventDefault()
        post('/register')
    }

    return (
        <div className="min-h-screen hero-bg flex items-center justify-center p-4">
            <Head title="Daftar" />
            <div className="absolute top-20 left-10 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="relative z-10 w-full max-w-md">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-3xl">🎯</span>
                        <span className="font-black text-2xl text-white">QuizQuest</span>
                    </Link>
                    <h1 className="text-3xl font-black text-white mb-2">Bergabung Sekarang!</h1>
                    <p className="text-white/60">Gratis selamanya. Mulai perjalanan belajarmu.</p>
                </div>

                <div className="glass rounded-3xl p-8">
                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[{value:'student',icon:'👨‍🎓',label:'Saya Murid'},{value:'teacher',icon:'👨‍🏫',label:'Saya Guru'}].map(({value,icon,label}) => (
                            <button key={value} type="button" onClick={() => setData('role', value)}
                                className={`p-4 rounded-2xl border-2 text-center font-semibold transition-all ${data.role === value ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/20 text-white/60 hover:border-white/40'}`}>
                                <div className="text-2xl mb-1">{icon}</div>
                                <div className="text-sm">{label}</div>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Nama Lengkap</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="Nama lengkapmu" />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="nama@email.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} required
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="Min. 8 karakter" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-white/40 hover:text-white/80">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white/80 mb-2">Konfirmasi Password</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" placeholder="Ulangi password" />
                        </div>

                        <Button type="submit" loading={processing} className="w-full justify-center mt-2" size="lg" icon={<UserPlus className="w-5 h-5" />}>
                            Daftar Gratis Sekarang
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-white/60 text-sm">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-violet-300 hover:text-white font-semibold transition-colors">Masuk →</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
