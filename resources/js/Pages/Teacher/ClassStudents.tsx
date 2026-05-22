import React, { useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react'
import { AlertTriangle, ArrowLeft, Award, BookOpen, CheckCircle2, Copy, GraduationCap, Key, Mail, School, Trash2, Users, X } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import type { Achievement, User } from '@/types'

type Student = User & {
    pivot?: {
        status?: string
        joined_at?: string
    }
    achievements?: Achievement[]
}

type Classroom = {
    id: number
    name: string
    code: string
    description?: string | null
    subject?: string | null
    grade_level?: string | null
    cover_image?: string | null
    cover_position_x?: number | null
    cover_position_y?: number | null
    quizzes_count?: number
    students: Student[]
}

export default function ClassStudents({ classroom, teacherTitles = [] }: { classroom: Classroom; teacherTitles: Achievement[] }) {
    const [copied, setCopied] = useState(false)
    const [studentToRemove, setStudentToRemove] = useState<Student | null>(null)
    const [removingId, setRemovingId] = useState<number | null>(null)
    const [selectedTitleByStudent, setSelectedTitleByStudent] = useState<Record<number, string>>({})
    const [processingTitleKey, setProcessingTitleKey] = useState<string | null>(null)
    const { delete: destroy, processing } = useForm()

    const copyCode = () => {
        navigator.clipboard.writeText(classroom.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    const removeStudent = () => {
        if (!studentToRemove) return

        setRemovingId(studentToRemove.id)
        destroy(`/teacher/classes/${classroom.id}/students/${studentToRemove.id}`, {
            preserveScroll: true,
            onSuccess: () => setStudentToRemove(null),
            onFinish: () => setRemovingId(null),
        })
    }

    const grantTitle = (student: Student) => {
        const achievementId = selectedTitleByStudent[student.id]
        if (!achievementId) return

        const key = `grant-${student.id}`
        setProcessingTitleKey(key)
        router.post(
            `/teacher/classes/${classroom.id}/students/${student.id}/titles`,
            { achievement_id: Number(achievementId) },
            {
                preserveScroll: true,
                onFinish: () => setProcessingTitleKey(null),
            },
        )
    }

    const revokeTitle = (student: Student, achievement: Achievement) => {
        const key = `revoke-${student.id}-${achievement.id}`
        setProcessingTitleKey(key)
        router.delete(`/teacher/classes/${classroom.id}/students/${student.id}/titles/${achievement.id}`, {
            preserveScroll: true,
            onFinish: () => setProcessingTitleKey(null),
        })
    }

    return (
        <AppLayout title="Kelola Murid" subtitle="Pantau murid yang tergabung di kelas Anda">
            <div className="mx-auto max-w-6xl py-8">
                <Link href="/teacher/classes" className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-500 transition-colors hover:text-violet-600">
                    <ArrowLeft className="h-5 w-5" /> Kembali ke Daftar Kelas
                </Link>

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="relative min-h-56 bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white md:p-8">
                        {classroom.cover_image && (
                            <img
                                src={`/storage/${classroom.cover_image}`}
                                alt={classroom.name}
                                className="absolute inset-0 h-full w-full object-cover opacity-35"
                                style={{ objectPosition: `${classroom.cover_position_x ?? 50}% ${classroom.cover_position_y ?? 50}%` }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                        <div className="relative z-10 flex min-h-40 flex-col justify-between gap-8 md:flex-row md:items-end">
                            <div className="max-w-2xl">
                                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/85">
                                    <School className="h-3.5 w-3.5" />
                                    {classroom.subject || 'Umum'} {classroom.grade_level ? `- Kelas ${classroom.grade_level}` : ''}
                                </p>
                                <h2 className="text-3xl font-black leading-tight md:text-4xl">{classroom.name}</h2>
                                <p className="mt-3 text-sm font-medium text-white/75 md:text-base">
                                    {classroom.description || 'Belum ada deskripsi kelas.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={copyCode}
                                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white/15 px-5 py-4 text-left backdrop-blur transition hover:bg-white/25"
                            >
                                <Key className="h-5 w-5 text-blue-100" />
                                <span>
                                    <span className="block text-xs font-bold uppercase tracking-wider text-blue-100">Kode Kelas</span>
                                    <span className="font-mono text-xl font-black tracking-widest">{classroom.code}</span>
                                </span>
                                {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-200" /> : <Copy className="h-5 w-5 text-white/80" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4 border-b border-slate-100 p-5 dark:border-slate-800 md:grid-cols-3">
                        <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30">
                            <Users className="mb-2 h-5 w-5 text-blue-600 dark:text-blue-300" />
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{classroom.students.length}</p>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Murid Terdaftar</p>
                        </div>
                        <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30">
                            <BookOpen className="mb-2 h-5 w-5 text-violet-600 dark:text-violet-300" />
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{classroom.quizzes_count || 0}</p>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Kuis di Kelas</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                            <GraduationCap className="mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{classroom.grade_level || '-'}</p>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tingkat / Grade</p>
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Daftar Murid</h3>
                                <p className="text-sm text-slate-500">Murid akan muncul di sini setelah bergabung ke kelas.</p>
                            </div>
                            <Button type="button" variant="secondary" onClick={copyCode} className="rounded-xl">
                                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Kode Tersalin' : 'Salin Kode Kelas'}
                            </Button>
                        </div>

                        {classroom.students.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/40">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-slate-900">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white">Belum ada murid</h4>
                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    Bagikan kode kelas <span className="font-mono font-black text-slate-700 dark:text-slate-200">{classroom.code}</span> agar murid bisa bergabung.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                                {classroom.students.map((student) => {
                                    const hasTeacherTitle = (student.achievements?.length ?? 0) > 0
                                    const primaryTitle = student.achievements?.[0]

                                    return (
                                    <div
                                        key={student.id}
                                        className={`relative flex flex-col gap-4 border-b p-4 last:border-b-0 sm:flex-row sm:items-center ${
                                            hasTeacherTitle
                                                ? 'border-amber-200 bg-gradient-to-r from-amber-50 via-white to-white dark:border-amber-900/50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900'
                                                : 'border-slate-100 dark:border-slate-800'
                                        }`}
                                    >
                                        {primaryTitle && (
                                            <div className="absolute right-4 top-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-amber-500/20">
                                                {primaryTitle.name}
                                            </div>
                                        )}
                                        <div className="relative">
                                            <img
                                                src={student.avatar_url}
                                                alt={student.name}
                                                className={`h-14 w-14 rounded-2xl object-cover ring-2 ${
                                                    hasTeacherTitle
                                                        ? 'ring-amber-400 shadow-lg shadow-amber-500/20'
                                                        : 'ring-slate-100 dark:ring-slate-800'
                                                }`}
                                            />
                                            {hasTeacherTitle && (
                                                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-md dark:border-slate-900">
                                                    <Award className="h-4 w-4" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-black text-slate-900 dark:text-white">{student.name}</h4>
                                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                    {student.pivot?.status || 'active'}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {student.email}</span>
                                                <span>{student.school || 'Sekolah belum diisi'}</span>
                                                <span>{student.grade || 'Grade belum diisi'}</span>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800">
                                            <p className="text-lg font-black text-slate-900 dark:text-white">{student.xp || 0}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">XP</p>
                                        </div>
                                        <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:max-w-sm">
                                            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                                                <Award className="h-4 w-4 text-amber-500" />
                                                Title Guru
                                            </div>
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {student.achievements && student.achievements.length > 0 ? (
                                                    student.achievements.map((achievement) => (
                                                        <span
                                                            key={achievement.id}
                                                            className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                                                        >
                                                            {achievement.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => revokeTitle(student, achievement)}
                                                                disabled={processingTitleKey === `revoke-${student.id}-${achievement.id}`}
                                                                className="rounded-full text-amber-700 transition hover:text-red-600 disabled:opacity-50 dark:text-amber-200"
                                                                aria-label={`Cabut title ${achievement.name} dari ${student.name}`}
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-400">Belum ada title dari guru.</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    value={selectedTitleByStudent[student.id] || ''}
                                                    onChange={(event) => setSelectedTitleByStudent((current) => ({ ...current, [student.id]: event.target.value }))}
                                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-violet-950"
                                                >
                                                    <option value="">Pilih title</option>
                                                    {teacherTitles.map((title) => (
                                                        <option key={title.id} value={title.id}>
                                                            {title.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    disabled={!selectedTitleByStudent[student.id] || processingTitleKey === `grant-${student.id}`}
                                                    loading={processingTitleKey === `grant-${student.id}`}
                                                    onClick={() => grantTitle(student)}
                                                    className="rounded-xl px-3 text-xs"
                                                >
                                                    Beri
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            loading={processing && removingId === student.id}
                                            onClick={() => setStudentToRemove(student)}
                                            className="rounded-xl px-3"
                                            title="Keluarkan murid"
                                            aria-label={`Keluarkan ${student.name} dari kelas`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {studentToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="relative bg-gradient-to-br from-red-600 to-rose-700 p-6 text-white">
                            <button
                                type="button"
                                onClick={() => setStudentToRemove(null)}
                                disabled={processing}
                                className="absolute right-4 top-4 rounded-xl bg-white/15 p-2 text-white/80 transition hover:bg-white/25 hover:text-white disabled:opacity-50"
                                aria-label="Tutup konfirmasi keluarkan murid"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black">Keluarkan murid?</h3>
                            <p className="mt-2 text-sm font-medium text-red-100">
                                <span className="font-black text-white">{studentToRemove.name}</span> akan dikeluarkan dari kelas "{classroom.name}".
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                                <img
                                    src={studentToRemove.avatar_url}
                                    alt={studentToRemove.name}
                                    className="h-14 w-14 rounded-2xl object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="truncate font-black text-slate-900 dark:text-white">{studentToRemove.name}</p>
                                    <p className="truncate text-sm font-medium text-slate-500">{studentToRemove.email}</p>
                                </div>
                            </div>

                            <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">
                                Murid tidak akan melihat kuis khusus kelas ini lagi sampai bergabung kembali dengan kode kelas.
                            </p>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={processing}
                                    onClick={() => setStudentToRemove(null)}
                                    className="rounded-xl"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    loading={processing && removingId === studentToRemove.id}
                                    onClick={removeStudent}
                                    className="rounded-xl"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Keluarkan Murid
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
