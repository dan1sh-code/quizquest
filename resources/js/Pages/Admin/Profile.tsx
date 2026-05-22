import React, { FormEvent, useMemo, useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react'
import {
    AlertTriangle,
    CheckCircle2,
    KeyRound,
    Laptop,
    Lock,
    LogOut,
    Mail,
    MapPin,
    MonitorSmartphone,
    Phone,
    QrCode,
    Shield,
    ShieldCheck,
    Trash2,
    Upload,
    User,
    UserCog,
} from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

type ProfileData = {
    name: string
    username?: string
    email: string
    phone?: string
    language: string
    avatar_url: string
    role: string
}

type SessionData = {
    id: string
    device: string
    browser: string
    ip_address?: string
    location: string
    last_activity: string
    is_current: boolean
}

type SecurityLog = {
    id: number
    action: string
    description: string
    ip_address?: string
    browser: string
    created_at: string
}

type Props = {
    profile: ProfileData
    sessions: SessionData[]
    securityLogs: SecurityLog[]
    twoFactor: {
        enabled: boolean
        secret: string
        issuer: string
        account: string
    }
}

export default function Profile({ profile, sessions, securityLogs, twoFactor }: Props) {
    const [tab, setTab] = useState<'profile' | 'security'>('profile')
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url)

    const profileForm = useForm({
        name: profile.name ?? '',
        username: profile.username ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        language: profile.language ?? 'id',
        avatar: null as File | null,
    })

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const otpUri = useMemo(() => {
        const label = encodeURIComponent(`${twoFactor.issuer}:${twoFactor.account}`)
        const issuer = encodeURIComponent(twoFactor.issuer)
        return `otpauth://totp/${label}?secret=${twoFactor.secret.replace(/[^A-Z0-9]/gi, '')}&issuer=${issuer}`
    }, [twoFactor])

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpUri)}`

    const submitProfile = (event: FormEvent) => {
        event.preventDefault()
        profileForm.post('/admin/profile', {
            forceFormData: true,
            preserveScroll: true,
        })
    }

    const submitPassword = (event: FormEvent) => {
        event.preventDefault()
        passwordForm.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        })
    }

    const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        profileForm.setData('avatar', file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    return (
        <AppLayout title="Profil Admin" subtitle="Kelola identitas administrator dan keamanan akun">
            <div className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800">
                    {[
                        { id: 'profile', label: 'Profil Admin', icon: UserCog },
                        { id: 'security', label: 'Keamanan Akun', icon: ShieldCheck },
                    ].map((item) => {
                        const Icon = item.icon
                        const active = tab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id as typeof tab)}
                                className={cn(
                                    'inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors',
                                    active
                                        ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        )
                    })}
                </div>

                {tab === 'profile' ? (
                    <form onSubmit={submitProfile} className="grid lg:grid-cols-[320px_1fr] gap-6">
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-fit">
                            <div className="flex flex-col items-center text-center">
                                <img src={avatarPreview} alt={profile.name} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-violet-100 dark:ring-violet-900/40" />
                                <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-sm font-bold cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30">
                                    <Upload className="w-4 h-4" />
                                    Ganti Foto
                                    <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                                </label>
                                <p className="mt-4 font-black text-xl text-slate-900 dark:text-white">{profile.name}</p>
                                <span className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                                    <Shield className="w-3.5 h-3.5" />
                                    {profile.role}
                                </span>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Field label="Nama Lengkap" icon={User} error={profileForm.errors.name}>
                                    <input value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Username" icon={UserCog} error={profileForm.errors.username}>
                                    <input value={profileForm.data.username} onChange={(e) => profileForm.setData('username', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Alamat Email" icon={Mail} error={profileForm.errors.email}>
                                    <input type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Nomor Telepon" icon={Phone} error={profileForm.errors.phone}>
                                    <input value={profileForm.data.phone} onChange={(e) => profileForm.setData('phone', e.target.value)} className={inputClass} placeholder="+62..." />
                                </Field>
                                <Field label="Role / Hak Akses" icon={Shield}>
                                    <input value="Administrator penuh" disabled className={cn(inputClass, 'opacity-75 cursor-not-allowed')} />
                                </Field>
                                <Field label="Pilihan Bahasa" icon={MapPin} error={profileForm.errors.language}>
                                    <select value={profileForm.data.language} onChange={(e) => profileForm.setData('language', e.target.value)} className={inputClass}>
                                        <option value="id">Bahasa Indonesia</option>
                                        <option value="en">English</option>
                                    </select>
                                </Field>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button type="submit" loading={profileForm.processing}>Simpan Profil</Button>
                            </div>
                        </section>
                    </form>
                ) : (
                    <div className="grid xl:grid-cols-[1fr_380px] gap-6">
                        <div className="space-y-6">
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Lock className="w-5 h-5 text-violet-500" />
                                    Ubah Password
                                </h3>
                                <form onSubmit={submitPassword} className="grid md:grid-cols-3 gap-4">
                                    <Field label="Password Lama" icon={KeyRound} error={passwordForm.errors.current_password}>
                                        <input type="password" value={passwordForm.data.current_password} onChange={(e) => passwordForm.setData('current_password', e.target.value)} className={inputClass} />
                                    </Field>
                                    <Field label="Password Baru" icon={Lock} error={passwordForm.errors.password}>
                                        <input type="password" value={passwordForm.data.password} onChange={(e) => passwordForm.setData('password', e.target.value)} className={inputClass} />
                                    </Field>
                                    <Field label="Konfirmasi Password" icon={Lock} error={passwordForm.errors.password_confirmation}>
                                        <input type="password" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} className={inputClass} />
                                    </Field>
                                    <div className="md:col-span-3 flex justify-end">
                                        <Button type="submit" loading={passwordForm.processing}>Perbarui Password</Button>
                                    </div>
                                </form>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <MonitorSmartphone className="w-5 h-5 text-violet-500" />
                                        Perangkat & Sesi Aktif
                                    </h3>
                                    <button
                                        onClick={() => router.post('/admin/profile/logout-other-sessions', {}, { preserveScroll: true })}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out All Sessions
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                                            <Laptop className="w-5 h-5 text-slate-500 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {session.device} · {session.browser}
                                                    {session.is_current && <span className="ml-2 text-[10px] uppercase text-emerald-600 font-black">Sesi ini</span>}
                                                </p>
                                                <p className="text-xs text-slate-500">{session.ip_address || '-'} · {session.location}</p>
                                            </div>
                                            <p className="text-xs text-slate-400 whitespace-nowrap">{session.last_activity}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <ShieldCheck className="w-5 h-5 text-violet-500" />
                                    Riwayat Login & Aktivitas Keamanan
                                </h3>
                                <div className="space-y-3">
                                    {securityLogs.length === 0 ? (
                                        <p className="text-sm text-slate-500">Belum ada aktivitas keamanan yang tercatat.</p>
                                    ) : securityLogs.map((log) => (
                                        <div key={log.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{log.description}</p>
                                                <p className="text-xs text-slate-500">{log.browser} · {log.ip_address || '-'} · {log.created_at}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <QrCode className="w-5 h-5 text-violet-500" />
                                    Two-Factor Authentication
                                </h3>
                                <div className="flex flex-col items-center text-center">
                                    <img src={qrUrl} alt="2FA QR Code" className="w-44 h-44 rounded-xl border border-slate-200 dark:border-slate-800 p-2 bg-white" />
                                    <p className="mt-3 text-sm text-slate-500">Scan QR ini dengan Google Authenticator, Authy, atau aplikasi authenticator lain.</p>
                                    <code className="mt-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">{twoFactor.secret}</code>
                                    <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-amber-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        Status: belum aktif
                                    </span>
                                </div>
                            </section>

                            <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/40 p-6">
                                <h3 className="font-black text-red-700 dark:text-red-300 flex items-center gap-2 mb-2">
                                    <Trash2 className="w-5 h-5" />
                                    Nonaktifkan Akun
                                </h3>
                                <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-4">Akun admin akan dinonaktifkan dan tidak dapat digunakan sampai diaktifkan kembali dari database atau panel super admin.</p>
                                <button
                                    onClick={() => router.delete('/admin/profile/deactivate', { preserveScroll: true })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black"
                                >
                                    Nonaktifkan Akun
                                </button>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'

function Field({ label, icon: Icon, error, children }: { label: string; icon: React.ElementType; error?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Icon className="w-4 h-4 text-slate-400" />
                {label}
            </span>
            {children}
            {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
        </label>
    )
}
