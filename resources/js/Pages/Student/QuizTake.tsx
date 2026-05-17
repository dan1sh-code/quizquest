import React, { useState, useEffect } from 'react'
import { useForm, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Send, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function QuizTake({ attempt, quiz, questions }: any) {
    const { data, setData, post, processing } = useForm({
        answers: {} as Record<number, any>,
        time_taken: 0,
    })

    const [timeLeft, setTimeLeft] = useState(quiz.time_limit ? quiz.time_limit * 60 : null)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            submitQuiz()
            return
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev! - 1)
            setData('time_taken', data.time_taken + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const submitQuiz = () => {
        post(`/student/attempt/${attempt.id}/submit`)
    }

    const handleAnswer = (questionId: number, value: any) => {
        setData('answers', { ...data.answers, [questionId]: value })
    }

    const currentQuestion = questions[currentIndex]
    const answeredCount = Object.keys(data.answers).length
    const isLast = currentIndex === questions.length - 1

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <AppLayout title={quiz.title}>
            <div className="max-w-6xl mx-auto py-8">
                {/* Header Timer */}
                <div className="sticky top-[80px] z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 mb-8 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                            <span className="font-black text-xl">{currentIndex + 1}</span>
                            <span className="text-xs">/{questions.length}</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white line-clamp-1">{quiz.title}</h2>
                            <p className="text-xs text-slate-500 font-semibold">{answeredCount} dari {questions.length} Terjawab</p>
                        </div>
                    </div>
                    {timeLeft !== null && (
                        <div className={cn('flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono text-lg font-bold', timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700')}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Soal {currentIndex + 1}
                                    </span>
                                    <span className="text-violet-600 font-bold text-sm bg-violet-50 dark:bg-violet-900/20 px-3 py-1 rounded-full">
                                        {currentQuestion.points} Poin
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed">
                                    {currentQuestion.question_text}
                                </h3>

                                <div className="space-y-4">
                                    {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && currentQuestion.options.map((opt: any) => {
                                        const isSelected = data.answers[currentQuestion.id] === opt.id
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                                                className={cn('w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group', isSelected ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300')}
                                            >
                                                <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', isSelected ? 'border-violet-600 bg-violet-600' : 'border-slate-300 group-hover:border-violet-400')}>
                                                    {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className={cn('text-lg font-medium', isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-slate-700 dark:text-slate-300')}>
                                                    {opt.option_text}
                                                </span>
                                            </button>
                                        )
                                    })}

                                    {currentQuestion.type === 'fill_blank' && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.answers[currentQuestion.id] || ''}
                                                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                                placeholder="Ketik jawabanmu di sini..."
                                                className="w-full text-xl p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all outline-none text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    )}

                                    {currentQuestion.type === 'essay' && (
                                        <div>
                                            <textarea
                                                value={data.answers[currentQuestion.id] || ''}
                                                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                                placeholder="Uraikan jawabanmu secara detail..."
                                                rows={6}
                                                className="w-full p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all outline-none text-slate-900 dark:text-white resize-y"
                                            />
                                            <p className="text-right mt-2 text-xs text-slate-400">{(data.answers[currentQuestion.id] || '').length} karakter</p>
                                        </div>
                                    )}

                                    {currentQuestion.type === 'matching' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {currentQuestion.matching_pairs?.map((pair: any) => (
                                                <div key={pair.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                    <div className="flex-1 font-semibold text-slate-800 dark:text-slate-200">{pair.left_item}</div>
                                                    <div className="text-slate-400 hidden md:block">→</div>
                                                    <div className="flex-1">
                                                        <select
                                                            value={data.answers[currentQuestion.id]?.[pair.id] || ''}
                                                            onChange={(e) => {
                                                                const currentAns = data.answers[currentQuestion.id] || {}
                                                                handleAnswer(currentQuestion.id, { ...currentAns, [pair.id]: e.target.value })
                                                            }}
                                                            className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-500 outline-none"
                                                        >
                                                            <option value="" disabled>Pilih Pasangan...</option>
                                                            {currentQuestion.matching_pairs.map((p: any) => (
                                                                <option key={p.id} value={p.right_item}>{p.right_item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                                disabled={currentIndex === 0}
                                className="rounded-2xl px-6"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" /> Sebelumnya
                            </Button>

                            {!isLast ? (
                                <Button 
                                    type="button" 
                                    onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
                                    className="rounded-2xl px-6"
                                >
                                    Selanjutnya <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            ) : (
                                <Button 
                                    type="button" 
                                    onClick={submitQuiz}
                                    loading={processing}
                                    className="rounded-2xl px-8 shadow-xl shadow-violet-500/30"
                                >
                                    <Send className="w-4 h-4 mr-2" /> Kumpulkan Quiz
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Navigator */}
                    <div className="hidden lg:block">
                        <div className="sticky top-[180px] bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Navigasi Soal</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {questions.map((q: any, i: number) => {
                                    const isAnswered = !!data.answers[q.id]
                                    const isCurrent = i === currentIndex
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentIndex(i)}
                                            className={cn('w-full aspect-square rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center', 
                                                isCurrent ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' :
                                                isAnswered ? 'border-transparent bg-violet-600 text-white shadow-md shadow-violet-500/20' : 
                                                'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600')}
                                        >
                                            {i + 1}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Button 
                                    onClick={submitQuiz} 
                                    loading={processing} 
                                    className="w-full rounded-2xl" 
                                    variant={answeredCount === questions.length ? 'primary' : 'danger'}
                                >
                                    <Send className="w-4 h-4 mr-2" /> Akhiri Quiz
                                </Button>
                                {answeredCount < questions.length && (
                                    <p className="text-center text-xs text-red-500 font-medium mt-3">
                                        Ada {questions.length - answeredCount} soal belum dijawab!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
