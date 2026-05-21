import React, { useRef, useState } from 'react'
import { useForm, Link } from '@inertiajs/react'
import { Save, ArrowLeft, School, BookOpen, ChevronDown, Camera, Image as ImageIcon } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import type { Category } from '@/types'

type ClassFormProps = {
    classroom?: {
        id: number
        name?: string
        description?: string | null
        subject?: string | null
        grade_level?: string | null
        cover_image?: string | null
        cover_position_x?: number | null
        cover_position_y?: number | null
    }
    categories?: Category[]
}

const clampPosition = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export default function ClassForm({ classroom, categories = [] }: ClassFormProps) {
    const isEdit = !!classroom
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        classroom?.cover_image ? `/storage/${classroom.cover_image}` : null,
    )
    const baseSubjectOptions = categories.length > 0
        ? categories
        : [{ id: 0, name: 'Umum', slug: 'umum', icon: '📖', color: '#6B7280' }]
    const subjectOptions = classroom?.subject && !baseSubjectOptions.some(category => category.name === classroom.subject)
        ? [{ id: -1, name: classroom.subject, slug: 'current-subject' }, ...baseSubjectOptions]
        : baseSubjectOptions

    const { data, setData, post, processing, errors } = useForm({
        name: classroom?.name || '',
        description: classroom?.description || '',
        subject: classroom?.subject || subjectOptions[0]?.name || '',
        grade_level: classroom?.grade_level || '',
        cover_image: null as File | null,
        cover_position_x: classroom?.cover_position_x ?? 50,
        cover_position_y: classroom?.cover_position_y ?? 50,
        _method: isEdit ? 'put' : '',
    })

    const chooseThumbnail = (file?: File) => {
        if (!file) return
        setData('cover_image', file)
        setThumbnailPreview(URL.createObjectURL(file))
    }

    const repositionThumbnail = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!thumbnailPreview) {
            fileInputRef.current?.click()
            return
        }

        const target = event.currentTarget
        target.setPointerCapture(event.pointerId)

        const updatePosition = (clientX: number, clientY: number) => {
            const rect = target.getBoundingClientRect()
            setData(current => ({
                ...current,
                cover_position_x: clampPosition(((clientX - rect.left) / rect.width) * 100),
                cover_position_y: clampPosition(((clientY - rect.top) / rect.height) * 100),
            }))
        }

        updatePosition(event.clientX, event.clientY)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit) {
            post(`/teacher/classes/${classroom.id}`, {
                forceFormData: true,
            })
        } else {
            post('/teacher/classes', {
                forceFormData: true,
            })
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
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Thumbnail Kelas</label>
                            <button
                                type="button"
                                onClick={() => !thumbnailPreview && fileInputRef.current?.click()}
                                onPointerDown={repositionThumbnail}
                                onPointerMove={event => event.buttons === 1 && repositionThumbnail(event)}
                                className="group relative flex aspect-[16/7] w-full touch-none items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
                            >
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview thumbnail kelas"
                                        className="h-full w-full select-none object-cover"
                                        draggable={false}
                                        style={{ objectPosition: `${data.cover_position_x}% ${data.cover_position_y}%` }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-500">
                                        <ImageIcon className="mb-3 h-10 w-10 text-blue-500" />
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">Upload thumbnail kelas</span>
                                        <span className="mt-1 text-xs font-medium">PNG, JPG, atau JPEG maksimal 2 MB</span>
                                    </div>
                                )}
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={event => {
                                        event.stopPropagation()
                                        fileInputRef.current?.click()
                                    }}
                                    onPointerDown={event => event.stopPropagation()}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            fileInputRef.current?.click()
                                        }
                                    }}
                                    className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-950/90 dark:text-slate-100"
                                >
                                    <Camera className="h-4 w-4" />
                                    {thumbnailPreview ? 'Ganti Foto' : 'Pilih Foto'}
                                </span>
                            </button>
                            {thumbnailPreview && (
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-1 block text-xs font-bold text-slate-500">Geser kiri / kanan</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={data.cover_position_x}
                                            onChange={event => setData('cover_position_x', Number(event.target.value))}
                                            className="w-full accent-blue-600"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="mb-1 block text-xs font-bold text-slate-500">Geser atas / bawah</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={data.cover_position_y}
                                            onChange={event => setData('cover_position_y', Number(event.target.value))}
                                            className="w-full accent-blue-600"
                                        />
                                    </label>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={event => chooseThumbnail(event.target.files?.[0])}
                            />
                            {errors.cover_image && <p className="text-red-500 text-xs font-semibold mt-1">{errors.cover_image}</p>}
                        </div>

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
                                <select
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    className="w-full appearance-none pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-colors"
                                >
                                    {subjectOptions.map(category => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
