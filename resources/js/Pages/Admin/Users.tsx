import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Users, Search, Filter, MoreVertical, Shield, ShieldAlert, Trash2, X } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'
import LevelIcon from '@/Components/ui/LevelIcon'

export default function UsersIndex({ users, roles }: any) {
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [showFilterModal, setShowFilterModal] = useState(false)

    const filteredUsers = users.data.filter((user: any) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchQuery.toLowerCase())
        
        if (roleFilter === '') {
            return matchesSearch
        }
        
        const userRole = user.roles?.[0]?.name || 'student'
        return matchesSearch && userRole === roleFilter
    })

    return (
        <AppLayout title="Manajemen Pengguna" subtitle="Kelola semua akun guru dan murid di platform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daftar Pengguna</h2>
                    <p className="text-slate-500">Total {users.total} pengguna terdaftar</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Cari nama/email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-violet-500 outline-none" />
                    </div>
                    <button onClick={() => setShowFilterModal(!showFilterModal)} className={cn("px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 font-semibold text-sm", roleFilter ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400")}>
                        <Filter className="w-4 h-4" />
                        {roleFilter ? `${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}` : 'Filter'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Pengguna Tidak Ditemukan</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                Tidak ada pengguna yang cocok dengan pencarian "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4 text-center">Peran (Role)</th>
                                    <th className="px-6 py-4 text-center">Level / XP</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredUsers.map((user: any) => {
                                    const role = user.roles?.[0]?.name || 'student'
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar_url} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn("inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border", 
                                                    role === 'admin' ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800" :
                                                    role === 'teacher' ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" :
                                                    "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800")}>
                                                    {role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : role === 'teacher' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                                    {role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-center gap-1.5" title={`Level ${user.level}`}>
                                                    <LevelIcon level={user.level} className="w-4 h-4 text-amber-500" /> Lv.{user.level}
                                                </p>
                                                <p className="text-xs text-slate-500 font-medium">{user.xp.toLocaleString()} XP</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                                    Aktif
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowFilterModal(false)} />
                    <div className="fixed top-32 right-4 md:right-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 border border-slate-200 dark:border-slate-800 overflow-hidden w-full max-w-xs">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filter Berdasarkan Role
                            </h3>
                            <button onClick={() => setShowFilterModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-3 space-y-2">
                            {[
                                { value: '', label: '✨ Semua Role' },
                                { value: 'student', label: '👨‍🎓 Siswa' },
                                { value: 'teacher', label: '👨‍🏫 Guru' },
                                { value: 'admin', label: '🛡️ Admin' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setRoleFilter(option.value)
                                        setShowFilterModal(false)
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-semibold",
                                        roleFilter === option.value
                                            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-2 border-violet-500"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-transparent"
                                    )}
                                >
                                    <span className="text-lg">{option.label.split(' ')[0]}</span>
                                    <span>{option.label.split(' ').slice(1).join(' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    )
}
