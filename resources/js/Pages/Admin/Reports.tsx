import React, { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { BarChart3, Download, FileText, Users, BookOpen, Trophy, TrendingUp, Filter, X, Eye, DownloadCloud, FileJson } from 'lucide-react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import { cn } from '@/lib/utils'

interface FilterOptions {
    categories: Array<{ id: number; name: string }>
    classes: Array<{ id: number; name: string }>
    roles: string[]
}

interface ReportData {
    [key: string]: any[]
}

export default function Reports({ students, quizzes, classes, categories }: any) {
    const [activeReport, setActiveReport] = useState('student-performance')
    const [loading, setLoading] = useState(false)
    const [reportData, setReportData] = useState<ReportData>({})
    const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [lastAppliedReport, setLastAppliedReport] = useState('student-performance')

    // Filter states
    const [filters, setFilters] = useState({
        class_id: '',
        category_id: '',
        role: '',
    })
    const [appliedFilters, setAppliedFilters] = useState({
        class_id: '',
        category_id: '',
        role: '',
    })

    // Report definitions
    const reports = [
        {
            id: 'student-performance',
            name: 'Performa Siswa',
            description: 'Laporan detail performa setiap siswa',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            endpoint: '/admin/reports/student-performance',
            hasFilters: ['class_id', 'category_id'],
            fields: [
                { key: 'name', label: 'Nama Siswa' },
                { key: 'email', label: 'Email' },
                { key: 'level', label: 'Level' },
                { key: 'xp', label: 'XP' },
                { key: 'total_attempts', label: 'Total Attempt' },
                { key: 'avg_score', label: 'Rata-rata Skor' },
                { key: 'pass_count', label: 'Jumlah Lulus' },
                { key: 'pass_rate', label: 'Pass Rate' },
            ],
        },
        {
            id: 'quiz-analytics',
            name: 'Analitik Quiz',
            description: 'Statistik performa setiap quiz',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600',
            endpoint: '/admin/reports/quiz-analytics',
            hasFilters: ['category_id'],
            fields: [
                { key: 'title', label: 'Judul Quiz' },
                { key: 'category', label: 'Kategori' },
                { key: 'questions_count', label: 'Jumlah Soal' },
                { key: 'total_attempts', label: 'Total Attempt' },
                { key: 'avg_score', label: 'Rata-rata Skor' },
                { key: 'pass_count', label: 'Jumlah Lulus' },
                { key: 'pass_rate', label: 'Pass Rate' },
            ],
        },
        {
            id: 'class',
            name: 'Laporan Kelas',
            description: 'Performa dan statistik per kelas',
            icon: BookOpen,
            color: 'from-green-500 to-green-600',
            endpoint: '/admin/reports/class',
            hasFilters: ['class_id'],
            fields: [
                { key: 'name', label: 'Nama Kelas' },
                { key: 'code', label: 'Kode Kelas' },
                { key: 'teacher', label: 'Guru Pembimbing' },
                { key: 'student_count', label: 'Jumlah Siswa' },
                { key: 'avg_score', label: 'Rata-rata Skor' },
                { key: 'avg_level', label: 'Rata-rata Level' },
            ],
        },
        {
            id: 'achievement',
            name: 'Pencapaian & Streak',
            description: 'Laporan pengguna dengan achievement terbanyak',
            icon: Trophy,
            color: 'from-amber-500 to-amber-600',
            endpoint: '/admin/reports/achievement',
            hasFilters: [],
            fields: [
                { key: 'name', label: 'Nama Siswa' },
                { key: 'email', label: 'Email' },
                { key: 'level', label: 'Level' },
                { key: 'xp', label: 'XP' },
                { key: 'achievements_count', label: 'Jumlah Achievement' },
                { key: 'current_streak', label: 'Streak Saat Ini' },
            ],
        },
        {
            id: 'user-activity',
            name: 'Aktivitas Pengguna',
            description: 'Laporan aktivitas dan engagement pengguna',
            icon: TrendingUp,
            color: 'from-pink-500 to-pink-600',
            endpoint: '/admin/reports/user-activity',
            hasFilters: ['role'],
            fields: [
                { key: 'name', label: 'Nama' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'total_attempts', label: 'Total Attempt' },
                { key: 'last_activity', label: 'Aktivitas Terakhir' },
            ],
        },
        {
            id: 'leaderboard',
            name: 'Leaderboard',
            description: 'Top 100 siswa berdasarkan XP',
            icon: Trophy,
            color: 'from-red-500 to-red-600',
            endpoint: '/admin/reports/leaderboard',
            hasFilters: [],
            fields: [
                { key: 'rank', label: 'Peringkat' },
                { key: 'name', label: 'Nama Siswa' },
                { key: 'email', label: 'Email' },
                { key: 'level', label: 'Level' },
                { key: 'xp', label: 'XP' },
                { key: 'attempts', label: 'Total Attempt' },
            ],
        },
    ]

    const currentReport = reports.find((r) => r.id === activeReport)

    // Fetch filter options
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await fetch('/admin/reports/filter-options')
                const data = await res.json()
                setFilterOptions(data)
            } catch (err) {
                console.error('Failed to fetch filter options:', err)
            }
        }
        fetchFilterOptions()
    }, [])

    const fetchReportData = async (report = currentReport, nextFilters = appliedFilters) => {
        if (!report) return

        setLoading(true)
        try {
            const params = new URLSearchParams()
            report.hasFilters.forEach((filter) => {
                if (nextFilters[filter as keyof typeof nextFilters]) {
                    params.append(filter, nextFilters[filter as keyof typeof nextFilters])
                }
            })

            const res = await fetch(`${report.endpoint}?${params.toString()}`)
            const data = await res.json()
            setReportData((prev) => ({ ...prev, [report.id]: data }))
            setLastAppliedReport(report.id)
            setShowPreview(true)
        } catch (err) {
            console.error('Failed to fetch report data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReportData(currentReport, appliedFilters)
    }, [])

    const updateFilter = (field: keyof typeof filters, value: string) => {
        const nextFilters = { ...filters, [field]: value }
        setAppliedFilters(nextFilters)
        setFilters(nextFilters)
        fetchReportData(currentReport, nextFilters)
    }

    const resetFilters = () => {
        const emptyFilters = {
            class_id: '',
            category_id: '',
            role: '',
        }

        setFilters(emptyFilters)
        setAppliedFilters(emptyFilters)
        fetchReportData(currentReport, emptyFilters)
    }

    const getExportUrl = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams()
        currentReport?.hasFilters.forEach((filter) => {
            if (appliedFilters[filter as keyof typeof appliedFilters]) {
                params.append(filter, appliedFilters[filter as keyof typeof appliedFilters])
            }
        })

        const exportEndpoint =
            format === 'excel'
                ? `${currentReport?.endpoint.replace('/admin/reports', '/admin/reports')}/export-excel`
                : `${currentReport?.endpoint.replace('/admin/reports', '/admin/reports')}/export-pdf`

        return `${exportEndpoint}?${params.toString()}`
    }

    const data = lastAppliedReport === activeReport ? (reportData[activeReport] || []) : []
    const hasExportableData = data.length > 0
    const exportLinkClass = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200'
    const disabledExportClass = 'pointer-events-none opacity-60 cursor-not-allowed'

    return (
        <AppLayout title="Laporan & Statistik">
            <div className="space-y-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Total Siswa</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{students}</p>
                            </div>
                            <Users className="w-12 h-12 text-blue-200 dark:text-blue-800" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Total Quiz</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">{quizzes}</p>
                            </div>
                            <BarChart3 className="w-12 h-12 text-purple-200 dark:text-purple-800" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Total Kelas</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{classes}</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-green-200 dark:text-green-800" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Total Kategori</p>
                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">{categories}</p>
                            </div>
                            <FileText className="w-12 h-12 text-amber-200 dark:text-amber-800" />
                        </div>
                    </div>
                </div>

                {/* Report Selection */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pilih Laporan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => {
                            const Icon = report.icon
                            return (
                                <button
                                    key={report.id}
                                    onClick={() => {
                                        setActiveReport(report.id)
                                        setShowPreview(false)
                                        fetchReportData(report, appliedFilters)
                                    }}
                                    className={cn(
                                        'p-6 rounded-2xl border-2 text-left transition-all',
                                        activeReport === report.id
                                            ? `bg-gradient-to-br ${report.color} border-transparent text-white shadow-lg`
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-white'
                                    )}
                                >
                                    <Icon className="w-8 h-8 mb-3" />
                                    <h3 className="font-bold text-lg mb-1">{report.name}</h3>
                                    <p className={cn('text-sm', activeReport === report.id ? 'opacity-90' : 'text-slate-500 dark:text-slate-400')}>
                                        {report.description}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Filters */}
                {currentReport && currentReport.hasFilters.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Filter className="w-5 h-5" /> Filter Laporan
                            </h3>
                            {showFilters && (
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {showFilters && filterOptions && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {currentReport.hasFilters.includes('class_id') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kelas</label>
                                        <select
                                            value={filters.class_id}
                                            onChange={(e) => updateFilter('class_id', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                                        >
                                            <option value="">Semua Kelas</option>
                                            {filterOptions.classes.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {currentReport.hasFilters.includes('category_id') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                                        <select
                                            value={filters.category_id}
                                            onChange={(e) => updateFilter('category_id', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                                        >
                                            <option value="">Semua Kategori</option>
                                            {filterOptions.categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {currentReport.hasFilters.includes('role') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                                        <select
                                            value={filters.role}
                                            onChange={(e) => updateFilter('role', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 outline-none"
                                        >
                                            <option value="">Semua Role</option>
                                            {filterOptions.roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        disabled={loading}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="mt-4 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-semibold transition-colors"
                        >
                            {showFilters ? 'Tutup Filter' : 'Buka Filter'}
                        </button>
                    </div>
                )}

                {/* Export Buttons */}
                {currentReport && (
                    <div className="flex gap-3 flex-wrap">
                        <a
                            href={getExportUrl('excel')}
                            className={cn(
                                exportLinkClass,
                                'bg-green-500 hover:bg-green-600',
                                (loading || !hasExportableData) && disabledExportClass
                            )}
                            aria-disabled={loading || !hasExportableData}
                        >
                            <Download className="w-4 h-4" /> Export ke Excel
                        </a>
                        {currentReport.id !== 'class' && currentReport.id !== 'achievement' && (
                            <a
                                href={getExportUrl('pdf')}
                                className={cn(
                                    exportLinkClass,
                                    'bg-red-500 hover:bg-red-600',
                                    (loading || !hasExportableData) && disabledExportClass
                                )}
                                aria-disabled={loading || !hasExportableData}
                            >
                                <FileJson className="w-4 h-4" /> Export ke PDF
                            </a>
                        )}
                        <Button
                            onClick={() => setShowPreview(!showPreview)}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" /> {showPreview ? 'Sembunyikan' : 'Tampilkan'} Preview
                        </Button>
                    </div>
                )}

                {/* Data Preview */}
                {showPreview && currentReport && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preview Data - {currentReport.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total: {data.length} baris</p>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading data...</p>
                            </div>
                        ) : data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                            {currentReport.fields.map((field) => (
                                                <th
                                                    key={field.key}
                                                    className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white"
                                                >
                                                    {field.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.slice(0, 20).map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                {currentReport.fields.map((field) => (
                                                    <td key={field.key} className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                        {row[field.key] ?? '-'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data.length > 20 && <div className="p-4 bg-slate-50 dark:bg-slate-800 text-center text-sm text-slate-500">Menampilkan 20 dari {data.length} baris</div>}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">Tidak ada data untuk laporan ini</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
