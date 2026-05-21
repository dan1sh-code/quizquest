import React, { useMemo, useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import {
    AlertCircle,
    BookOpen,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    CalendarClock,
    Clock3,
    Edit3,
    FileText,
    MessageSquareText,
    Search,
    UserRound,
    X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'
import type { AttemptAnswer, PaginatedData, QuizAttempt, User } from '@/types'

type PendingEssayAnswer = AttemptAnswer & {
    avatar_url?: string
    attempt: QuizAttempt & {
        user: User & { avatar_url?: string }
    }
}

const feedbackTemplates = [
    'Jawaban sudah tepat dan runtut. Pertahankan cara menjelaskannya.',
    'Ide utama sudah benar, tetapi perlu menambahkan alasan atau contoh agar lebih kuat.',
    'Jawaban masih terlalu singkat. Coba jelaskan langkah berpikirnya dengan lebih lengkap.',
    'Perhatikan kembali bagian konsep utama, karena masih ada bagian yang kurang sesuai.',
]

export default function Grading({ pendingAnswers }: { pendingAnswers: PaginatedData<PendingEssayAnswer> }) {
    const [selectedAnswer, setSelectedAnswer] = useState<PendingEssayAnswer | null>(pendingAnswers.data[0] ?? null)
    const [query, setQuery] = useState('')
    const { data, setData, post, processing, reset, errors } = useForm({
        points_earned: pendingAnswers.data[0]?.question?.points ?? 0,
        teacher_feedback: '',
    })

    const filteredAnswers = useMemo(() => {
        const keyword = query.trim().toLowerCase()
        if (!keyword) return pendingAnswers.data

        return pendingAnswers.data.filter((answer) => {
            const haystack = [
                answer.attempt?.user?.name,
                answer.attempt?.quiz?.title,
                answer.question?.question_text,
                answer.essay_answer,
            ].filter(Boolean).join(' ').toLowerCase()

            return haystack.includes(keyword)
        })
    }, [pendingAnswers.data, query])

    const gradingDeadline = useMemo(() => {
        const deadlines = pendingAnswers.data
            .map((answer) => answer.attempt?.completed_at ? new Date(answer.attempt.completed_at) : null)
            .filter((date): date is Date => Boolean(date) && !Number.isNaN(date.getTime()))
            .map((date) => new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000))
            .sort((a, b) => a.getTime() - b.getTime())

        return deadlines[0] ?? null
    }, [pendingAnswers.data])

    const deadlineLabel = gradingDeadline
        ? gradingDeadline.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-'

    const remainingDeadlineTime = (() => {
        if (!gradingDeadline) return '-'

        const diffMs = gradingDeadline.getTime() - Date.now()
        if (diffMs <= 0) return 'Lewat'

        const totalHours = Math.ceil(diffMs / (60 * 60 * 1000))
        const days = Math.floor(totalHours / 24)
        const hours = totalHours % 24

        if (days <= 0) return `${hours} jam`
        if (hours === 0) return `${days} hari`
        return `${days} hari ${hours} jam`
    })()

    const handleSelect = (answer: PendingEssayAnswer) => {
        setSelectedAnswer(answer)
        setData({
            points_earned: answer.question?.points ?? 0,
            teacher_feedback: '',
        })
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (!selectedAnswer) return

        post(`/teacher/grading/${selectedAnswer.id}/grade`, {
            onSuccess: () => {
                setSelectedAnswer(null)
                reset()
            },
        })
    }

    const setQuickScore = (percentage: number) => {
        if (!selectedAnswer?.question) return
        setData('points_earned', Math.round((selectedAnswer.question.points * percentage) / 100))
    }

    const addFeedbackTemplate = (template: string) => {
        setData('teacher_feedback', data.teacher_feedback ? `${data.teacher_feedback}\n${template}` : template)
    }

    return (
        <AppLayout title="Penilaian Essay" subtitle="Berikan nilai untuk jawaban essay murid">
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        label="Menunggu Dinilai"
                        value={pendingAnswers.total}
                        icon={<FileText className="h-6 w-6" />}
                        color="violet"
                    />
                    <StatCard
                        label="Deadline Penilaian"
                        value={deadlineLabel}
                        icon={<CalendarClock className="h-6 w-6" />}
                        color="blue"
                    />
                    <StatCard
                        label="Sisa Waktu"
                        value={remainingDeadlineTime}
                        icon={<Clock3 className="h-6 w-6" />}
                        color="emerald"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Cari nama murid, quiz, soal, atau isi jawaban..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
                                />
                            </div>
                        </div>

                        {pendingAnswers.data.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white/80 p-12 text-center shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Semua Sudah Dinilai!</h3>
                                <p className="text-slate-500">Tidak ada jawaban essay yang menunggu penilaian saat ini.</p>
                            </div>
                        ) : filteredAnswers.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/70">
                                <Search className="mx-auto mb-3 h-9 w-9 text-slate-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Tidak ada hasil cocok</h3>
                                <p className="mt-1 text-sm text-slate-500">Coba kata kunci lain atau kosongkan pencarian.</p>
                            </div>
                        ) : (
                            filteredAnswers.map((answer) => (
                                <button
                                    key={answer.id}
                                    onClick={() => handleSelect(answer)}
                                    className={cn(
                                        'block w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900',
                                        selectedAnswer?.id === answer.id
                                            ? 'border-violet-500 ring-4 ring-violet-500/15'
                                            : 'border-slate-200 hover:border-violet-300 dark:border-slate-800'
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={answer.avatar_url ?? answer.attempt.user.avatar_url}
                                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                                            alt={answer.attempt.user.name}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{answer.attempt.user.name}</h4>
                                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                        {answer.attempt.quiz?.title ?? 'Quiz'}
                                                    </p>
                                                </div>
                                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    <AlertCircle className="h-3 w-3" /> Pending
                                                </span>
                                            </div>
                                            <p className="mb-2 line-clamp-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                {answer.question?.question_text}
                                            </p>
                                            <p className="line-clamp-2 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                                                {answer.essay_answer}
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{answer.question?.points ?? 0} poin maks</span>
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{answer.essay_answer?.length ?? 0} karakter</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}

                        {pendingAnswers.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                {pendingAnswers.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        className={cn(
                                            'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition',
                                            link.active
                                                ? 'border-violet-500 bg-violet-600 text-white'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                                            !link.url && 'pointer-events-none opacity-40'
                                        )}
                                    >
                                        {link.label.includes('Previous') ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : link.label.includes('Next') ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="xl:sticky xl:top-24">
                        <AnimatePresence mode="wait">
                            {selectedAnswer ? (
                                <motion.div
                                    key={selectedAnswer.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                                <Edit3 className="h-5 w-5 text-violet-500" /> Beri Nilai
                                            </h3>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                <UserRound className="h-3.5 w-3.5" />
                                                {selectedAnswer.attempt.user.name}
                                            </p>
                                        </div>
                                        <button onClick={() => setSelectedAnswer(null)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <p className="mb-2 text-xs font-bold uppercase text-slate-500">Pertanyaan ({selectedAnswer.question?.points ?? 0} Poin Maks)</p>
                                        <p className="mb-4 rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm font-semibold text-slate-900 dark:border-violet-800/30 dark:bg-violet-900/20 dark:text-white">
                                            {selectedAnswer.question?.question_text}
                                        </p>

                                        <p className="mb-2 text-xs font-bold uppercase text-slate-500">Jawaban Murid</p>
                                        <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                                            {selectedAnswer.essay_answer}
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nilai (0 - {selectedAnswer.question?.points ?? 0})</label>
                                                <span className="text-sm font-black text-violet-600 dark:text-violet-300">{data.points_earned}/{selectedAnswer.question?.points ?? 0}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max={selectedAnswer.question?.points ?? 0}
                                                value={data.points_earned}
                                                onChange={event => setData('points_earned', Number(event.target.value))}
                                                className="mb-3 w-full accent-violet-600"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                max={selectedAnswer.question?.points ?? 0}
                                                value={data.points_earned}
                                                onChange={event => setData('points_earned', Number(event.target.value))}
                                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                required
                                            />
                                            <div className="mt-2 grid grid-cols-4 gap-2">
                                                {[0, 50, 75, 100].map((score) => (
                                                    <button
                                                        key={score}
                                                        type="button"
                                                        onClick={() => setQuickScore(score)}
                                                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-violet-900/20"
                                                    >
                                                        {score}%
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.points_earned && <p className="mt-1 text-xs font-semibold text-red-500">{errors.points_earned}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <MessageSquareText className="h-4 w-4 text-violet-500" />
                                                Feedback (Opsional)
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={data.teacher_feedback}
                                                onChange={event => setData('teacher_feedback', event.target.value)}
                                                placeholder="Berikan masukan untuk murid..."
                                                className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {feedbackTemplates.map((template, index) => (
                                                    <button
                                                        key={template}
                                                        type="button"
                                                        onClick={() => addFeedbackTemplate(template)}
                                                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-violet-100 hover:text-violet-700 dark:bg-slate-800 dark:text-slate-300"
                                                    >
                                                        Template {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.teacher_feedback && <p className="mt-1 text-xs font-semibold text-red-500">{errors.teacher_feedback}</p>}
                                        </div>

                                        <Button type="submit" loading={processing} className="w-full rounded-xl">
                                            Simpan Nilai
                                        </Button>
                                    </form>
                                </motion.div>
                            ) : (
                                <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <Edit3 className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-medium text-slate-500">Pilih jawaban di samping untuk mulai menilai.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: 'violet' | 'blue' | 'emerald' }) {
    const styles = {
        violet: 'border-violet-100 dark:border-violet-900/40 text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300',
        blue: 'border-blue-100 dark:border-blue-900/40 text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
        emerald: 'border-emerald-100 dark:border-emerald-900/40 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300',
    }

    return (
        <div className={cn('rounded-2xl border bg-white/85 p-5 shadow-sm dark:bg-slate-900/85', styles[color].split(' ').filter(className => className.includes('border')).join(' '))}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
                </div>
                <div className={cn('rounded-2xl p-3', styles[color])}>{icon}</div>
            </div>
        </div>
    )
}
