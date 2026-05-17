import React from 'react'
import { PlusCircle, Tag, Edit, Trash2 } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'

export default function CategoriesIndex({ categories }: any) {
    return (
        <AppLayout title="Kategori Kuis" subtitle="Kelola kategori untuk pengelompokkan topik kuis">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Kategori</h2>
                    <p className="text-slate-500">Total {categories.length} kategori aktif</p>
                </div>
                <Button className="rounded-2xl shadow-xl shadow-violet-500/30 gap-2">
                    <PlusCircle className="w-5 h-5" /> Tambah Kategori
                </Button>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat: any) => (
                    <div key={cat.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md transition-transform group-hover:scale-110" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                            {cat.icon || <Tag />}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{cat.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mb-6 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">{cat.quizzes_count || 0} Kuis</p>
                        
                        <div className="flex items-center gap-2 w-full mt-auto">
                            <Button variant="secondary" className="flex-1 py-2 text-xs rounded-xl"><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="danger" className="py-2 text-xs rounded-xl px-4"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    )
}
