import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { ArrowLeft, Type, AlignLeft, Palette, Smile, LayoutGrid } from 'lucide-react';

export default function Create({ category }: { category?: any }) {
    const { data, setData, post, put, processing, transform } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        color: category?.color || '#8b5cf6', // Default purple
        icon: category?.icon || '👩🏻‍🎓',
        is_active: category?.is_active ?? true
    });

    transform((data) => ({
        ...data,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (category) {
            put(`/admin/categories/${category.id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <AppLayout 
            title={category ? "Edit Kategori" : "Tambah Kategori Baru"} 
            subtitle={category ? "Ubah detail informasi kategori kuis ini" : "Silakan masukkan informasi kategori kuis baru"}
        >
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/admin/categories"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        Kembali ke Daftar
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>

                    <div className="p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10">
                            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-500/20 shadow-inner">
                                <LayoutGrid className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{category ? 'Edit Kategori' : 'Detail Kategori'}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{category ? 'Ubah informasi kategori kuis yang sudah ada' : 'Lengkapi form di bawah untuk membuat kategori baru'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Nama */}
                            <div>
                                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <Type className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="Contoh: Pemrograman, Matematika, dll"
                                    required
                                />
                            </div>

                            {/* Input Deskripsi */}
                            <div>
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <AlignLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    placeholder="Tuliskan penjelasan singkat mengenai kategori ini..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input Warna */}
                                <div>
                                    <label htmlFor="color" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        <Palette className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        Warna Kategori
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            id="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="h-12 w-12 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-colors"
                                        />
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm uppercase placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="#8b5cf6"
                                        />
                                    </div>
                                </div>

                                {/* Input Icon - Keyboard Emoji Input */}
                                <div>
                                    <label htmlFor="icon" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        <Smile className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        Ketik Emoji
                                    </label>
                                    <input
                                        type="text"
                                        id="icon"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value.substring(0, 2))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xl placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="🎮"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1 leading-relaxed">
                                        Gunakan keyboard emoji OS Anda:<br />
                                        <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-sans text-[10px]">Win</kbd> + <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-sans text-[10px]">.</kbd> di Windows, atau<br />
                                        <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-sans text-[10px]">Cmd</kbd> + <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-sans text-[10px]">Ctrl</kbd> + <kbd className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-sans text-[10px]">Space</kbd> di Mac.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3">
                                <Link
                                    href="/admin/categories"
                                    className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium text-center shadow-sm"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        category ? 'Simpan Perubahan' : 'Simpan Kategori'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}