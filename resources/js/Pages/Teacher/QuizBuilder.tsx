import React, { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit, Eye, Save, Rocket, X, ChevronDown, ChevronUp, CircleDot, CheckCircle, PenTool, TextCursorInput, Waypoints, Settings, FileText, ClipboardList, Link as LinkIcon, Shuffle, BarChart, Globe, Award, Clock } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn, getQuestionTypeLabel } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Category, ClassRoom, Quiz } from '@/types'

interface QuestionForm {
    id?: number
    text: string
    type: 'multiple_choice' | 'true_false' | 'essay' | 'fill_blank' | 'matching'
    points: number
    difficulty: string
    explanation: string
    options: { text: string; is_correct: boolean }[]
    pairs: { left: string; right: string }[]
    fill_answer: string
}

interface Props {
    auth: { user: any }
    categories: Category[]
    classes: ClassRoom[]
    quiz?: Quiz
}

const defaultQuestion = (): QuestionForm => ({
    text: '', type: 'multiple_choice', points: 10, difficulty: 'medium', explanation: '',
    options: [{ text:'',is_correct:false },{ text:'',is_correct:false },{ text:'',is_correct:false },{ text:'',is_correct:false }],
    pairs: [{ left:'',right:'' },{ left:'',right:'' }],
    fill_answer: '',
})

const QUESTION_TYPES = [
    { value:'multiple_choice', label: <><CircleDot className="w-4 h-4 inline mr-2" /> Pilihan Ganda</> },
    { value:'true_false',      label: <><CheckCircle className="w-4 h-4 inline mr-2" /> Benar/Salah</> },
    { value:'essay',           label: <><PenTool className="w-4 h-4 inline mr-2" /> Essay</> },
    { value:'fill_blank',      label: <><TextCursorInput className="w-4 h-4 inline mr-2" /> Isian Singkat</> },
    { value:'matching',        label: <><Waypoints className="w-4 h-4 inline mr-2" /> Menjodohkan</> },
] as const

