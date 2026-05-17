import React from 'react'
import { useForm, Link } from '@inertiajs/react'
import { Save, ArrowLeft, School, BookOpen } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'

export default function ClassForm({ classroom }: any) {
    const isEdit = !!classroom
    const { data, setData, post, put, processing, errors } = useForm({
        name: classroom?.name || '',
        description: classroom?.description || '',
        subject: classroom?.subject || '',
        grade_level: classroom?.grade_level || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            put(`/teacher/classes/${classroom.id}`)
        } else {
            post('/teacher/classes')
        }
    }

    return (
        <AppLayout title={isEdit ? 'Edit Kelas' : 'Buat Kelas Baru'} subtitle="Kelola informasi ruang kelas Anda">
            <div className="max-w-2xl mx-auto py-8">
                <Link href="/teacher/classes" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-6 font-semibold transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Kelas
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <h2 className="text-3xl font-black text-white relative z-10">{isEdit ? 'Perbarui Kelas' : 'Kelas Baru'}</h2>
                        <p className="text-blue-100 mt-2 relative z-10">Isi detail kelas agar murid dapat menemukannya.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Kelas <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Matematika Kelas X-A"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-colors"
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mata Pelajaran</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={data.subject} 
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Contoh: Matematika"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-colors"
                                />
                            </div>
                            {errors.subject && <p className="text-red-500 text-xs font-semibold mt-1">{errors.subject}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tingkat / Grade</label>
                                <input 
                                    type="text" 
                                    value={data.grade_level} 
                                    onChange={e => setData('grade_level', e.target.value)}
                                    placeholder="Contoh: 10"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi Kelas</label>
                            <textarea 
                                rows={4}
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Jelaskan secara singkat mengenai kelas ini..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-colors resize-none"
                            />
                            {errors.description && <p className="text-red-500 text-xs font-semibold mt-1">{errors.description}</p>}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button type="submit" loading={processing} className="w-full py-4 text-lg rounded-xl shadow-xl shadow-blue-500/30 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <Save className="w-5 h-5" /> {isEdit ? 'Simpan Perubahan' : 'Buat Kelas'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
