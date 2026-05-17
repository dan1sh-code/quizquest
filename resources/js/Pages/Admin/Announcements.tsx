import React from 'react'
import { PlusCircle, Megaphone, Calendar } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

export default function AnnouncementsIndex({ announcements }: any) {
    return (
        <AppLayout title="Pengumuman" subtitle="Kelola banner pengumuman untuk semua pengguna">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pengumuman Aktif</h2>
                </div>
                <Button className="rounded-2xl shadow-xl shadow-violet-500/30 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <PlusCircle className="w-5 h-5" /> Buat Pengumuman
                </Button>
            </div>

            <div className="space-y-4 max-w-4xl">
                {announcements.data.map((item: any) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm", item.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : item.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400')}>
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", item.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}>
                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.message}</p>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                <span>Oleh: {item.creator?.name}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {announcements.data.length === 0 && (
                    <div className="text-center py-12">
                        <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Tidak ada pengumuman.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