export default function QuizBuilder({ auth, categories, classes, quiz }: Props) {
    const [activeTab, setActiveTab] = useState<'settings'|'questions'|'preview'>('settings')
    const [questions, setQuestions] = useState<QuestionForm[]>(
        quiz?.questions?.map(q => ({
            id: q.id, text: q.question_text, type: q.type, points: q.points,
            difficulty: q.difficulty, explanation: q.explanation ?? '',
            options: q.options?.map(o => ({ text:o.option_text, is_correct:o.is_correct })) ?? [],
            pairs: q.matching_pairs?.map(p => ({ left:p.left_item, right:p.right_item })) ?? [],
            fill_answer: q.type==='fill_blank' ? q.options?.find(o=>o.is_correct)?.option_text ?? '' : '',
        })) ?? []
    )
    const [editingQ, setEditingQ] = useState<QuestionForm | null>(null)
    const [editingIdx, setEditingIdx] = useState<number>(-1)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)

    const { data, setData } = useForm({
        title: quiz?.title ?? '',
        description: quiz?.description ?? '',
        difficulty: quiz?.difficulty ?? 'medium',
        passing_score: quiz?.passing_score ?? 70,
        time_limit: quiz?.time_limit ?? 30,
        max_attempts: quiz?.max_attempts ?? 1,
        shuffle_questions: quiz?.shuffle_questions ?? false,
        shuffle_options: quiz?.shuffle_options ?? false,
        show_result_immediately: quiz?.show_result_immediately ?? true,
        show_answer_after: quiz?.show_answer_after ?? true,
        is_public: quiz?.is_public ?? false,
        category_id: quiz?.category_id ?? '',
        class_id: quiz?.class_id ?? '',
        xp_reward: quiz?.xp_reward ?? 10,
        status: quiz?.status ?? 'draft',
    })

    const openAddModal = (type: QuestionForm['type'] = 'multiple_choice') => {
        const q = defaultQuestion()
        q.type = type
        if (type === 'true_false') {
            q.options = [{ text:'Benar', is_correct:true },{ text:'Salah', is_correct:false }]
        }
        setEditingQ(q)
        setEditingIdx(-1)
        setShowModal(true)
    }

    const openEditModal = (idx: number) => {
        setEditingQ({ ...questions[idx] })
        setEditingIdx(idx)
        setShowModal(true)
    }

    const saveQuestion = () => {
        if (!editingQ || !editingQ.text.trim()) { toast.error('Teks soal wajib diisi!'); return }
        if (editingIdx >= 0) {
            const updated = [...questions]; updated[editingIdx] = editingQ; setQuestions(updated)
        } else {
            setQuestions(prev => [...prev, editingQ!])
        }
        setShowModal(false)
        toast.success('Soal berhasil disimpan! ✨')
    }

    const removeQuestion = (idx: number) => {
        if (confirm('Hapus soal ini?')) {
            setQuestions(prev => prev.filter((_,i) => i !== idx))
        }
    }

    const save = (status: string = 'draft') => {
        if (!data.title.trim()) { toast.error('Judul quiz wajib diisi!'); return }
        setSaving(true)
        const payload = { 
            ...data, 
            category_id: data.category_id || null,
            class_id: data.class_id || null,
            status, 
            questions 
        }
        const url = quiz ? `/teacher/quizzes/${quiz.id}` : '/teacher/quizzes'
        router.visit(url, {
            method: quiz ? 'put' : 'post',
            data: payload as any,
            onSuccess: () => {
                toast.success(status === 'published' ? 'Quiz dipublish! 🚀' : 'Draft tersimpan! 💾')
            },
            onError: () => toast.error('Terjadi kesalahan. Cek form kembali.'),
            onFinish: () => setSaving(false),
        })
    }

    return (
        <AppLayout title={quiz ? 'Edit Quiz' : 'Buat Quiz Baru'} subtitle={`${questions.length} soal ditambahkan`}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div />
                    <div className="flex gap-3 flex-wrap">
                        <Button variant="secondary" loading={saving} onClick={() => save('draft')} icon={<Save className="w-4 h-4" />}>
                            Simpan Draft
                        </Button>
                        <Button variant="primary" loading={saving} onClick={() => save('published')} icon={<Rocket className="w-4 h-4" />}>
                            Publish Quiz
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                    {([['settings',<><Settings className="w-4 h-4 inline mr-2"/> Pengaturan</>],['questions',<><FileText className="w-4 h-4 inline mr-2"/> Soal ({questions.length})</>],['preview',<><Eye className="w-4 h-4 inline mr-2"/> Preview</>]] as const).map(([tab,label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)}
                            className={cn('px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                                activeTab===tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
                                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Informasi Dasar</h3>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Judul Quiz *</label>
                                    <input value={data.title} onChange={e => setData('title',e.target.value)}
                                        placeholder="Contoh: Quiz Matematika BAB 3..."
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deskripsi</label>
                                    <textarea value={data.description} onChange={e => setData('description',e.target.value)} rows={3}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none" />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { label:'Kategori', name:'category_id', type:'select', options: categories.map(c=>({value:c.id,label:c.name})) },
                                        { label:'Kelas', name:'class_id', type:'select', options: classes.map(c=>({value:c.id,label:c.name})) },
                                        { label:'Kesulitan', name:'difficulty', type:'select', options:[{value:'easy',label:'Mudah'},{value:'medium',label:'Sedang'},{value:'hard',label:'Sulit'},{value:'mixed',label:'Campuran'}] },
                                        { label:'Reward XP', name:'xp_reward', type:'number' },
                                        { label:'Batas Waktu (menit)', name:'time_limit', type:'number' },
                                        { label:'Nilai Lulus (%)', name:'passing_score', type:'number' },
                                        { label:'Maks Percobaan', name:'max_attempts', type:'number' },
                                    ].map(({ label, name, type, options }) => (
                                        <div key={name}>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
                                            {type === 'select' ? (
                                                <select value={(data as any)[name]} onChange={e => setData(name as any, e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none">
                                                    <option value="">-- Pilih --</option>
                                                    {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            ) : (
                                                <input type="number" value={(data as any)[name]} onChange={e => setData(name as any, Number(e.target.value))}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-2">
                                    {([
                                        ['shuffle_questions','Acak Urutan Soal',<Shuffle className="w-4 h-4 text-slate-400"/>],
                                        ['shuffle_options','Acak Pilihan Jawaban',<Shuffle className="w-4 h-4 text-slate-400"/>],
                                        ['show_result_immediately','Tampilkan Hasil Langsung',<BarChart className="w-4 h-4 text-slate-400"/>],
                                        ['show_answer_after','Tampilkan Kunci Jawaban',<CheckCircle className="w-4 h-4 text-slate-400"/>],
                                        ['is_public','Quiz Publik',<Globe className="w-4 h-4 text-slate-400"/>],
                                    ] as const).map(([field, label, icon]) => (
                                        <label key={field} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only peer" checked={(data as any)[field]} onChange={e => setData(field as any, e.target.checked)} />
                                                <div className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-violet-600 transition-colors" />
                                                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-6" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{icon} {label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
                                <h4 className="font-bold text-violet-800 dark:text-violet-300 mb-3 flex items-center gap-2"><ClipboardList className="w-5 h-5"/> Ringkasan</h4>
                                <div className="space-y-2 text-sm">
                                    {[
                                        ['Total Soal', questions.length],
                                        ['Total Poin', questions.reduce((a,q)=>a+q.points,0)],
                                        ['Reward XP', `${data.xp_reward} XP`],
                                        ['Kesulitan', data.difficulty],
                                    ].map(([k,v]) => (
                                        <div key={String(k)} className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>{k}:</span><span className="font-bold text-slate-900 dark:text-white capitalize">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {quiz && (
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2"><LinkIcon className="w-5 h-5" /> Kode Join</h4>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 text-xl font-black text-emerald-700 dark:text-emerald-300 tracking-widest text-center">
                                            {quiz.join_code}
                                        </code>
                                        <button onClick={() => { navigator.clipboard.writeText(quiz.join_code); toast.success('Disalin!') }}
                                            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all">📋</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {QUESTION_TYPES.map(({ value, label }) => (
                                <button key={value} onClick={() => openAddModal(value as any)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-500 transition-all">
                                    {label}
                                </button>
                            ))}
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <div className="mb-4 flex justify-center text-violet-200 dark:text-violet-800"><FileText className="w-16 h-16" /></div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Belum Ada Soal</h3>
                                <p className="text-slate-500">Klik tipe soal di atas untuk mulai menambahkan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q, i) => (
                                    <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex gap-4 group card-hover">
                                        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">{i+1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">{q.text}</p>
                                            <div className="flex gap-2">
                                                <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-medium">{getQuestionTypeLabel(q.type)}</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{q.points} poin</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full capitalize">{q.difficulty}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(i)} className="p-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => removeQuestion(i)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg">
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center">
                                <h2 className="text-2xl font-black text-white">{data.title || 'Judul Quiz'}</h2>
                                <p className="text-white/80 mt-2">{data.description || 'Deskripsi quiz'}</p>
                                <div className="flex justify-center gap-4 mt-4 text-sm text-white/70">
                                    <span className="flex items-center gap-1"><FileText className="w-4 h-4"/> {questions.length} soal</span>
                                    {data.time_limit > 0 && <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {data.time_limit} menit</span>}
                                    <span className="flex items-center gap-1"><Award className="w-4 h-4"/> {data.xp_reward} XP</span>
                                </div>
                            </div>
                            <div className="p-6">
                                {questions[0] ? (
                                    <>
                                        <p className="text-xs text-slate-500 mb-2">Soal 1 dari {questions.length}</p>
                                        <p className="font-semibold text-slate-900 dark:text-white text-lg mb-4">{questions[0].text}</p>
                                        {questions[0].type === 'multiple_choice' && questions[0].options.filter(o=>o.text).map((opt,i) => (
                                            <div key={i} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-2 text-slate-700 dark:text-slate-300 hover:border-violet-300 cursor-pointer transition-all">{opt.text}</div>
                                        ))}
                                        {questions[0].type === 'true_false' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="border-2 border-emerald-300 bg-emerald-50 rounded-xl px-4 py-3 text-center font-semibold text-emerald-700">✅ Benar</div>
                                                <div className="border-2 border-red-300 bg-red-50 rounded-xl px-4 py-3 text-center font-semibold text-red-700">❌ Salah</div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center text-slate-400 py-8">Tambahkan soal untuk melihat preview</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Question Modal */}
                <AnimatePresence>
                    {showModal && editingQ && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                            <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                                className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-3xl z-10">
                                    <h3 className="font-black text-xl text-slate-900 dark:text-white">
                                        {editingIdx>=0 ? '✏️ Edit' : '➕ Tambah'} Soal
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Type Selector */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipe Soal</label>
                                        <div className="flex flex-wrap gap-2">
                                            {QUESTION_TYPES.map(({ value, label }) => (
                                                <button key={value} onClick={() => {
                                                    const q = { ...editingQ, type: value as any }
                                                    if (value==='true_false') q.options = [{ text:'Benar',is_correct:true },{ text:'Salah',is_correct:false }]
                                                    if (value!=='true_false' && value!=='multiple_choice') q.options = []
                                                    setEditingQ(q)
                                                }}
                                                    className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border-2',
                                                        editingQ.type===value ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300')}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Teks Soal *</label>
                                        <textarea value={editingQ.text} onChange={e => setEditingQ({ ...editingQ, text:e.target.value })} rows={3}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none transition-all" />
                                    </div>

                                    {/* Points & Difficulty */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Poin</label>
                                            <input type="number" min={1} value={editingQ.points} onChange={e => setEditingQ({ ...editingQ, points:Number(e.target.value) })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none text-slate-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kesulitan</label>
                                            <select value={editingQ.difficulty} onChange={e => setEditingQ({ ...editingQ, difficulty:e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none text-slate-900 dark:text-white">
                                                <option value="easy">🟢 Mudah</option>
                                                <option value="medium">🟡 Sedang</option>
                                                <option value="hard">🔴 Sulit</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Options for MC */}
                                    {editingQ.type === 'multiple_choice' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pilihan Jawaban <span className="text-slate-400 font-normal">(klik huruf untuk pilih yang benar)</span></label>
                                            <div className="space-y-2">
                                                {editingQ.options.map((opt, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <button onClick={() => {
                                                            const opts = editingQ.options.map((o,j) => ({ ...o, is_correct:j===i }))
                                                            setEditingQ({ ...editingQ, options:opts })
                                                        }}
                                                            className={cn('w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-all',
                                                                opt.is_correct ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-slate-400 hover:border-emerald-400')}>
                                                            {opt.is_correct ? '✓' : String.fromCharCode(65+i)}
                                                        </button>
                                                        <input value={opt.text} onChange={e => {
                                                            const opts = [...editingQ.options]; opts[i] = { ...opts[i], text:e.target.value }
                                                            setEditingQ({ ...editingQ, options:opts })
                                                        }}
                                                            placeholder={`Pilihan ${String.fromCharCode(65+i)}...`}
                                                            className={cn('flex-1 bg-slate-50 dark:bg-slate-800 border-2 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all',
                                                                opt.is_correct ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700')} />
                                                        {editingQ.options.length > 2 && (
                                                            <button onClick={() => setEditingQ({ ...editingQ, options:editingQ.options.filter((_,j)=>j!==i) })}
                                                                className="p-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {editingQ.options.length < 6 && (
                                                <button onClick={() => setEditingQ({ ...editingQ, options:[...editingQ.options,{ text:'',is_correct:false }] })}
                                                    className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1">
                                                    <Plus className="w-4 h-4" /> Tambah Pilihan
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* True/False */}
                                    {editingQ.type === 'true_false' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Jawaban yang Benar</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[{ val:true, label:<><CheckCircle className="w-4 h-4 inline mr-1"/> Benar</> },{ val:false, label:<><X className="w-4 h-4 inline mr-1"/> Salah</> }].map(({ val, label }, i) => (
                                                    <button key={String(val)} onClick={() => {
                                                        const opts = [{ text:'Benar',is_correct:val },{ text:'Salah',is_correct:!val }]
                                                        setEditingQ({ ...editingQ, options:opts })
                                                    }}
                                                        className={cn('p-4 rounded-xl border-2 text-center font-bold transition-all',
                                                            editingQ.options[i]?.is_correct ? (i===0 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700') : 'border-slate-200 dark:border-slate-700 text-slate-600')}>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fill Blank */}
                                    {editingQ.type === 'fill_blank' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jawaban yang Benar</label>
                                            <input value={editingQ.fill_answer} onChange={e => setEditingQ({ ...editingQ, fill_answer:e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                                        </div>
                                    )}

                                    {/* Essay Info */}
                                    {editingQ.type === 'essay' && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                                            <div className="text-blue-500"><PenTool className="w-5 h-5"/></div>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-0.5">Soal essay dinilai manual oleh guru setelah murid menjawab.</p>
                                        </div>
                                    )}

                                    {/* Matching */}
                                    {editingQ.type === 'matching' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pasangan Jawaban</label>
                                            <div className="space-y-3">
                                                {editingQ.pairs.map((pair, i) => (
                                                    <div key={i} className="grid grid-cols-5 gap-2 items-center">
                                                        <input value={pair.left} onChange={e => {
                                                            const p=[...editingQ.pairs]; p[i]={ ...p[i],left:e.target.value }; setEditingQ({ ...editingQ,pairs:p })
                                                        }} placeholder="Kolom kiri..." className="col-span-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                                                        <div className="text-center text-slate-400 col-span-1">↔</div>
                                                        <input value={pair.right} onChange={e => {
                                                            const p=[...editingQ.pairs]; p[i]={ ...p[i],right:e.target.value }; setEditingQ({ ...editingQ,pairs:p })
                                                        }} placeholder="Kolom kanan..." className="col-span-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none" />
                                                        {editingQ.pairs.length > 2 && (
                                                            <button onClick={() => setEditingQ({ ...editingQ, pairs:editingQ.pairs.filter((_,j)=>j!==i) })} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => setEditingQ({ ...editingQ, pairs:[...editingQ.pairs,{ left:'',right:'' }] })}
                                                className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1">
                                                <Plus className="w-4 h-4" /> Tambah Pasangan
                                            </button>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Penjelasan/Pembahasan <span className="text-slate-400 font-normal">(opsional)</span></label>
                                        <textarea value={editingQ.explanation} onChange={e => setEditingQ({ ...editingQ, explanation:e.target.value })} rows={2}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm" />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                                        <Button variant="primary" onClick={saveQuestion}>
                                            {editingIdx>=0 ? '✏️ Update Soal' : '➕ Tambah Soal'}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    )
}
