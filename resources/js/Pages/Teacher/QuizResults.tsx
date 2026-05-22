import React from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowLeft,
    Award,
    BarChart2,
    CheckCircle2,
    Download,
    Edit,
    Target,
    Trophy,
    Users,
    XCircle,
} from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn, formatTime } from '@/lib/utils'
import type { PaginatedData, Quiz, QuizAttempt } from '@/types'

interface ResultStats {
    completed: number
    inProgress: number
    passed: number
    failed: number
    highestScore: number
    lowestScore: number
    lowestRawScore: number
    maxScore: number
    totalXp: number
}

interface ScoreBuckets {
    excellent: number
    good: number
    review: number
    critical: number
}

interface Props {
    quiz: Quiz & {
        classroom?: { id: number; name: string; code: string } | null
    }
    attempts: PaginatedData<QuizAttempt>
    avgScore: number
    passRate: number
    stats?: Partial<ResultStats>
    scoreBuckets?: Partial<ScoreBuckets>
}

const bucketLabels = [
    { key: 'excellent', label: '85-100', tone: 'bg-emerald-500' },
    { key: 'good', label: '70-84', tone: 'bg-blue-500' },
    { key: 'review', label: '50-69', tone: 'bg-amber-500' },
    { key: 'critical', label: '< 50', tone: 'bg-rose-500' },
] as const

