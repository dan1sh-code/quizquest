import React, { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import { CheckCircle, AlertCircle, Edit3, X } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function Grading({ pendingAnswers }: any) {
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
    const { data, setData, post, processing, reset } = useForm({
        points: 0,
        feedback: ''
    })

    const handleSelect = (answer: any) => {
        setSelectedAnswer(answer)
        setData({ points: answer.question.points, feedback: '' })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(`/teacher/grading/${selectedAnswer.id}`, {
            onSuccess: () => {
                setSelectedAnswer(null)
                reset()
            }
        })
    }

    return (
        <AppLayout title="Penilaian Essay" subtitle="Berikan nilai untuk jawaban essay murid">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* List of pending essays */}
                <div className="lg:col-span-2 space-y-4">
                    {pendingAnswers.data.length === 0 ? (
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Semua Sudah Dinilai!</h3>
                            <p className="text-slate-500">Tidak ada jawaban essay yang menunggu penilaian saat ini.</p>
                        </div>
                    ) : (
                        pendingAnswers.data.map((answer: any) => (
                            <div 
                                key={answer.id} 
                                onClick={() => handleSelect(answer)}
                                className={cn('bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all cursor-pointer shadow-sm group hover:shadow-md', selectedAnswer?.id === answer.id ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-violet-300')}
                            >
                                <div className="flex items-start gap-4">
                                    <img src={answer.avatar_url} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{answer.user.name}</h4>
                                            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Pending
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1 line-clamp-1">{answer.question.question_text}</p>
                                        <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl line-clamp-2">{answer.essay_answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Grading Panel */}
                <div className="lg:sticky lg:top-24">
                    <AnimatePresence mode="wait">
                        {selectedAnswer ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Edit3 className="w-5 h-5 text-violet-500" /> Beri Nilai</h3>
                                    <button onClick={() => setSelectedAnswer(null)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">Pertanyaan ({selectedAnswer.question.points} Poin Maks)</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4 bg-violet-50 dark:bg-violet-900/20 p-3 rounded-xl border border-violet-100 dark:border-violet-800/30">{selectedAnswer.question.question_text}</p>
                                    
                                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">Jawaban Murid</p>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap mb-6">
                                        {selectedAnswer.essay_answer}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nilai (0 - {selectedAnswer.question.points})</label>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max={selectedAnswer.question.points}
                                            value={data.points}
                                            onChange={e => setData('points', Number(e.target.value))}
                                            className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Feedback (Opsional)</label>
                                        <textarea 
                                            rows={3}
                                            value={data.feedback}
                                            onChange={e => setData('feedback', e.target.value)}
                                            placeholder="Berikan masukan untuk murid..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none resize-none"
                                        />
                                    </div>
                                    <Button type="submit" loading={processing} className="w-full rounded-xl">
                                        Simpan Nilai
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Edit3 className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium">Pilih jawaban di samping untuk mulai menilai.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    )
}
