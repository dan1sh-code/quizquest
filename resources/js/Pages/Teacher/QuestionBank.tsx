import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    Copy,
    Edit,
    Eye,
    FileQuestion,
    FolderOpen,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'
import { cn, getQuestionTypeLabel } from '@/lib/utils'
import '../../../css/questionBank.css'

type QuestionType = 'multiple_choice' | 'true_false' | 'essay' | 'fill_blank' | 'matching'
type Difficulty = 'easy' | 'medium' | 'hard'

interface CategoryOption {
    id: number
    name: string
    slug: string
    icon?: string | null
    color?: string | null
}

interface QuizOption {
    id: number
    category_id: number | null
    categoryName?: string | null
    title: string
    status: string
    difficulty: string
    time_limit?: number | null
    questions_count?: number
}

interface QuestionOptionForm {
    text: string
    is_correct: boolean
}

interface MatchingPairForm {
    left: string
    right: string
}

interface Question {
    id: number
    quiz_id: number
    category_id?: number | null
    quizTitle?: string
    text: string
    type: QuestionType
    points: number
    difficulty: Difficulty
    explanation?: string | null
    options?: QuestionOptionForm[]
    pairs?: MatchingPairForm[]
    fill_answer?: string
    usageCount?: number
    lastUsed?: string | null
}

interface QuestionForm {
    id?: number
    quiz_id: number | ''
    text: string
    type: QuestionType
    points: number
    difficulty: Difficulty
    explanation: string
    options: QuestionOptionForm[]
    pairs: MatchingPairForm[]
    fill_answer: string
}

interface Props {
    categories?: CategoryOption[]
    questions?: Question[]
    quizzes?: QuizOption[]
}

const defaultForm = (quizId: number | '' = ''): QuestionForm => ({
    quiz_id: quizId,
    text: '',
    type: 'multiple_choice',
    points: 10,
    difficulty: 'medium',
    explanation: '',
    options: [
        { text: '', is_correct: true },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
    ],
    pairs: [
        { left: '', right: '' },
        { left: '', right: '' },
    ],
    fill_answer: '',
})

const csrfHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
})

const difficultyLabel: Record<Difficulty, string> = {
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Sulit',
}

