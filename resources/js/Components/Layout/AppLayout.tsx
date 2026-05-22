import React, { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home, BookOpen, Trophy, Users, Settings, LogOut, Bell,
    Moon, Sun, Search, ChevronDown, Menu, X, Zap, Info,
    BarChart2, PlusCircle, School, Award, History, Star,
    Shield, ClipboardList, Tag, Megaphone, CheckCircle2,
    GraduationCap, Edit3, Library, Activity, Gamepad2,
    AlertTriangle, AlertCircle
} from 'lucide-react'
import { cn, getLevelEmoji, getLevelName, getXPProgress, avatarUrl, formatXP } from '@/lib/utils'
import LevelIcon from '@/Components/ui/LevelIcon'
import ParticleBackground from '@/Components/ui/ParticleBackground'
import type { Announcement, PageProps } from '@/types'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
    badge?: number | string
}

function getNavItems(role: string, pendingEssays = 0): NavItem[] {
    if (role === 'admin') return [
        { label: 'Dashboard',    href: '/admin/dashboard',     icon: Home },
        { label: 'Kelola User',  href: '/admin/users',         icon: Users },
        { label: 'Semua Quiz',   href: '/admin/quizzes',       icon: BookOpen },
        { label: 'Kategori',     href: '/admin/categories',    icon: Tag },
        { label: 'Pengumuman',   href: '/admin/announcements', icon: Megaphone },
        { label: 'Laporan',      href: '/admin/reports',       icon: BarChart2 },
        { label: 'Log Aktivitas',href: '/admin/logs',          icon: Activity },
        { label: 'Pengaturan',   href: '/admin/settings',      icon: Settings },
    ]
    if (role === 'teacher') return [
        { label: 'Dashboard',    href: '/teacher/dashboard',    icon: Home },
        { label: 'Quiz Saya',    href: '/teacher/quizzes',      icon: BookOpen },
        { label: 'Buat Quiz',    href: '/teacher/quizzes/create', icon: PlusCircle },
        { label: 'Kelas Saya',   href: '/teacher/classes',      icon: School },
        { label: 'Bank Soal',    href: '/teacher/question-bank',icon: Library },
        { label: 'Nilai Essay',  href: '/teacher/grading',      icon: Edit3, badge: pendingEssays > 0 ? pendingEssays : undefined },
        { label: 'Analitik',     href: '/teacher/analytics',    icon: BarChart2 },
    ]
    return [
        { label: 'Dashboard',    href: '/student/dashboard',   icon: Home },
        { label: 'Kelas Saya',   href: '/student/classes',     icon: GraduationCap },
        { label: 'Jelajahi Quiz',href: '/quiz/explore',        icon: Search },
        { label: 'Riwayat',      href: '/student/history',     icon: History },
        { label: 'Leaderboard',  href: '/student/leaderboard', icon: Trophy },
        { label: 'Pencapaian',   href: '/student/achievements',icon: Award },
    ]
}

interface AppLayoutProps {
    children: React.ReactNode
    title?: string
    subtitle?: string
}

