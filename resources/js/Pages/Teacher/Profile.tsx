import React, { FormEvent, useMemo, useRef, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
    Award,
    BookOpenCheck,
    BriefcaseBusiness,
    Camera,
    FileText,
    GraduationCap,
    Link as LinkIcon,
    Mail,
    Phone,
    Save,
    School,
    ShieldCheck,
    Sparkles,
    UploadCloud,
    UserRound,
} from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { avatarUrl, cn } from '@/lib/utils'
import type { PageProps } from '@/types'

type ProfileForm = {
    name: string
    username: string
    email: string
    phone: string
    school: string
    grade: string
    subject_expertise: string
    education: string
    certification: string
    website: string
    linkedin: string
    bio: string
    avatar: File | null
    portfolio: File | null
}

type TextFieldProps = {
    label: string
    name: keyof ProfileForm
    value: string
    icon: React.ElementType
    error?: string
    placeholder?: string
    type?: string
    onChange: (name: keyof ProfileForm, value: string) => void
}

function TextField({ label, name, value, icon: Icon, error, placeholder, type = 'text', onChange }: TextFieldProps) {
    return (
        <label className="flex h-full flex-col">
            <span className="mb-2 flex min-h-5 items-center gap-2 text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">
                <Icon className="h-4 w-4 flex-shrink-0 text-violet-500" />
                <span className="truncate">{label}</span>
            </span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                placeholder={placeholder}
                className={cn(
                    'h-12 w-full rounded-2xl border bg-white/80 px-4 text-sm font-medium leading-none text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:ring-violet-900/30',
                    error ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700',
                )}
            />
            {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
        </label>
    )
}

export default function Profile() {
    const { auth } = usePage<PageProps>().props
    const user = auth.user
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const portfolioInputRef = useRef<HTMLInputElement>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<ProfileForm>({
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        school: user.school ?? '',
        grade: user.grade ?? '',
        subject_expertise: user.subject_expertise ?? '',
        education: user.education ?? '',
        certification: user.certification ?? '',
        website: user.website ?? '',
        linkedin: user.linkedin ?? '',
        bio: user.bio ?? '',
        avatar: null,
        portfolio: null,
    })

    const completion = useMemo(() => {
        const filled = [
            data.name,
            data.email,
            data.school,
            data.subject_expertise,
            data.education,
            data.bio,
            user.avatar_url || data.avatar,
            user.portfolio_url || data.portfolio,
        ].filter(Boolean).length

        return Math.round((filled / 8) * 100)
    }, [data, user.avatar_url, user.portfolio_url])

    const updateText = (name: keyof ProfileForm, value: string) => {
        setData(name, value as never)
    }

    const chooseAvatar = (file?: File) => {
        if (!file) return
        setData('avatar', file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const choosePortfolio = (file?: File) => {
        if (!file) return
        setData('portfolio', file)
    }

    const submit = (event: FormEvent) => {
        event.preventDefault()
        post('/teacher/profile', {
            forceFormData: true,
            preserveScroll: true,
        })
    }

    return (
        <AppLayout title="Profil Saya" subtitle="Lengkapi identitas agar murid lebih mudah mengenal guru mereka">
            <form onSubmit={submit} className="space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-6 py-7 text-white md:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="relative w-fit">
                                    <img
                                        src={avatarPreview || user.avatar_url || avatarUrl(user.name, user.avatar)}
                                        alt={user.name}
                                        className="h-28 w-28 rounded-3xl border-4 border-white/40 object-cover shadow-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 rounded-2xl bg-white p-3 text-violet-600 shadow-lg transition hover:scale-105"
                                        aria-label="Pilih foto profil"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) => chooseAvatar(event.target.files?.[0])}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white/90">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Profil Guru QuizQuest
                                    </p>
                                    <h2 className="text-3xl font-black leading-tight md:text-4xl">{data.name || 'Nama Guru'}</h2>
                                    <p className="mt-2 max-w-2xl text-sm font-medium text-white/75 md:text-base">
                                        {data.subject_expertise || 'Tambahkan bidang keahlian'} di {data.school || 'sekolah Anda'}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl bg-white/15 p-4 backdrop-blur sm:w-64">
                                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                                    <span>Kelengkapan profil</span>
                                    <span>{completion}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/20">
                                    <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${completion}%` }} />
                                </div>
                                <p className="mt-2 text-xs text-white/70">Foto, bio, sekolah, dan portofolio membuat profil terlihat lebih siap.</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Identitas Guru</h3>
                                <p className="text-sm text-slate-500">Data utama yang tampil di kelas dan quiz.</p>
                            </div>
                        </div>

                        <div className="grid items-start gap-x-5 gap-y-4 md:grid-cols-2">
                            <TextField label="Nama lengkap" name="name" value={data.name} icon={UserRound} error={errors.name} placeholder="Contoh: Budi Santoso" onChange={updateText} />
                            <TextField label="Username" name="username" value={data.username} icon={Sparkles} error={errors.username} placeholder="pak_budi" onChange={updateText} />
                            <TextField label="Email" name="email" value={data.email} icon={Mail} error={errors.email} placeholder="guru@sekolah.id" type="email" onChange={updateText} />
                            <TextField label="Nomor telepon" name="phone" value={data.phone} icon={Phone} error={errors.phone} placeholder="08xxxxxxxxxx" onChange={updateText} />
                            <TextField label="Sekolah" name="school" value={data.school} icon={School} error={errors.school} placeholder="SMAN 1 Jakarta" onChange={updateText} />
                            <TextField label="Kelas yang diampu" name="grade" value={data.grade} icon={GraduationCap} error={errors.grade} placeholder="X, XI, XII IPA" onChange={updateText} />
                            <TextField label="Bidang keahlian" name="subject_expertise" value={data.subject_expertise} icon={BookOpenCheck} error={errors.subject_expertise} placeholder="Matematika, Fisika, Biologi" onChange={updateText} />
                            <TextField label="Pendidikan terakhir" name="education" value={data.education} icon={Award} error={errors.education} placeholder="S.Pd. Matematika" onChange={updateText} />
                            <TextField label="Sertifikasi" name="certification" value={data.certification} icon={ShieldCheck} error={errors.certification} placeholder="Guru Penggerak, PPG, dll." onChange={updateText} />
                            <TextField label="Website pribadi" name="website" value={data.website} icon={LinkIcon} error={errors.website} placeholder="https://..." type="url" onChange={updateText} />
                            <div className="md:col-span-2">
                                <TextField label="LinkedIn atau profil profesional" name="linkedin" value={data.linkedin} icon={BriefcaseBusiness} error={errors.linkedin} placeholder="https://linkedin.com/in/..." type="url" onChange={updateText} />
                            </div>
                        </div>

                        <label className="mt-5 block">
                            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                                <FileText className="h-4 w-4 text-violet-500" />
                                Bio singkat
                            </span>
                            <textarea
                                value={data.bio}
                                onChange={(event) => setData('bio', event.target.value)}
                                rows={5}
                                placeholder="Ceritakan gaya mengajar, pengalaman, atau fokus pembelajaran Anda."
                                className={cn(
                                    'w-full resize-none rounded-2xl border bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:ring-violet-900/30',
                                    errors.bio ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700',
                                )}
                            />
                            {errors.bio && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.bio}</p>}
                        </label>
                    </motion.section>

                    <motion.aside
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className="space-y-6"
                    >
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white">Portofolio</h3>
                                    <p className="text-xs text-slate-500">PDF, dokumen, presentasi, atau gambar.</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => portfolioInputRef.current?.click()}
                                className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-violet-900/20"
                            >
                                <UploadCloud className="mx-auto mb-3 h-8 w-8 text-violet-500" />
                                <span className="block text-sm font-black text-slate-800 dark:text-slate-100">
                                    {data.portfolio?.name || user.portfolio_name || 'Upload portofolio'}
                                </span>
                                <span className="mt-1 block text-xs font-medium text-slate-500">Maksimal 5 MB</span>
                            </button>
                            <input
                                ref={portfolioInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(event) => choosePortfolio(event.target.files?.[0])}
                            />
                            {errors.portfolio && <p className="mt-2 text-xs font-semibold text-red-500">{errors.portfolio}</p>}
                            {user.portfolio_url && (
                                <a
                                    href={user.portfolio_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                                >
                                    <FileText className="h-4 w-4" />
                                    Lihat portofolio saat ini
                                </a>
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-4 font-black text-slate-900 dark:text-white">Preview Kartu Guru</h3>
                            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white shadow-lg">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={avatarPreview || user.avatar_url || avatarUrl(user.name, user.avatar)}
                                        alt={data.name}
                                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-lg font-black">{data.name || 'Nama Guru'}</p>
                                        <p className="truncate text-sm text-white/65">{data.subject_expertise || 'Bidang keahlian'}</p>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <p className="text-white/50">Sekolah</p>
                                        <p className="mt-1 truncate font-bold">{data.school || '-'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <p className="text-white/50">Kelas</p>
                                        <p className="mt-1 truncate font-bold">{data.grade || '-'}</p>
                                    </div>
                                </div>
                                {(data.website || data.linkedin || user.portfolio_url) && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {data.website && (
                                            <a
                                                href={data.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition hover:bg-white/20 hover:text-white"
                                            >
                                                <LinkIcon className="h-3.5 w-3.5" />
                                                Website
                                            </a>
                                        )}
                                        {data.linkedin && (
                                            <a
                                                href={data.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition hover:bg-white/20 hover:text-white"
                                            >
                                                <BriefcaseBusiness className="h-3.5 w-3.5" />
                                                LinkedIn
                                            </a>
                                        )}
                                        {user.portfolio_url && (
                                            <a
                                                href={user.portfolio_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition hover:bg-white/20 hover:text-white"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                Portofolio
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-4 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                            <Button type="submit" loading={processing} className="w-full rounded-2xl py-3" icon={<Save className="h-4 w-4" />}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                            {recentlySuccessful && (
                                <p className="mt-3 text-center text-xs font-bold text-emerald-600">Profil berhasil disimpan.</p>
                            )}
                        </div>
                    </motion.aside>
                </div>
            </form>
        </AppLayout>
    )
}