export default function QuestionBank({
    categories = [],
    questions: initialQuestions = [],
    quizzes: initialQuizzes = [],
}: Props) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions)
    const [quizzes, setQuizzes] = useState<QuizOption[]>(initialQuizzes)
    const [form, setForm] = useState<QuestionForm>(() => defaultForm(quizzes[0]?.id ?? ''))
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null)
    const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState<Question | null>(null)
    const [confirmDeleteQuiz, setConfirmDeleteQuiz] = useState<QuizOption | null>(null)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null)

    const selectedCategory = categories.find(category => category.id === selectedCategoryId) ?? null
    const selectedQuiz = quizzes.find(quiz => quiz.id === selectedQuizId) ?? null

    const categoryStats = useMemo(() => {
        return categories.map(category => {
            const categoryQuizzes = quizzes.filter(quiz => quiz.category_id === category.id)
            const categoryQuizIds = categoryQuizzes.map(quiz => quiz.id)
            const categoryQuestions = questions.filter(question => categoryQuizIds.includes(question.quiz_id))

            return {
                ...category,
                quizCount: categoryQuizzes.length,
                questionCount: categoryQuestions.length,
                note: categoryQuestions.length > 0
                    ? 'Siap digunakan untuk latihan'
                    : categoryQuizzes.length > 0
                        ? 'Quiz tersedia, belum ada soal'
                        : 'Belum ada quiz di kategori ini',
            }
        })
    }, [categories, questions, quizzes])

    const filteredCategories = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return categoryStats

        return categoryStats.filter(category => {
            const categoryQuizzes = quizzes.filter(quiz => quiz.category_id === category.id)
            return category.name.toLowerCase().includes(term) ||
                categoryQuizzes.some(quiz => quiz.title.toLowerCase().includes(term)) ||
                questions.some(question => categoryQuizzes.some(quiz => quiz.id === question.quiz_id) && question.text.toLowerCase().includes(term))
        })
    }, [categoryStats, questions, quizzes, searchTerm])

    const quizzesInSelectedCategory = useMemo(() => {
        if (!selectedCategoryId) return []
        return quizzes
            .filter(quiz => quiz.category_id === selectedCategoryId)
            .filter(quiz => {
                const term = searchTerm.trim().toLowerCase()
                if (!term) return true
                return quiz.title.toLowerCase().includes(term) ||
                    questions.some(question => question.quiz_id === quiz.id && question.text.toLowerCase().includes(term))
            })
    }, [questions, quizzes, searchTerm, selectedCategoryId])

    const questionsInSelectedQuiz = useMemo(() => {
        if (!selectedQuizId) return []
        const term = searchTerm.trim().toLowerCase()
        return questions
            .filter(question => question.quiz_id === selectedQuizId)
            .filter(question => !term || question.text.toLowerCase().includes(term) || (question.explanation ?? '').toLowerCase().includes(term))
            .sort((a, b) => a.id - b.id)
    }, [questions, searchTerm, selectedQuizId])

    const getQuizQuestionCount = (quizId: number) => questions.filter(question => question.quiz_id === quizId).length

    const openAddModal = () => {
        const defaultQuizId = selectedQuizId
            ?? quizzesInSelectedCategory[0]?.id
            ?? quizzes[0]?.id
            ?? ''

        setForm(defaultForm(defaultQuizId))
        setEditingQuestionId(null)
        setShowModal(true)
    }

    const openEditModal = (question: Question) => {
        setForm({
            id: question.id,
            quiz_id: question.quiz_id,
            text: question.text,
            type: question.type,
            points: question.points,
            difficulty: question.difficulty,
            explanation: question.explanation ?? '',
            options: question.options?.length ? question.options : defaultForm().options,
            pairs: question.pairs?.length ? question.pairs : defaultForm().pairs,
            fill_answer: question.fill_answer ?? '',
        })
        setEditingQuestionId(question.id)
        setShowModal(true)
    }

    const updateType = (type: QuestionType) => {
        const next = { ...form, type }
        if (type === 'true_false') {
            next.options = [
                { text: 'Benar', is_correct: true },
                { text: 'Salah', is_correct: false },
            ]
        }
        setForm(next)
    }

    const saveQuestion = async () => {
        if (!form.quiz_id) {
            toast.error('Pilih quiz untuk menyimpan soal.')
            return
        }
        if (!form.text.trim()) {
            toast.error('Teks soal wajib diisi.')
            return
        }

        setSaving(true)
        try {
            const response = await fetch(editingQuestionId ? `/teacher/question-bank/${editingQuestionId}` : '/teacher/question-bank', {
                method: editingQuestionId ? 'PUT' : 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify(form),
            })

            if (!response.ok) throw new Error('Gagal menyimpan soal')

            const saved = await response.json()
            setQuestions(prev => editingQuestionId ? prev.map(item => item.id === saved.id ? saved : item) : [saved, ...prev])
            setSelectedQuizId(saved.quiz_id)
            setSelectedCategoryId(saved.category_id ?? quizzes.find(quiz => quiz.id === saved.quiz_id)?.category_id ?? null)
            setShowModal(false)
            toast.success('Soal berhasil disimpan.')
        } catch {
            toast.error('Soal belum berhasil disimpan. Cek kembali isian form.')
        } finally {
            setSaving(false)
        }
    }

    const duplicateQuestion = async (id: number) => {
        try {
            const response = await fetch(`/teacher/question-bank/${id}/copy`, {
                method: 'POST',
                headers: csrfHeaders(),
            })
            if (!response.ok) throw new Error('Gagal menyalin soal')
            const copy = await response.json()
            setQuestions(prev => [copy, ...prev])
            toast.success('Soal berhasil disalin.')
        } catch {
            toast.error('Soal belum berhasil disalin.')
        }
    }

    const deleteQuestion = async (id: number) => {
        try {
            const response = await fetch(`/teacher/question-bank/${id}`, {
                method: 'DELETE',
                headers: csrfHeaders(),
            })
            if (!response.ok) throw new Error('Gagal menghapus soal')
            setQuestions(prev => prev.filter(question => question.id !== id))
            setConfirmDeleteQuestion(null)
            toast.success('Soal dihapus.')
        } catch {
            toast.error('Soal belum berhasil dihapus.')
        }
    }

    const deleteQuiz = async (quiz: QuizOption) => {
        try {
            const response = await fetch(`/teacher/question-bank/quizzes/${quiz.id}`, {
                method: 'DELETE',
                headers: csrfHeaders(),
            })

            if (!response.ok) {
                const message = await response.text()
                throw new Error(message || 'Gagal menghapus quiz')
            }

            setQuizzes(prev => prev.filter(item => item.id !== quiz.id))
            setQuestions(prev => prev.filter(question => question.quiz_id !== quiz.id))
            if (selectedQuizId === quiz.id) setSelectedQuizId(null)
            setConfirmDeleteQuiz(null)
            toast.success('Quiz berhasil dihapus.')
        } catch {
            toast.error('Quiz belum berhasil dihapus.')
        }
    }

    const updateOption = (index: number, patch: Partial<QuestionOptionForm>) => {
        setForm(prev => ({
            ...prev,
            options: prev.options.map((option, optionIndex) => optionIndex === index ? { ...option, ...patch } : option),
        }))
    }

    const markCorrectOption = (index: number) => {
        setForm(prev => ({
            ...prev,
            options: prev.options.map((option, optionIndex) => ({ ...option, is_correct: optionIndex === index })),
        }))
    }

    const updatePair = (index: number, patch: Partial<MatchingPairForm>) => {
        setForm(prev => ({
            ...prev,
            pairs: prev.pairs.map((pair, pairIndex) => pairIndex === index ? { ...pair, ...patch } : pair),
        }))
    }

    const resetToCategories = () => {
        setSelectedCategoryId(null)
        setSelectedQuizId(null)
    }

    const backToQuizzes = () => {
        setSelectedQuizId(null)
    }

    return (
        <AppLayout title="Bank Soal" subtitle={`${questions.length} soal tersimpan`}>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Bank Soal</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Pilih kategori, buka quiz, lalu lihat preview soal yang tersimpan.
                        </p>
                    </div>
                    <Button variant="primary" onClick={openAddModal} icon={<Plus className="w-4 h-4" />} disabled={quizzes.length === 0}>
                        Buat Soal
                    </Button>
                </div>

                <div className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        <label className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={searchTerm}
                                onChange={event => setSearchTerm(event.target.value)}
                                placeholder="Cari kategori, quiz, atau teks soal..."
                                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </label>
                        {(selectedCategory || selectedQuiz) && (
                            <div className="flex gap-2">
                                {selectedQuiz && (
                                    <Button variant="secondary" onClick={backToQuizzes} icon={<ArrowLeft className="w-4 h-4" />}>
                                        Daftar Quiz
                                    </Button>
                                )}
                                <Button variant="ghost" onClick={resetToCategories} icon={<FolderOpen className="w-4 h-4" />}>
                                    Semua Kategori
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {!selectedCategory && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Kategori Pelajaran</h2>
                            <p className="text-sm text-slate-500">{filteredCategories.length} kategori</p>
                        </div>

                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className="group text-left bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 dark:border-slate-700"
                                                style={{ backgroundColor: `${category.color ?? '#7c3aed'}18` }}
                                            >
                                                {category.icon || <FolderOpen className="w-6 h-6 text-violet-600" />}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs text-slate-500">{category.quizCount} quiz</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            'text-xs font-black px-2.5 py-1 rounded-full',
                                            category.questionCount > 0
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                        )}>
                                            {category.questionCount > 0 ? `${category.questionCount} soal` : 'Belum ada soal'}
                                        </span>
                                    </div>
                                    <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <p className={cn(
                                            'text-sm font-semibold',
                                            category.questionCount > 0
                                                ? 'text-emerald-600 dark:text-emerald-300'
                                                : 'text-slate-400 dark:text-slate-500'
                                        )}>
                                            {category.note}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {selectedCategory && !selectedQuiz && (
                    <section className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <button onClick={resetToCategories} className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 mb-2">
                                    <ArrowLeft className="w-4 h-4" /> Kembali ke kategori
                                </button>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedCategory.name}</h2>
                                <p className="text-sm text-slate-500">Pilih quiz untuk melihat preview soal.</p>
                            </div>
                        </div>

                        {quizzesInSelectedCategory.length === 0 ? (
                            <PremiumPlaceholder
                                title="Belum Ada Quiz"
                                description={`Kategori ${selectedCategory.name} belum punya quiz. Buat quiz terlebih dahulu untuk menambahkan soal.`}
                            />
                        ) : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {quizzesInSelectedCategory.map(quiz => {
                                    const questionCount = getQuizQuestionCount(quiz.id)
                                    return (
                                        <div
                                            key={quiz.id}
                                            onClick={() => setSelectedQuizId(quiz.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={event => {
                                                if (event.key === 'Enter' || event.key === ' ') setSelectedQuizId(quiz.id)
                                            }}
                                            className="group cursor-pointer text-left bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 flex items-center justify-center">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        'text-xs font-black px-2.5 py-1 rounded-full capitalize',
                                                        quiz.status === 'published'
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                    )}>
                                                        {quiz.status}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        title="Hapus quiz"
                                                        className="qb-icon-button !text-red-600"
                                                        onClick={event => {
                                                            event.stopPropagation()
                                                            setConfirmDeleteQuiz(quiz)
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="mt-4 font-black text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                {quiz.title}
                                            </h3>
                                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                                <Metric label="Soal" value={questionCount} />
                                                <Metric label="Menit" value={quiz.time_limit ?? '-'} />
                                                <Metric label="Level" value={quiz.difficulty} />
                                            </div>
                                            {questionCount === 0 && (
                                                <p className="mt-4 text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
                                                    Belum ada soal di quiz ini.
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                )}

                {selectedQuiz && (
                    <section className="space-y-4">
                        <div>
                            <button onClick={backToQuizzes} className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 mb-2">
                                <ArrowLeft className="w-4 h-4" /> Kembali ke quiz {selectedCategory?.name}
                            </button>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedQuiz.title}</h2>
                            <p className="text-sm text-slate-500">{questionsInSelectedQuiz.length} soal dalam quiz ini.</p>
                        </div>

                        {questionsInSelectedQuiz.length === 0 ? (
                            <PremiumPlaceholder
                                title="Belum Ada Soal"
                                description="Quiz ini belum punya soal. Tambahkan soal agar bisa muncul di bank soal."
                            />
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-4">
                                {questionsInSelectedQuiz.map((question, index) => (
                                    <QuestionPreviewCard
                                        key={question.id}
                                        number={index + 1}
                                        question={question}
                                        onPreview={() => setPreviewQuestion(question)}
                                        onEdit={() => openEditModal(question)}
                                        onCopy={() => duplicateQuestion(question.id)}
                                        onDelete={() => setConfirmDeleteQuestion(question)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <AnimatePresence>
                    {showModal && (
                        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                            <motion.div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl" initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}>
                                <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{editingQuestionId ? 'Edit Soal' : 'Buat Soal'}</h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field label="Quiz">
                                            <select value={form.quiz_id} onChange={event => setForm({ ...form, quiz_id: Number(event.target.value) })} className="qb-input">
                                                {quizzes.map(quiz => (
                                                    <option key={quiz.id} value={quiz.id}>
                                                        {quiz.categoryName ? `${quiz.categoryName} - ` : ''}{quiz.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Tipe Soal">
                                            <select value={form.type} onChange={event => updateType(event.target.value as QuestionType)} className="qb-input">
                                                <option value="multiple_choice">Pilihan Ganda</option>
                                                <option value="true_false">Benar/Salah</option>
                                                <option value="essay">Essay</option>
                                                <option value="fill_blank">Isian Singkat</option>
                                                <option value="matching">Menjodohkan</option>
                                            </select>
                                        </Field>
                                    </div>

                                    <Field label="Teks Soal">
                                        <textarea value={form.text} onChange={event => setForm({ ...form, text: event.target.value })} rows={4} className="qb-input resize-none" />
                                    </Field>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Field label="Poin">
                                            <input type="number" min={1} value={form.points} onChange={event => setForm({ ...form, points: Number(event.target.value) })} className="qb-input" />
                                        </Field>
                                        <Field label="Kesulitan">
                                            <select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value as Difficulty })} className="qb-input">
                                                <option value="easy">Mudah</option>
                                                <option value="medium">Sedang</option>
                                                <option value="hard">Sulit</option>
                                            </select>
                                        </Field>
                                    </div>

                                    {(form.type === 'multiple_choice' || form.type === 'true_false') && (
                                        <div className="space-y-3">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Pilihan Jawaban</p>
                                            {form.options.map((option, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input type="radio" checked={option.is_correct} onChange={() => markCorrectOption(index)} className="mt-3" />
                                                    <input
                                                        value={option.text}
                                                        disabled={form.type === 'true_false'}
                                                        onChange={event => updateOption(index, { text: event.target.value })}
                                                        placeholder={`Pilihan ${index + 1}`}
                                                        className="qb-input"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {form.type === 'fill_blank' && (
                                        <Field label="Jawaban Benar">
                                            <input value={form.fill_answer} onChange={event => setForm({ ...form, fill_answer: event.target.value })} className="qb-input" />
                                        </Field>
                                    )}

                                    {form.type === 'matching' && (
                                        <div className="space-y-3">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Pasangan Jawaban</p>
                                            {form.pairs.map((pair, index) => (
                                                <div key={index} className="grid md:grid-cols-2 gap-2">
                                                    <input value={pair.left} onChange={event => updatePair(index, { left: event.target.value })} placeholder="Item kiri" className="qb-input" />
                                                    <input value={pair.right} onChange={event => updatePair(index, { right: event.target.value })} placeholder="Item kanan" className="qb-input" />
                                                </div>
                                            ))}
                                            <Button variant="secondary" size="sm" onClick={() => setForm(prev => ({ ...prev, pairs: [...prev.pairs, { left: '', right: '' }] }))}>
                                                Tambah Pasangan
                                            </Button>
                                        </div>
                                    )}

                                    <Field label="Pembahasan">
                                        <textarea value={form.explanation} onChange={event => setForm({ ...form, explanation: event.target.value })} rows={3} className="qb-input resize-none" />
                                    </Field>
                                </div>

                                <div className="sticky bottom-0 bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                                    <Button variant="primary" loading={saving} onClick={saveQuestion}>Simpan</Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {previewQuestion && (
                        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setPreviewQuestion(null)} />
                            <motion.div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6" initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}>
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500">{previewQuestion.quizTitle}</p>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{getQuestionTypeLabel(previewQuestion.type)}</h3>
                                    </div>
                                    <button onClick={() => setPreviewQuestion(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
                                </div>
                                <QuestionBody question={previewQuestion} expanded />
                            </motion.div>
                        </motion.div>
                    )}

                    {confirmDeleteQuiz && (
                        <ConfirmDeleteDialog
                            title="Hapus Quiz?"
                            description={
                                getQuizQuestionCount(confirmDeleteQuiz.id) > 0
                                    ? `Quiz "${confirmDeleteQuiz.title}" beserta ${getQuizQuestionCount(confirmDeleteQuiz.id)} soal di dalamnya akan dihapus permanen.`
                                    : `Quiz "${confirmDeleteQuiz.title}" akan dihapus permanen.`
                            }
                            confirmLabel="Hapus Quiz"
                            onCancel={() => setConfirmDeleteQuiz(null)}
                            onConfirm={() => deleteQuiz(confirmDeleteQuiz)}
                        />
                    )}

                    {confirmDeleteQuestion && (
                        <ConfirmDeleteDialog
                            title="Hapus Soal?"
                            description="Soal ini akan dihapus dari quiz dan bank soal."
                            confirmLabel="Hapus Soal"
                            onCancel={() => setConfirmDeleteQuestion(null)}
                            onConfirm={() => deleteQuestion(confirmDeleteQuestion.id)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    )
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-2">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{value}</p>
        </div>
    )
}

function QuestionPreviewCard({
    number,
    question,
    onPreview,
    onEdit,
    onCopy,
    onDelete,
}: {
    number: number
    question: Question
    onPreview: () => void
    onEdit: () => void
    onCopy: () => void
    onDelete: () => void
}) {
    return (
        <article className="bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 flex items-center justify-center font-black">
                        {number}
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">{getQuestionTypeLabel(question.type)}</p>
                        <h3 className="font-black text-slate-900 dark:text-white line-clamp-2">{question.text}</h3>
                    </div>
                </div>
                <span className={cn('qb-difficulty', question.difficulty)}>{difficultyLabel[question.difficulty]}</span>
            </div>

            <QuestionBody question={question} />

            <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileQuestion className="w-4 h-4" />
                    <span>{question.points} poin</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="qb-icon-button" title="Preview" onClick={onPreview}><Eye className="w-4 h-4" /></button>
                    <button className="qb-icon-button" title="Edit" onClick={onEdit}><Edit className="w-4 h-4" /></button>
                    <button className="qb-icon-button" title="Salin" onClick={onCopy}><Copy className="w-4 h-4" /></button>
                    <button className="qb-icon-button !text-red-600" title="Hapus" onClick={onDelete}><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
        </article>
    )
}

function QuestionBody({ question, expanded = false }: { question: Question; expanded?: boolean }) {
    const options = question.options ?? []
    const pairs = question.pairs ?? []

    return (
        <div className="mt-4 space-y-3">
            {expanded && <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{question.text}</p>}

            {options.length > 0 && (
                <div className="space-y-2">
                    {options.slice(0, expanded ? options.length : 4).map((option, index) => (
                        <div key={index} className={cn(
                            'rounded-xl border px-3 py-2 text-sm',
                            option.is_correct
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'
                                : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                        )}>
                            {option.text}
                        </div>
                    ))}
                </div>
            )}

            {pairs.length > 0 && (
                <div className="space-y-2">
                    {pairs.map((pair, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-sm">
                            <span>{pair.left}</span>
                            <span className="text-slate-400">=</span>
                            <span>{pair.right}</span>
                        </div>
                    ))}
                </div>
            )}

            {question.type === 'essay' && (
                <p className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 text-sm text-slate-500">
                    Jawaban essay dinilai oleh guru.
                </p>
            )}

            {question.explanation && (
                <p className={cn('text-sm text-slate-500', !expanded && 'line-clamp-2')}>
                    {question.explanation}
                </p>
            )}
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
            {children}
        </label>
    )
}

function ConfirmDeleteDialog({
    title,
    description,
    confirmLabel,
    onCancel,
    onConfirm,
}: {
    title: string
    description: string
    confirmLabel: string
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
            >
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-slate-900 dark:text-white">{title}</h3>
                            <p className="text-xs text-slate-500">Tindakan ini tidak bisa dibatalkan.</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-5">
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel}>Batal</Button>
                    <Button variant="danger" onClick={onConfirm} icon={<Trash2 className="w-4 h-4" />}>
                        {confirmLabel}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    )
}