function formatRelativeTime(dateValue?: string) {
    if (!dateValue) return ''

    const date = new Date(dateValue)
    const diffInSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))

    if (Number.isNaN(date.getTime())) return dateValue
    if (diffInSeconds < 5) return 'Baru saja'
    if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} jam lalu`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} hari lalu`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} minggu lalu`

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths} bulan lalu`

    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} tahun lalu`
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
    const { auth, flash, notifications = [] } = usePage<PageProps>().props
    const user = auth.user
    const role = user.roles?.[0]?.name ?? 'student'
    const visibleNotifications = notifications as Announcement[]

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
        return false
    })
    const [notifOpen, setNotifOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [, setTimeTick] = useState(0)
    const notificationRef = React.useRef<HTMLDivElement>(null)

    const notificationMeta: Record<Announcement['type'], { icon: React.ElementType; className: string }> = {
        info: {
            icon: Info,
            className: 'text-blue-600 bg-blue-50 ring-blue-100 dark:text-blue-300 dark:bg-blue-900/30 dark:ring-blue-800/60',
        },
        success: {
            icon: CheckCircle2,
            className: 'text-emerald-600 bg-emerald-50 ring-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 dark:ring-emerald-800/60',
        },
        warning: {
            icon: AlertTriangle,
            className: 'text-amber-600 bg-amber-50 ring-amber-100 dark:text-amber-300 dark:bg-amber-900/30 dark:ring-amber-800/60',
        },
        danger: {
            icon: AlertCircle,
            className: 'text-red-600 bg-red-50 ring-red-100 dark:text-red-300 dark:bg-red-900/30 dark:ring-red-800/60',
        },
    }

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [dark])

    useEffect(() => {
        if (flash?.success) {
            import('react-hot-toast').then(({ default: toast }) => toast.success(flash.success!))
        }
        if (flash?.error) {
            import('react-hot-toast').then(({ default: toast }) => toast.error(flash.error!))
        }
    }, [flash])

    useEffect(() => {
        if (!notifOpen) return

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!notificationRef.current?.contains(event.target as Node)) {
                setNotifOpen(false)
            }
        }

        document.addEventListener('mousedown', closeOnOutsideClick)

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick)
        }
    }, [notifOpen])

    useEffect(() => {
        const timer = window.setInterval(() => setTimeTick((tick) => tick + 1), 15000)

        return () => {
            window.clearInterval(timer)
        }
    }, [])

    const navItems = getNavItems(role)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isAdmin = role === 'admin'

    const xpProgress = getXPProgress(user.xp, user.level)
    const levelEmoji = getLevelEmoji(user.level)
    const levelName  = getLevelName(user.level)

    const roleLabel: Record<string, React.ReactNode> = {
        admin: <><Shield className="w-3.5 h-3.5 inline mr-1 text-emerald-500" /> Administrator</>,
        teacher: <><School className="w-3.5 h-3.5 inline mr-1 text-blue-500" /> Guru</>,
        student: <><GraduationCap className="w-3.5 h-3.5 inline mr-1 text-violet-500" /> Murid</>,
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">QuizQuest</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabel[role]}</p>
                </div>
            </div>

            {/* User Card */}
            <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-3">
                    <div className="relative">
                        <img
                            src={user.avatar_url || avatarUrl(user.name, user.avatar)}
                            className="w-10 h-10 rounded-full ring-2 ring-violet-400 object-cover"
                            alt={user.name}
                        />
                        <span className={cn("absolute -bottom-1 -right-1 text-sm bg-white dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow text-amber-500", isAdmin && "hidden")}>
                            <LevelIcon level={user.level} className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                        <div className={cn("flex items-center gap-2 mt-1", isAdmin && "hidden")}>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 xp-bar-fill"
                                    style={{ width: `${xpProgress}%` }}
                                />
                            </div>
                            <span className="text-xs text-violet-600 dark:text-violet-400 font-bold whitespace-nowrap">
                                Lv.{user.level}
                            </span>
                        </div>
                        {isAdmin ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Akun Administrator</p>
                        ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatXP(user.xp)} XP · {levelName}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPath.startsWith(item.href) && item.href !== '/dashboard'
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn('group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300', isActive ? 'bg-violet-50 dark:bg-violet-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50')}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <div className={cn("p-2 rounded-xl transition-all duration-300 flex-shrink-0", isActive ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/40" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 group-hover:scale-110")}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn("flex-1 font-bold text-sm transition-colors", isActive ? "text-violet-700 dark:text-violet-400" : "text-slate-600 dark:text-slate-400 group-hover:text-violet-700 dark:group-hover:text-violet-400")}>{item.label}</span>
                            {item.badge !== undefined && (
                                <span className="bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <button
                    onClick={() => setDark(!dark)}
                    className="sidebar-link w-full"
                >
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{dark ? 'Mode Terang' : 'Mode Gelap'}</span>
                </button>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="sidebar-link w-full !text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
            
            {/* 3D Moving Particle Background */}
            <div className="fixed inset-0 z-0 opacity-45 dark:opacity-70 transition-opacity duration-500 pointer-events-none">
                <ParticleBackground density="subtle" />
                <div className="absolute inset-0 bg-slate-50/85 dark:bg-slate-950/80" />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex-shrink-0 shadow-xl z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl lg:hidden"
                        >
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 h-20 flex items-center gap-4 px-4 md:px-8 flex-shrink-0 shadow-sm z-30 relative">

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title */}
                    <div className="flex-1 hidden md:block">
                        {title && (
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{title}</h2>
                                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">

                        {/* XP Badge */}
                        {!isAdmin && <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 px-3 py-1.5 rounded-xl border border-violet-100 dark:border-violet-800">
                            <Zap className="w-4 h-4 text-violet-500" />
                            <div>
                                <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{formatXP(user.xp)} XP</p>
                                <p className="text-xs text-slate-500 leading-none">Lv.{user.level}</p>
                            </div>
                        </div>}

                        {/* Notifications */}
                        <div ref={notificationRef} className="relative">
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
                            >
                                <Bell className="w-5 h-5" />
                                {visibleNotifications.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {visibleNotifications.length}
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifikasi</h3>
                                            <button className="text-xs text-violet-600 hover:underline" onClick={() => setNotifOpen(false)}>Tutup</button>
                                        </div>
                                        {visibleNotifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center">
                                                <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Belum ada notifikasi</p>
                                                <p className="text-xs text-slate-500 mt-1">Pengumuman aktif akan muncul di sini.</p>
                                            </div>
                                        ) : visibleNotifications.map((n) => {
                                            const meta = notificationMeta[n.type] ?? notificationMeta.info
                                            const NotificationIcon = meta.icon

                                            return (
                                            <div key={n.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                                                <div className="flex items-start gap-3">
                                                    <div className={cn('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1', meta.className)}>
                                                        <NotificationIcon className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                                                        <p className="text-xs text-slate-500 line-clamp-2">{n.content}</p>
                                                        <p className="text-xs text-violet-500 mt-0.5">{formatRelativeTime(n.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-1.5 transition-all"
                            >
                                <img
                                    src={user.avatar_url || avatarUrl(user.name, user.avatar)}
                                    className="w-8 h-8 rounded-full ring-2 ring-violet-400 object-cover"
                                    alt={user.name}
                                />
                                <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', userMenuOpen && 'rotate-180')} />
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                            {isAdmin ? (
                                                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-0.5">Administrator</p>
                                            ) : (
                                                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-0.5 flex items-center gap-1.5">
                                                    <LevelIcon level={user.level} className="w-3.5 h-3.5 text-amber-500" /> {levelName}
                                                </p>
                                            )}
                                        </div>
                                        <Link
                                            href={`/${role}/profile`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Users className="w-4 h-4" /> Profil Saya
                                        </Link>
                                        <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Keluar
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overscroll-contain relative z-10 scroll-smooth [scrollbar-gutter:stable]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPath}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
