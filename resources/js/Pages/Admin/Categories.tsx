import React, { useState } from 'react'
import { PlusCircle, Edit, Trash2, BookOpen, ChevronRight, X, Clock, BarChart2, ArrowLeft, Search, Eye, List } from 'lucide-react'
import { Link, router } from '@inertiajs/react'
import AppLayout from '@/Components/Layout/AppLayout'

const diffColor: Record<string, { label: string, color: string }> = {
    easy: { label: 'Mudah', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
    medium: { label: 'Sedang', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
    hard: { label: 'Sulit', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
    mixed: { label: 'Campuran', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
}

// ── Quiz Review Drawer ──────────────────────────────────────────────────────
function QuizReviewDrawer({ cat, onClose }: { cat: any; onClose: () => void }) {
    const quizzes = cat.quizzes ?? []

    return (
        <>
            {/* backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-[fadeIn_0.2s_ease]"
                onClick={onClose}
            />

            {/* panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                {/* header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-500" />
                        </button>
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                            {cat.icon}
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white text-lg leading-tight">{cat.name}</h2>
                            <p className="text-xs text-slate-400">{quizzes.length} kuis tersedia</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* quiz list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {quizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                <BookOpen className="w-7 h-7 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-semibold text-sm">Belum ada kuis</p>
                            <p className="text-slate-400 text-xs mt-1">Tambahkan kuis untuk kategori ini</p>
                        </div>
                    ) : (
                        quizzes.map((quiz, i) => (
                            <Link
                                href={`/admin/quizzes/${quiz.id}`}
                                key={quiz.id}
                                className="block rounded-2xl border border-slate-100 dark:border-slate-800 p-4 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/10 transition-all duration-200 group cursor-pointer"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-violet-600 transition-colors">
                                            {quiz.title}
                                        </h3>
                                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${diffColor[quiz.difficulty]?.color || diffColor['medium'].color}`}>
                                            {diffColor[quiz.difficulty]?.label || 'Sedang'}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all mt-0.5" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <div className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                                            <BookOpen className="w-3 h-3 text-violet-500" />
                                        </div>
                                        <span className="font-semibold">{quiz.questions_count || 0} soal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <div className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                            <Clock className="w-3 h-3 text-orange-500" />
                                        </div>
                                        <span className="font-semibold">{quiz.time_limit ? `${quiz.time_limit} mnt` : '∞'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Link 
                        href={`/admin/quizzes?category_id=${cat.id}`}
                        className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" /> Tinjau kuis di kategori ini
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
            `}</style>
        </>
    )
}

// ── Category Card ───────────────────────────────────────────────────────────
function CategoryCard({ cat, onReview, onDelete }: { cat: any; onReview: () => void; onDelete: () => void }) {
    const isActive = cat.is_active ?? true

    return (
        <div
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col"
        >
            {/* Card Header (Category & Status) */}
            <div
                className="p-5 pb-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between"
                style={{ backgroundColor: `${cat.color || '#8b5cf6'}1f` }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                        {cat.icon || <List className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Kategori
                    </span>
                </div>
                {isActive ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        Nonaktif
                    </span>
                )}
            </div>

            {/* Card Body (Title & Meta) */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                        {cat.name}
                    </h3>
                    {cat.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                            {cat.description}
                        </p>
                    )}
                </div>

                {/* Meta Stats */}
                <div className="mt-auto">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                        <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kuis</span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none mt-0.5">{cat.quizzes_count ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-0 flex items-center justify-between mt-2">
                <button
                    onClick={onReview}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border transition-colors"
                    style={{
                        borderColor: `${cat.color}55`,
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                    }}
                >
                    Tinjau Kuis
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onReview} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Tinjau Kuis">
                        <Eye className="w-4 h-4" />
                    </button>
                    <Link href={`/admin/categories/${cat.id}/edit`} className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition-colors" title="Edit Kategori">
                        <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus Kategori">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function CategoriesIndex({ categories }: any) {
    const [reviewCat, setReviewCat] = useState<any | null>(null)
    const [deleteCat, setDeleteCat] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const confirmDelete = () => {
        if (!deleteCat) return;
        router.delete(`/admin/categories/${deleteCat.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteCat(null)
        });
    }

    const filteredCategories = categories.filter((cat: any) => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout title="Kategori Kuis" subtitle="Kelola kategori untuk pengelompokkan topik kuis">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Kategori</h2>
                    <p className="text-slate-500">Total {categories.length} kategori aktif</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari kategori..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white transition-all w-full sm:w-64"
                        />
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-all duration-200 shadow-md whitespace-nowrap w-full sm:w-auto"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Tambah Kategori</span>
                    </Link>
                </div>
            </div>

            {/* grid */}
            {categories.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Kategori</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Sistem ini belum memiliki kategori sama sekali.
                    </p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pencarian Tidak Ditemukan</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Kategori tidak ditemukan, coba kata kunci yang lain.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((cat: any) => (
                        <CategoryCard key={cat.id} cat={cat} onReview={() => setReviewCat(cat)} onDelete={() => setDeleteCat(cat)} />
                    ))}
                </div>
            )}

            {/* drawer */}
            {reviewCat && (
                <QuizReviewDrawer cat={reviewCat} onClose={() => setReviewCat(null)} />
            )}

            {/* delete modal */}
            {deleteCat && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteCat(null)} />
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hapus Kategori?</h3>
                            <p className="text-slate-500 text-sm">
                                Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-slate-700 dark:text-slate-300">"{deleteCat.name}"</span>?
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                            <button 
                                onClick={() => setDeleteCat(null)}
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
            `}</style>
        </AppLayout>
    )
}
