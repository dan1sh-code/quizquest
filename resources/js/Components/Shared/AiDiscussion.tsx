import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react'
import axios from 'axios'
import type { AiMessage, Question } from '@/types'

interface AiDiscussionProps {
    question: Question
    attemptId: number
    studentAnswer?: string
}

export default function AiDiscussion({ question, attemptId, studentAnswer }: AiDiscussionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<AiMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [discussionId, setDiscussionId] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => { scrollToBottom() }, [messages])

    const openDiscussion = async () => {
        setIsOpen(true)
        if (messages.length > 0) return
        setLoading(true)
        try {
            const { data } = await axios.post('/api/internal/ai/discuss', {
                question_id: question.id,
                attempt_id:  attemptId,
                student_answer: studentAnswer ?? '',
            })
            if (data.success) {
                setDiscussionId(data.discussion_id)
                setMessages([{ role: 'assistant', content: data.content }])
            } else {
                setMessages([{ role: 'assistant', content: data.content }])
            }
        } catch {
            setMessages([{ role: 'assistant', content: '❌ AI tidak dapat terhubung saat ini. Pastikan API Key Groq sudah dikonfigurasi.' }])
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)
        try {
            const { data } = await axios.post('/api/internal/ai/continue', {
                discussion_id: discussionId,
                message: userMsg,
            })
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Terjadi kesalahan. Coba lagi.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {!isOpen ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openDiscussion}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                    <Bot className="w-4 h-4" />
                    <span>Tanya AI Tutor</span>
                    <Sparkles className="w-4 h-4 opacity-70" />
                </motion.button>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        className="border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white text-sm">AI Tutor QuizQuest</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <p className="text-white/70 text-xs">OpenRouter AI · Aktif</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-72 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gradient-to-br from-violet-500 to-indigo-600'}`}>
                                            {msg.role === 'user' ? '👤' : <Bot className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                                        }`}>
                                            {msg.content.split('\n').map((line, j) => (
                                                <span key={j}>{line}<br /></span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-1.5">
                                            {[0,150,300].map(d => (
                                                <span key={d} className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Tanya lebih lanjut..."
                                    disabled={loading}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500 transition-all disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-center">AI dapat membuat kesalahan. Selalu verifikasi informasi penting.</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
