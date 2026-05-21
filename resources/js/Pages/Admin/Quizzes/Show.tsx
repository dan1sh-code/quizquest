import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { ArrowLeft, Clock, Zap, BookOpen, Layers, CheckCircle2, HelpCircle, Trash2 } from 'lucide-react';

export default function Show({ quiz }: { quiz: any }) {

    const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
    const [showClearModal, setShowClearModal] = useState<boolean>(false);

    const confirmDeleteQuestion = () => {
        if (deleteQuestionId) {
            router.delete(`/admin/quizzes/${quiz.id}/questions/${deleteQuestionId}`, {
                preserveScroll: true,
                onFinish: () => setDeleteQuestionId(null)
            });
        }
    };

    const confirmClearQuestions = () => {
        router.delete(`/admin/quizzes/${quiz.id}/questions`, {
            preserveScroll: true,
            onFinish: () => setShowClearModal(false)
        });
    };
    // Helper function to format difficulty
    const renderDifficulty = (difficulty: string) => {
        const styles: Record<string, { label: string, color: string }> = {
            'easy': { label: 'Mudah', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30' },
            'medium': { label: 'Sedang', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' },
            'hard': { label: 'Sulit', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30' },
            'mixed': { label: 'Campuran', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30' },
        };
        const config = styles[difficulty] || styles['medium'];

        return (
            <span className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold rounded-full border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AppLayout
            title="Pratinjau Kuis"
            subtitle="Lihat detail kuis beserta daftar pertanyaannya"
        >
            <div className="max-w-4xl mx-auto pb-12">
                <div className="mb-6">
                    <Link
                        href="/admin/quizzes"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        Kembali ke Direktori
                    </Link>
                </div>

                {/* Quiz Header Information */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative mb-8">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

                    <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    {quiz.category && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                            <span>{quiz.category.icon}</span>
                                            <span>{quiz.category.name}</span>
                                        </div>
                                    )}
                                    {renderDifficulty(quiz.difficulty)}
                                    <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                        {quiz.status === 'published' ? '🟢 Aktif' : '⚪ Draft'}
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                                    {quiz.title}
                                </h2>
                                {quiz.description && (
                                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                        {quiz.description}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex shrink-0 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <div className="text-center px-4">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2 text-blue-500">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white">{quiz.questions?.length || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Soal</div>
                                </div>
                                <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-center px-4">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2 text-orange-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white">{quiz.time_limit || '∞'}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Menit</div>
                                </div>
                                <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-center px-4">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2 text-amber-500">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white">{quiz.xp_reward || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">XP</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-violet-500" />
                        Daftar Pertanyaan
                    </h3>
                    {quiz.questions && quiz.questions.length > 0 && (
                        <button
                            onClick={() => setShowClearModal(true)}
                            className="text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua Soal
                        </button>
                    )}
                </div>

                {quiz.questions && quiz.questions.length > 0 ? (
                    <div className="space-y-4">
                        {quiz.questions.map((question: any, index: number) => (
                            <div key={question.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 shrink-0 bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="text-base font-medium text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: question.question_text }}></div>
                                            <button
                                                onClick={() => setDeleteQuestionId(question.id)}
                                                className="p-2 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Hapus Soal"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            {question.options && question.options.map((option: any) => (
                                                <div
                                                    key={option.id}
                                                    className={`p-3 rounded-xl border flex items-start gap-3 ${option.is_correct
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                                                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                                                        }`}
                                                >
                                                    <div className="mt-0.5">
                                                        {option.is_correct ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                                                        )}
                                                    </div>
                                                    <div className={`text-sm ${option.is_correct ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {option.option_text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Belum Ada Pertanyaan</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                            Belum ada soal yang dibuat dalam kuis ini.
                        </p>
                    </div>
                )}
            </div>
            {/* Delete Question Modal */}
            {deleteQuestionId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteQuestionId(null)} />
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hapus Soal?</h3>
                            <p className="text-slate-500 text-sm">
                                Apakah Anda yakin ingin menghapus soal ini?
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                            <button
                                onClick={() => setDeleteQuestionId(null)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDeleteQuestion}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-500/30 transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear All Questions Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowClearModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hapus SEMUA Soal?</h3>
                            <p className="text-slate-500 text-sm">
                                Apakah Anda yakin ingin menghapus SEMUA soal dalam kuis ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                            <button
                                onClick={() => setShowClearModal(false)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmClearQuestions}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-500/30 transition-colors"
                            >
                                Ya, Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
        </AppLayout>
    );
}
