import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
    return xp.toString()
}

export function getLevelColor(level: number): string {
    const colors: Record<number, string> = {
        1:  'text-slate-500',
        2:  'text-blue-500',
        3:  'text-indigo-500',
        4:  'text-yellow-500',
        5:  'text-cyan-500',
        6:  'text-orange-500',
        7:  'text-red-500',
        8:  'text-purple-500',
        9:  'text-violet-500',
        10: 'text-amber-400',
    }
    return colors[level] ?? 'text-slate-400'
}

export function getLevelEmoji(level: number): string {
    const emojis: Record<number, string> = {
        1: '🌱', 2: '📚', 3: '🎓', 4: '⭐', 5: '💎',
        6: '👑', 7: '🔥', 8: '🌟', 9: '⚡', 10: '🏆',
    }
    return emojis[level] ?? '🌱'
}

export function getLevelName(level: number): string {
    const names: Record<number, string> = {
        1: 'Pemula', 2: 'Pelajar', 3: 'Cendekia', 4: 'Ahli',
        5: 'Master', 6: 'Grandmaster', 7: 'Legend', 8: 'Mythic',
        9: 'Divine', 10: 'Immortal',
    }
    return names[level] ?? 'Pemula'
}

export function getXPForLevel(level: number): number {
    const xp: Record<number, number> = {
        1: 0, 2: 100, 3: 300, 4: 600, 5: 1000,
        6: 1500, 7: 2500, 8: 4000, 9: 6000, 10: 10000,
    }
    return xp[level] ?? 0
}

export function getXPProgress(currentXP: number, level: number): number {
    const current = getXPForLevel(level)
    const next    = getXPForLevel(level + 1)
    if (!next) return 100
    return Math.min(100, Math.floor(((currentXP - current) / (next - current)) * 100))
}

export function getDifficultyBadge(difficulty: string) {
    const map: Record<string, { label: string; color: string }> = {
        easy:   { label: '🟢 Mudah',   color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        medium: { label: '🟡 Sedang',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        hard:   { label: '🔴 Sulit',   color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        mixed:  { label: '🎨 Campuran',color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    }
    return map[difficulty] ?? map.medium
}

export function getQuestionTypeLabel(type: string): string {
    const map: Record<string, string> = {
        multiple_choice: 'Pilihan Ganda',
        true_false:      'Benar/Salah',
        essay:           'Essay',
        fill_blank:      'Isian Singkat',
        matching:        'Menjodohkan',
    }
    return map[type] ?? type
}

export function getRarityColor(rarity: string): string {
    const map: Record<string, string> = {
        common:    'text-slate-500',
        rare:      'text-blue-500',
        epic:      'text-purple-500',
        legendary: 'text-amber-500',
    }
    return map[rarity] ?? 'text-slate-400'
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function avatarUrl(name: string, avatar?: string | null): string {
    if (avatar) return `/storage/${avatar}`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=128&bold=true`
}
