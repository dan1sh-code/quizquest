import React, { useEffect, useState } from 'react'
import { getXPForLevel, getXPProgress, getLevelName } from '@/lib/utils'
import LevelIcon from '@/Components/ui/LevelIcon'
import type { User } from '@/types'

interface XPBarProps { user: User; showDetails?: boolean }

export default function XPBar({ user, showDetails = true }: XPBarProps) {
    const [width, setWidth] = useState(0)
    const targetWidth = getXPProgress(user.xp, user.level)
    const nextXP = getXPForLevel(user.level + 1)
    const currentLevelXP = getXPForLevel(user.level)
    const remaining = nextXP ? nextXP - user.xp : 0

    useEffect(() => {
        const t = setTimeout(() => setWidth(targetWidth), 400)
        return () => clearTimeout(t)
    }, [targetWidth])

    return (
        <div className="w-full">
            {showDetails && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <LevelIcon level={user.level} className="w-4 h-4 text-amber-500" /> {getLevelName(user.level)}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <LevelIcon level={user.level + 1} className="w-4 h-4 text-amber-500 opacity-50" /> {getLevelName(user.level + 1)}
                    </span>
                </div>
            )}
            <div className="relative bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${width}%` }}
                >
                    <div className="absolute inset-0 animate-shimmer" />
                </div>
            </div>
            {showDetails && nextXP > 0 && (
                <p className="text-xs text-slate-400 mt-1.5 text-center">
                    {remaining.toLocaleString('id-ID')} XP lagi ke Level {user.level + 1}
                </p>
            )}
        </div>
    )
}
