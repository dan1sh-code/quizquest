import React, { useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Home, RefreshCw, Printer } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import AiDiscussion from '@/Components/Shared/AiDiscussion'
import { getQuestionTypeLabel, cn } from '@/lib/utils'
import type { QuizAttempt } from '@/types'

interface Props {
    auth: { user: any }
    attempt: QuizAttempt
    rank: number
    totalParticipants: number
}

export default function QuizResult({ auth, attempt, rank, totalParticipants }: Props) {
    const passed = attempt.passed
    const pct = Math.round(attempt.percentage)

    useEffect(() => {
        if (passed) launchConfetti()
    }, [passed])

    function launchConfetti() {
        const colors = ['#7c3aed','#6366f1','#ec4899','#f59e0b','#10b981']
        for (let i = 0; i < 80; i++) {
            const el = document.createElement('div')
            const size = Math.random() * 10 + 4
            Object.assign(el.style, {
                position: 'fixed',
                top: '-10px',
                left: `${Math.random() * 100}vw`,
                width: `${size}px`,
                height: `${size}px`,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `confetti-fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s both`,
                zIndex: '9999',
                pointerEvents: 'none',
                opacity: String(Math.random()),
            })
            document.body.appendChild(el)
            setTimeout(() => el.remove(), 6000)
        }
    }

    return (
        <AppLayout title="Hasil Quiz">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Result Hero */}
                <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}
                    className={cn('relative rounded-3xl overflow-hidden', passed ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-red-600 to-rose-700')}>
                    <div className="absolute inset-0 opacity-10">
                        {Array.from({length:12}).map((_,i) => (
                            <div key={i} className="absolute rounded-full bg-white"
                                style={{ width:`${Math.random()*80+20}px`, height:`${Math.random()*80+20}px`, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity:Math.random()*0.4 }} />
                        ))}
                    </div>
                    <div className="relative z-10 p-10 text-center">
                        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.3, type:'spring', stiffness:200 }}
                            className="text-7xl mb-4">
                            {passed ? '🏆' : '😤'}
                        </motion.div>
                        <h1 className="text-4xl font-black text-white mb-2">{passed ? 'Luar Biasa!' : 'Jangan Menyerah!'}</h1>
                        <p className="text-white/80 text-lg mb-8">{attempt.quiz?.title}</p>

                        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.5, type:'spring' }}
                            className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-white/20 border-4 border-white/40 mb-8">
                            <div className="text-center">
                                <p className="text-5xl font-black text-white">{pct}</p>
                                <p className="text-white/80 text-sm font-semibold">%</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            {[
                                { label:'Benar',    value: attempt.correct_answers,  icon: '✅' },
                                { label:'Salah',    value: attempt.wrong_answers,    icon: '❌' },
                                { label:'XP Diraih',value: `+${attempt.xp_earned}`, icon: '⚡' },
                                { label:'Ranking',  value: `#${rank}/${totalParticipants}`, icon: '🏅' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
                                    <p className="text-2xl mb-1">{icon}</p>
                                    <p className="text-2xl font-black text-white">{value}</p>
                                    <p className="text-white/70 text-xs">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/student/dashboard" className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all">
                        <Home className="w-4 h-4" /> Dashboard
                    </Link>
                    {attempt.attempt_number < (attempt.quiz?.max_attempts ?? 1) && (
                        <Link href={`/student/quiz/${attempt.quiz_id}/start`} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                            <RefreshCw className="w-4 h-4" /> Coba Lagi
                        </Link>
                    )}
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                        <Printer className="w-4 h-4" /> Cetak Hasil
                    </button>
                </div>

                {/* Answer Review */}
                {attempt.quiz?.show_answer_after && attempt.answers && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">📝 Review Jawaban</h2>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {attempt.answers.map((answer, idx) => {
                                const q = answer.question!
                                const isPending = answer.grade_status === 'pending'
                                const isCorrect = answer.is_correct

                                return (
                                    <div key={answer.id} className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                                                isPending ? 'bg-amber-100 dark:bg-amber-900/20' : isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-red-100 dark:bg-red-900/20')}>
                                                {isPending ? '⏳' : isCorrect ? '✅' : '❌'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-slate-500 font-medium">Soal {idx+1}</span>
                                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{getQuestionTypeLabel(q.type)}</span>
                                                    <span className={cn('text-xs font-bold', isPending ? 'text-amber-600' : isCorrect ? 'text-emerald-600' : 'text-red-500')}>
                                                        {isPending ? '⏳ Menunggu' : isCorrect ? `+${answer.points_earned} poin` : '0 poin'}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{q.question_text}</p>
                                            </div>
                                        </div>

                                        {/* Options Review */}
                                        {(q.type === 'multiple_choice' || q.type === 'true_false') && q.options && (
                                            <div className="ml-14 space-y-2">
                                                {q.options.map((opt) => (
                                                    <div key={opt.id} className={cn('flex items-center gap-3 p-3 rounded-xl border-2',
                                                        opt.is_correct ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' :
                                                        answer.selected_option_id === opt.id ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
                                                        'border-slate-200 dark:border-slate-700')}>
                                                        <span>{opt.is_correct ? '✅' : answer.selected_option_id === opt.id ? '❌' : '○'}</span>
                                                        <span className={cn('text-sm', opt.is_correct ? 'font-semibold text-emerald-700 dark:text-emerald-300' : answer.selected_option_id === opt.id ? 'font-semibold text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300')}>
                                                            {opt.option_text}
                                                        </span>
                                                        {answer.selected_option_id === opt.id && !opt.is_correct && <span className="ml-auto text-xs text-red-500 font-medium">Jawabanmu</span>}
                                                        {opt.is_correct && <span className="ml-auto text-xs text-emerald-500 font-medium">Benar</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'essay' && (
                                            <div className="ml-14 space-y-3">
                                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                                    <p className="text-xs font-semibold text-slate-500 mb-2">Jawabanmu:</p>
                                                    <p className="text-slate-700 dark:text-slate-300 text-sm">{answer.essay_answer || '(Tidak dijawab)'}</p>
                                                </div>
                                                {answer.teacher_feedback && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                                        <p className="text-xs font-semibold text-blue-600 mb-2">💬 Feedback Guru:</p>
                                                        <p className="text-blue-700 dark:text-blue-300 text-sm">{answer.teacher_feedback}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {q.type === 'fill_blank' && (
                                            <div className="ml-14 grid grid-cols-2 gap-3">
                                                <div className={cn('rounded-xl p-4', isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800')}>
                                                    <p className="text-xs font-semibold text-slate-500 mb-1">Jawabanmu:</p>
                                                    <p className="font-bold text-slate-900 dark:text-white">{answer.fill_answer || '(Kosong)'}</p>
                                                </div>
                                                {!isCorrect && q.options && (
                                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                                                        <p className="text-xs font-semibold text-slate-500 mb-1">Jawaban Benar:</p>
                                                        <p className="font-bold text-emerald-700 dark:text-emerald-300">{q.options.find(o=>o.is_correct)?.option_text}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Explanation */}
                                        {q.explanation && (
                                            <div className="ml-14 mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 Pembahasan Guru:</p>
                                                <p className="text-amber-800 dark:text-amber-300 text-sm">{q.explanation}</p>
                                            </div>
                                        )}

                                        {/* AI Discussion */}
                                        {q.has_ai_discussion && (
                                            <div className="ml-14 mt-4">
                                                <AiDiscussion
                                                    question={q}
                                                    attemptId={attempt.id}
                                                    studentAnswer={answer.essay_answer ?? answer.fill_answer ?? answer.selected_option?.option_text ?? ''}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
