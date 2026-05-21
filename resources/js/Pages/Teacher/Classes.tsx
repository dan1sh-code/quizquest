import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { AlertTriangle, PlusCircle, Users, Copy, CheckCircle2, Edit, Trash2, Key, X } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'

export default function Classes({ classes }: any) {
    const [copiedId, setCopiedId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [classToDelete, setClassToDelete] = useState<any | null>(null)
    const { delete: destroy, processing } = useForm()

    const copyCode = (id: number, code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const deleteClass = () => {
        if (!classToDelete) return

        setDeletingId(classToDelete.id)
        destroy(`/teacher/classes/${classToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setClassToDelete(null),
            onFinish: () => setDeletingId(null),
        })
    }

    return (
        <AppLayout title="Kelas Saya" subtitle="Kelola kelas dan pantau murid-murid Anda">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Kelas</h2>
                    <p className="text-slate-500">Anda mengelola {classes.total} kelas aktif</p>
                </div>
                <Link href="/teacher/classes/create">
                    <Button className="rounded-2xl shadow-xl shadow-violet-500/30 gap-2">
                        <PlusCircle className="w-5 h-5" /> Buat Kelas Baru
                    </Button>
                </Link>
            </div>

            {classes.data.length === 0 ? (
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🎓</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada Kelas</h3>
                    <p className="text-slate-500 mb-6">Buat kelas untuk mengelompokkan murid dan kuis Anda.</p>
                    <Link href="/teacher/classes/create">
                        <Button variant="secondary" className="rounded-xl">Mulai Membuat Kelas</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.data.map((cls: any) => (
                        <div key={cls.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                                {cls.cover_image ? (
                                    <img
                                        src={`/storage/${cls.cover_image}`}
                                        alt={`Thumbnail ${cls.name}`}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        style={{ objectPosition: `${cls.cover_position_x ?? 50}% ${cls.cover_position_y ?? 50}%` }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-5xl font-black text-white/90">
                                        {cls.name.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                            </div>
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
                                    {cls.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate" title={cls.name}>{cls.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1">{cls.description || 'Tidak ada deskripsi'}</p>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 flex-1">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                        <Users className="w-6 h-6 text-blue-500 mb-2" />
                                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{cls.students_count || 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Murid</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                        <div className="text-2xl mb-2">📝</div>
                                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{cls.quizzes_count || 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kuis</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 flex items-center">
                                    <div className="flex items-center gap-2 px-3 flex-1 text-slate-500">
                                        <Key className="w-4 h-4" />
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tracking-widest">{cls.code}</span>
                                    </div>
                                    <button 
                                        onClick={() => copyCode(cls.id, cls.code)}
                                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-2 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                        {copiedId === cls.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        <span className="text-xs font-bold">{copiedId === cls.id ? 'Tersalin' : 'Salin Kode'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                                <Link href={`/teacher/classes/${cls.id}/students`} className="flex-1">
                                    <Button variant="secondary" className="w-full text-xs rounded-xl py-2">
                                        Kelola Murid
                                    </Button>
                                </Link>
                                <Link href={`/teacher/classes/${cls.id}/edit`}>
                                    <Button variant="outline" className="w-auto px-3 rounded-xl border-slate-200 dark:border-slate-700 text-slate-500">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    type="button"
                                    variant="danger"
                                    loading={processing && deletingId === cls.id}
                                    onClick={() => setClassToDelete(cls)}
                                    className="w-auto px-3 rounded-xl"
                                    title="Hapus kelas"
                                    aria-label={`Hapus kelas ${cls.name}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {classToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="relative bg-gradient-to-br from-red-600 to-rose-700 p-6 text-white">
                            <button
                                type="button"
                                onClick={() => setClassToDelete(null)}
                                disabled={processing}
                                className="absolute right-4 top-4 rounded-xl bg-white/15 p-2 text-white/80 transition hover:bg-white/25 hover:text-white disabled:opacity-50"
                                aria-label="Tutup konfirmasi hapus"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black">Hapus kelas?</h3>
                            <p className="mt-2 text-sm font-medium text-red-100">
                                Kelas <span className="font-black text-white">"{classToDelete.name}"</span> akan dihapus dari daftar kelas Anda.
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{classToDelete.students_count || 0}</p>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Murid</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{classToDelete.quizzes_count || 0}</p>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Kuis</p>
                                </div>
                            </div>

                            <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">
                                Aksi ini tidak bisa dibatalkan. Pastikan kelas ini memang sudah tidak dipakai.
                            </p>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={processing}
                                    onClick={() => setClassToDelete(null)}
                                    className="rounded-xl"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    loading={processing && deletingId === classToDelete.id}
                                    onClick={deleteClass}
                                    className="rounded-xl"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus Kelas
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