export default function QuizResults({ quiz, attempts, avgScore, passRate, stats = {}, scoreBuckets = {} }: Props) {
    const resultStats: ResultStats = {
        completed: stats.completed ?? attempts.total ?? attempts.data.length,
        inProgress: stats.inProgress ?? 0,
        passed: stats.passed ?? attempts.data.filter(attempt => attempt.passed).length,
        failed: stats.failed ?? attempts.data.filter(attempt => !attempt.passed).length,
        highestScore: stats.highestScore ?? Math.max(...attempts.data.map(attempt => attempt.percentage ?? 0), 0),
        lowestScore: stats.lowestScore ?? Math.min(...attempts.data.map(attempt => attempt.percentage ?? 0), 0),
        lowestRawScore: stats.lowestRawScore ?? Math.min(...attempts.data.map(attempt => attempt.score ?? 0), 0),
        maxScore: stats.maxScore ?? Math.max(...attempts.data.map(attempt => attempt.max_score ?? 0), 0),
        totalXp: stats.totalXp ?? attempts.data.reduce((sum, attempt) => sum + (attempt.xp_earned ?? 0), 0),
    }
    const buckets: ScoreBuckets = {
        excellent: scoreBuckets.excellent ?? attempts.data.filter(attempt => (attempt.percentage ?? 0) >= 85).length,
        good: scoreBuckets.good ?? attempts.data.filter(attempt => (attempt.percentage ?? 0) >= 70 && (attempt.percentage ?? 0) < 85).length,
        review: scoreBuckets.review ?? attempts.data.filter(attempt => (attempt.percentage ?? 0) >= 50 && (attempt.percentage ?? 0) < 70).length,
        critical: scoreBuckets.critical ?? attempts.data.filter(attempt => (attempt.percentage ?? 0) < 50).length,
    }
    const totalBucket = Math.max(resultStats.completed, 1)
    const exportUrl = buildCsvDataUrl(quiz, attempts.data)

    return (
        <AppLayout title="Hasil Quiz" subtitle={quiz.title}>
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                    <div className="min-w-0">
                        <Link href="/teacher/quizzes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300 mb-3">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Quiz Saya
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={cn('px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide', quiz.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>
                                {quiz.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                Kode {quiz.join_code}
                            </span>
                            {quiz.category && (
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {quiz.category.name}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white truncate">{quiz.title}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {quiz.classroom?.name ?? 'Semua murid'} - {quiz.questions_count ?? 0} soal - batas lulus {quiz.passing_score}%
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <a href={exportUrl} download={`hasil-${quiz.slug}.csv`}>
                            <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export Halaman Ini</Button>
                        </a>
                        <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                            <Button icon={<Edit className="w-4 h-4" />}>Edit Quiz</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Metric icon={<Users className="w-5 h-5" />} label="Selesai" value={resultStats.completed} detail={`${resultStats.inProgress} sedang mengerjakan`} tone="violet" />
                    <Metric icon={<Target className="w-5 h-5" />} label="Rata-rata Skor" value={`${avgScore}%`} detail={`tertinggi ${resultStats.highestScore}%`} tone="blue" />
                    <Metric icon={<CheckCircle2 className="w-5 h-5" />} label="Pass Rate" value={`${passRate}%`} detail={`${resultStats.passed} lulus, ${resultStats.failed} tidak lulus`} tone="emerald" />
                    <Metric icon={<XCircle className="w-5 h-5" />} label="Skor Terendah" value={`${resultStats.lowestRawScore} / ${resultStats.maxScore}`} detail={`${resultStats.lowestScore}% dari total`} tone="amber" />
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                    <section className="xl:col-span-2 bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-white">Daftar Hasil Murid</h2>
                                <p className="text-sm text-slate-500">Menampilkan {attempts.from ?? 0}-{attempts.to ?? 0} dari {attempts.total} percobaan selesai</p>
                            </div>
                            <InsightPill score={avgScore} passRate={passRate} />
                        </div>

                        {attempts.data.length === 0 ? (
                            <EmptyState quiz={quiz} />
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[760px] text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs font-black uppercase tracking-wide text-slate-500">
                                            <tr>
                                                <th className="px-5 py-3">Murid</th>
                                                <th className="px-5 py-3">Skor</th>
                                                <th className="px-5 py-3">Benar/Salah</th>
                                                <th className="px-5 py-3">Waktu</th>
                                                <th className="px-5 py-3">XP</th>
                                                <th className="px-5 py-3">Selesai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {attempts.data.map(attempt => (
                                                <tr key={attempt.id} className="hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={attempt.user?.avatar_url} alt={attempt.user?.name ?? 'Murid'} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                                                            <div className="min-w-0">
                                                                <p className="font-black text-slate-900 dark:text-white truncate">{attempt.user?.name ?? 'Murid'}</p>
                                                                <p className="text-xs text-slate-500">Attempt #{attempt.attempt_number} - Lv.{attempt.user?.level ?? 1}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <ScoreRing value={attempt.percentage ?? 0} />
                                                            <StatusBadge passed={attempt.passed} />
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                        <span className="font-black text-emerald-600 dark:text-emerald-300">{attempt.correct_answers ?? 0}</span>
                                                        <span className="text-slate-400"> / </span>
                                                        <span className="font-black text-rose-600 dark:text-rose-300">{attempt.wrong_answers ?? 0}</span>
                                                        {attempt.skipped_answers > 0 && <span className="text-xs text-slate-500"> - {attempt.skipped_answers} kosong</span>}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                        {attempt.time_taken ? formatTime(attempt.time_taken) : '-'}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm font-black text-violet-600 dark:text-violet-300">
                                                        +{attempt.xp_earned ?? 0}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-500">
                                                        {formatDate(attempt.completed_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination attempts={attempts} />
                            </>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <section className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <div>
                                    <h2 className="font-black text-slate-900 dark:text-white">Distribusi Skor</h2>
                                    <p className="text-sm text-slate-500">Sebaran performa murid</p>
                                </div>
                                <BarChart2 className="w-5 h-5 text-violet-500" />
                            </div>
                            <div className="space-y-4">
                                {bucketLabels.map(bucket => {
                                    const value = buckets[bucket.key]
                                    const width = Math.round(value / totalBucket * 100)
                                    return (
                                        <div key={bucket.key}>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="font-semibold text-slate-600 dark:text-slate-300">{bucket.label}</span>
                                                <span className="font-black text-slate-900 dark:text-white">{value}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                <div className={cn('h-full rounded-full', bucket.tone)} style={{ width: `${width}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                            <h2 className="font-black text-slate-900 dark:text-white mb-4">Catatan Cepat</h2>
                            <div className="space-y-3">
                                <QuickNote icon={<Trophy className="w-4 h-4" />} text={resultStats.completed > 0 ? `Skor tertinggi saat ini ${resultStats.highestScore}%.` : 'Belum ada attempt yang selesai.'} />
                                <QuickNote icon={<Award className="w-4 h-4" />} text={passRate >= 75 ? 'Mayoritas murid sudah melewati batas lulus.' : 'Pass rate masih rendah, coba cek soal yang sulit.'} />
                                <QuickNote icon={<Users className="w-4 h-4" />} text={`${resultStats.completed} attempt sudah selesai dari quiz ini.`} />
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </AppLayout>
    )
}

function Metric({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; detail: string; tone: 'violet' | 'blue' | 'emerald' | 'amber' }) {
    const tones = {
        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300',
    }

    return (
        <div className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center mb-4', tones[tone])}>{icon}</div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{detail}</p>
        </div>
    )
}

function ScoreRing({ value }: { value: number }) {
    const normalized = Math.max(0, Math.min(100, Math.round(value)))
    const color = normalized >= 85 ? '#10b981' : normalized >= 70 ? '#3b82f6' : normalized >= 50 ? '#f59e0b' : '#ef4444'

    return (
        <div className="relative w-12 h-12 rounded-full grid place-items-center" style={{ background: `conic-gradient(${color} ${normalized * 3.6}deg, #e2e8f0 0deg)` }}>
            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 grid place-items-center">
                <span className="text-xs font-black text-slate-900 dark:text-white">{normalized}%</span>
            </div>
        </div>
    )
}

function StatusBadge({ passed }: { passed: boolean }) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black', passed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300')}>
            {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {passed ? 'Lulus' : 'Belum'}
        </span>
    )
}

function InsightPill({ score, passRate }: { score: number; passRate: number }) {
    const good = score >= 75 && passRate >= 70
    return (
        <div className={cn('rounded-xl px-3 py-2 text-sm font-semibold', good ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300')}>
            {good ? 'Performa kelas stabil' : 'Perlu ditinjau'}
        </div>
    )
}

function Pagination({ attempts }: { attempts: PaginatedData<QuizAttempt> }) {
    if (attempts.last_page <= 1) return null

    const previous = attempts.links.find(link => link.label.includes('Previous') || link.label.includes('Sebelumnya'))
    const next = attempts.links.find(link => link.label.includes('Next') || link.label.includes('Berikutnya'))

    return (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Halaman {attempts.current_page} dari {attempts.last_page}</p>
            <div className="flex gap-2">
                <PageLink url={previous?.url} label="Sebelumnya" />
                <PageLink url={next?.url} label="Berikutnya" />
            </div>
        </div>
    )
}

function PageLink({ url, label }: { url?: string | null; label: string }) {
    if (!url) {
        return <span className="px-3 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">{label}</span>
    }

    return (
        <Link href={url} preserveScroll preserveState className="px-3 py-2 rounded-xl text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:text-violet-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:text-violet-300">
            {label}
        </Link>
    )
}

function QuickNote({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-300 flex items-center justify-center flex-shrink-0">{icon}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-6">{text}</p>
        </div>
    )
}

function EmptyState({ quiz }: { quiz: Quiz }) {
    return (
        <div className="px-5 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Belum ada hasil</h3>
            <p className="text-slate-500 mt-2 mb-5">Bagikan kode quiz agar murid bisa mulai mengerjakan.</p>
            <button
                type="button"
                onClick={() => {
                    navigator.clipboard.writeText(quiz.join_code)
                    alert(`Kode quiz disalin: ${quiz.join_code}`)
                }}
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700"
            >
                Salin kode {quiz.join_code}
            </button>
        </div>
    )
}

function formatDate(value?: string | null) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}

function buildCsvDataUrl(quiz: Quiz, rows: QuizAttempt[]) {
    const header = ['Quiz', 'Nama', 'Skor', 'Lulus', 'Benar', 'Salah', 'Kosong', 'Waktu', 'XP', 'Selesai']
    const body = rows.map(row => [
        quiz.title,
        row.user?.name ?? '',
        `${row.percentage ?? 0}%`,
        row.passed ? 'Ya' : 'Tidak',
        row.correct_answers ?? 0,
        row.wrong_answers ?? 0,
        row.skipped_answers ?? 0,
        row.time_taken ? formatTime(row.time_taken) : '',
        row.xp_earned ?? 0,
        formatDate(row.completed_at),
    ])
    const csv = [header, ...body].map(columns => columns.map(escapeCsv).join(',')).join('\n')
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
}

function escapeCsv(value: React.ReactNode) {
    const text = String(value ?? '')
    return `"${text.replace(/"/g, '""')}"`
}
