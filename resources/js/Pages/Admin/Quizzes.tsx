import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { BookOpen, Clock, Settings, Zap, List, PlusCircle, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function Quizzes({ quizzes }: { quizzes: any[] }) {
    const [deleteQuiz, setDeleteQuiz] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const confirmDelete = () => {
        if (!deleteQuiz) return;
        router.delete(`/admin/quizzes/${deleteQuiz.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteQuiz(null)
        });
    };
    
    // Filter quizzes based on search query
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
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
            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Helper function to format status
    const renderStatus = (status: string) => {
        if (status === 'published') {
            return (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                Draft
            </span>
        );
    };

    return (
        <AppLayout title="Manajemen Kuis Global" subtitle="Daftar semua kuis yang tersedia di platform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Direktori Kuis</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Total {quizzes.length} kuis terdaftar di sistem</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari kuis..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white transition-all w-full md:w-64"
                        />
                    </div>

                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Kuis</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Sistem ini belum memiliki kuis sama sekali.
                    </p>

                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pencarian Tidak Ditemukan</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Kuis tidak ditemukan, coba kata kunci yang lain.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col">
                            {/* Card Header (Category & Status) */}
                            <div className="p-5 pb-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                {quiz.category ? (
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                                            style={{ backgroundColor: `${quiz.category.color}20`, color: quiz.category.color }}
                                        >
                                            {quiz.category.icon}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {quiz.category.name}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <List className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">Tanpa Kategori</span>
                                    </div>
                                )}
                                <div>{renderStatus(quiz.status)}</div>
                            </div>

                            {/* Card Body (Title & Meta) */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                                        {quiz.title}
                                    </h3>
                                    {quiz.description && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                                            {quiz.description}
                                        </p>
                                    )}
                                </div>

                                {/* Meta Stats */}
                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                                        <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                                            <List className="w-3.5 h-3.5 text-blue-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Soal</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none mt-0.5">{quiz.questions_count || 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                                        <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Durasi</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none mt-0.5">
                                                {quiz.time_limit ? `${quiz.time_limit}m` : '∞'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-4 pt-0 flex items-center justify-between mt-2">
                                <div>{renderDifficulty(quiz.difficulty)}</div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/quizzes/${quiz.id}`} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Pratinjau Kuis">
                                        <Eye className="w-4 h-4" />
                                    </Link>

                                    <button onClick={() => setDeleteQuiz(quiz)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Kuis">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* delete modal */}
            {deleteQuiz && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteQuiz(null)} />
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hapus Kuis?</h3>
                            <p className="text-slate-500 text-sm">
                                Apakah Anda yakin ingin menghapus kuis <span className="font-bold text-slate-700 dark:text-slate-300">"{deleteQuiz.title}"</span> beserta seluruh soal di dalamnya?
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                            <button 
                                onClick={() => setDeleteQuiz(null)}
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-500/30 transition-colors"
                            >
                                Ya, Hapus
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
