import React from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import { Link } from '@inertiajs/react'
import type { ClassRoom } from '@/types'

interface Props {
    classes: ClassRoom[]
}

export default function Classes({ classes = [] }: Props) {
    return (
        <AppLayout title="Kelas Saya">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:text-left">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        Kelas Saya
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Daftar kelas yang kamu ikuti. Gabung dengan kelas baru dengan memasukkan kode quiz dari guru.</p>
                </div>

                {classes.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Kelas</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            Kamu belum terdaftar di kelas manapun. Masukkan kode kelas atau kode quiz dari gurumu di dashboard untuk bergabung!
                        </p>
                        <Link href="/student/dashboard" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                            Kembali ke Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls, i) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                            >
                                <div className="h-24 bg-gradient-to-br from-violet-600 to-indigo-700 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                                </div>
                                <div className="px-6 pb-6 relative">
                                    <div className="flex justify-between items-end mb-4 -mt-10">
                                        <div className="relative">
                                            <img src={cls.teacher?.avatar_url} alt={cls.teacher?.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 bg-white" />
                                            <span className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300">
                                                Guru
                                            </span>
                                        </div>
                                        <div className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold px-3 py-1 rounded-lg text-sm">
                                            {cls.code}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                        {cls.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
                                        Oleh {cls.teacher?.name}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Siswa</p>
                                                <p className="font-bold text-sm">{cls.students_count || 0}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                                <BookOpen className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Quiz</p>
                                                <p className="font-bold text-sm">{cls.quizzes_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
