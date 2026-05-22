import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { ArrowLeft, Megaphone, AlignLeft, Calendar, Tag, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Create({ announcement }: { announcement?: any }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: announcement?.title || '',
        content: announcement?.content || '',
        type: announcement?.type || 'info',
        target_role: announcement?.target_role || 'all',
        is_active: announcement?.is_active ?? true,
        expires_at: announcement?.expires_at ? new Date(announcement.expires_at).toISOString().split('T')[0] : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (announcement) {
            put(`/admin/announcements/${announcement.id}`);
        } else {
            post('/admin/announcements');
        }
    };

    const typeOptions = [
        { value: 'info', label: 'Informasi', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
        { value: 'success', label: 'Sukses', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
        { value: 'warning', label: 'Peringatan', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
        { value: 'danger', label: 'Penting/Bahaya', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' },
    ];

    const roleOptions = [
        { value: 'all', label: 'Semua Pengguna' },
        { value: 'student', label: 'Siswa Saja' },
        { value: 'teacher', label: 'Guru Saja' },
    ];

    return (
        <AppLayout 
            title={announcement ? "Edit Pengumuman" : "Buat Pengumuman Baru"} 
            subtitle={announcement ? "Ubah detail pengumuman yang sudah ada" : "Buat pengumuman baru untuk pengguna sistem"}
        >
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/admin/announcements"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        Kembali ke Daftar
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500"></div>

                    <div className="p-8 md:p-10">
                        <div className="flex items-start gap-6 mb-10">
                            <div className="w-16 h-16 bg-violet-50 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-violet-100 dark:border-violet-500/20 shadow-inner">
                                <Megaphone className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{announcement ? 'Edit Pengumuman' : 'Detail Pengumuman'}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{announcement ? 'Ubah informasi pengumuman' : 'Lengkapi form di bawah untuk membuat pengumuman'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Judul */}
                            <div>
                                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <Tag className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Judul Pengumuman <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={cn("w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500", errors.title ? "border-red-500" : "border-slate-200 dark:border-slate-700")}
                                    placeholder="Contoh: Pembaruan Sistem V2.0"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            {/* Input Konten */}
                            <div>
                                <label htmlFor="content" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <AlignLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Isi Pengumuman <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={5}
                                    className={cn("w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500", errors.content ? "border-red-500" : "border-slate-200 dark:border-slate-700")}
                                    placeholder="Tuliskan isi pesan pengumuman..."
                                    required
                                />
                                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tipe Pengumuman */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        Tipe Pengumuman
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {typeOptions.map((option) => (
                                            <button
                                                type="button"
                                                key={option.value}
                                                onClick={() => setData('type', option.value)}
                                                className={cn(
                                                    "px-3 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all",
                                                    data.type === option.value 
                                                        ? option.color + " ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-slate-900" 
                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                {/* Target Pengguna */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        Target Pengguna
                                    </label>
                                    <div className="flex flex-col gap-3">
                                        {roleOptions.map((option) => (
                                            <label key={option.value} className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", data.target_role === option.value ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700")}>
                                                <input
                                                    type="radio"
                                                    name="target_role"
                                                    value={option.value}
                                                    checked={data.target_role === option.value}
                                                    onChange={(e) => setData('target_role', e.target.value)}
                                                    className="text-violet-600 focus:ring-violet-500"
                                                />
                                                <span className={cn("text-sm font-semibold", data.target_role === option.value ? "text-violet-700 dark:text-violet-400" : "text-slate-700 dark:text-slate-300")}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.target_role && <p className="text-red-500 text-xs mt-1">{errors.target_role}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal Kedaluwarsa */}
                                <div>
                                    <label htmlFor="expires_at" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        Tanggal Berakhir (Opsional)
                                    </label>
                                    <input
                                        type="date"
                                        id="expires_at"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Kosongkan jika pengumuman berlaku selamanya.</p>
                                </div>
                                
                                {/* Status Aktif */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Status
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {data.is_active ? 'Aktif (Tampil)' : 'Nonaktif (Sembunyikan)'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3">
                                <Link
                                    href="/admin/announcements"
                                    className="px-6 py-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium text-center shadow-sm"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                                        announcement ? 'Simpan Perubahan' : 'Buat Pengumuman'
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
