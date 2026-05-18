import React from 'react'
import { Link } from '@inertiajs/react'
import { Award, BarChart2, BookOpen, CheckCircle, Clock, Target, Trophy, Users } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn, formatTime } from '@/lib/utils'

interface Summary {
    totalQuizzes: number
    publishedQuizzes: number
    totalClasses: number
    totalStudents: number
    completedAttempts: number
    avgScore: number
    passRate: number
    avgTime: number
}

interface TrendItem {
    label: string
    attempts: number
    avg_score: number
}

interface QuizPerformance {
    id: number
    title: string
    category?: { name: string; icon?: string; color?: string } | null
    questions_count: number
    completed_attempts_count: number
    avg_score: number
    status: string
}

interface TopStudent {
    user: { name: string; avatar_url: string; level: number }
    attempts_count: number
    avg_score: number
    passed_count: number
    xp_earned: number
}

interface Props {
    summary: Summary
    dailyTrend: TrendItem[]
    quizPerformance: QuizPerformance[]
    topStudents: TopStudent[]
}

export default function Analytics({ summary, dailyTrend, quizPerformance, topStudents }: Props) {
    const maxAttempts = Math.max(...dailyTrend.map(item => item.attempts), 1)

    return (
        <AppLayout title="Analitik Kelas" subtitle="Pantau performa quiz dan murid">
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Analitik Kelas</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Ringkasan performa dari seluruh quiz yang sudah dikerjakan murid.
                        </p>
                    </div>
                    <Link href="/teacher/quizzes">
                        <Button variant="primary" icon={<BookOpen className="w-4 h-4" />}>Lihat Semua Quiz</Button>
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Metric icon={<BookOpen className="w-5 h-5" />} label="Total Quiz" value={summary.totalQuizzes} detail={`${summary.publishedQuizzes} published`} tone="violet" />
                    <Metric icon={<Users className="w-5 h-5" />} label="Murid" value={summary.totalStudents} detail={`${summary.totalClasses} kelas`} tone="blue" />
                    <Metric icon={<Target className="w-5 h-5" />} label="Percobaan" value={summary.completedAttempts} detail="selesai" tone="emerald" />
                    <Metric icon={<CheckCircle className="w-5 h-5" />} label="Pass Rate" value={`${summary.passRate}%`} detail={`rata-rata ${Math.round(summary.avgScore)}%`} tone="amber" />
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                    <section className="xl:col-span-2 bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-white">Tren 7 Hari</h2>
                                <p className="text-sm text-slate-500">Jumlah pengerjaan dan rata-rata skor harian</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Rata-rata waktu</p>
                                <p className="font-black text-slate-900 dark:text-white">{summary.avgTime > 0 ? formatTime(summary.avgTime) : '-'}</p>
                            </div>
                        </div>

                        <div className="h-72 flex items-end gap-3">
                            {dailyTrend.map(item => (
                                <div key={item.label} className="flex-1 h-full flex flex-col justify-end gap-2">
                                    <div className="flex-1 flex items-end">
                                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-violet-600 to-indigo-400 min-h-3 transition-all" style={{ height: `${Math.max(8, item.attempts / maxAttempts * 100)}%` }} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-700 dark:text-slate-300">{item.attempts}</p>
                                        <p className="text-[11px] text-slate-500">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h2 className="font-black text-slate-900 dark:text-white mb-4">Murid Teratas</h2>
                        {topStudents.length === 0 ? (
                            <Empty text="Belum ada murid yang menyelesaikan quiz." />
                        ) : (
                            <div className="space-y-3">
                                {topStudents.map((student, index) => (
                                    <div key={student.user.name} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
                                        <div className="w-8 text-center font-black text-violet-600 dark:text-violet-300">#{index + 1}</div>
                                        <img src={student.user.avatar_url} alt={student.user.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">{student.user.name}</p>
                                            <p className="text-xs text-slate-500">{student.attempts_count} percobaan · +{student.xp_earned} XP</p>
                                        </div>
                                        <span className="font-black text-emerald-600 dark:text-emerald-300">{Math.round(student.avg_score)}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <section className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-black text-slate-900 dark:text-white">Performa Quiz</h2>
                        <p className="text-sm text-slate-500">Quiz dengan jumlah pengerjaan terbanyak</p>
                    </div>
                    {quizPerformance.length === 0 ? (
                        <Empty text="Belum ada quiz untuk dianalisis." />
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {quizPerformance.map(quiz => (
                                <Link key={quiz.id} href={`/teacher/quizzes/${quiz.id}/results`} className="flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${quiz.category?.color ?? '#7c3aed'}20` }}>
                                        {quiz.category?.icon ?? <BarChart2 className="w-5 h-5 text-violet-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 dark:text-white truncate">{quiz.title}</p>
                                        <p className="text-xs text-slate-500">{quiz.category?.name ?? 'Tanpa kategori'} · {quiz.questions_count} soal · {quiz.status}</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:w-[360px]">
                                        <MiniStat label="Percobaan" value={quiz.completed_attempts_count} />
                                        <MiniStat label="Rata-rata" value={`${Math.round(quiz.avg_score)}%`} />
                                        <MiniStat label="Status" value={quiz.avg_score >= 75 ? 'Baik' : 'Perlu tinjau'} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="grid md:grid-cols-3 gap-4">
                    <Insight icon={<Trophy className="w-5 h-5" />} title="Quiz aktif" text={`${summary.publishedQuizzes} quiz sudah published dan siap dikerjakan.`} />
                    <Insight icon={<Clock className="w-5 h-5" />} title="Durasi rata-rata" text={summary.avgTime > 0 ? `Murid rata-rata menyelesaikan quiz dalam ${formatTime(summary.avgTime)}.` : 'Belum ada data durasi pengerjaan.'} />
                    <Insight icon={<Award className="w-5 h-5" />} title="Kondisi kelas" text={summary.passRate >= 75 ? 'Mayoritas murid sudah mencapai batas lulus.' : 'Beberapa quiz perlu ditinjau lagi dari hasil murid.'} />
                </section>
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

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-center">
            <p className="text-[11px] text-slate-500">{label}</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{value}</p>
        </div>
    )
}

function Insight({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3">{icon}</div>
            <h3 className="font-black text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-6">{text}</p>
        </div>
    )
}

function Empty({ text }: { text: string }) {
    return <div className="px-5 py-10 text-center text-slate-500">{text}</div>
}
