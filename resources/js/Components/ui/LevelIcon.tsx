import React from 'react'
import { Sprout, BookOpen, GraduationCap, Star, Diamond, Crown, Flame, Sparkles, Zap, Trophy } from 'lucide-react'

export default function LevelIcon({ level, className }: { level: number, className?: string }) {
    const icons: Record<number, React.ReactNode> = {
        1: <Sprout className={className} />,
        2: <BookOpen className={className} />,
        3: <GraduationCap className={className} />,
        4: <Star className={className} />,
        5: <Diamond className={className} />,
        6: <Crown className={className} />,
        7: <Flame className={className} />,
        8: <Sparkles className={className} />,
        9: <Zap className={className} />,
        10: <Trophy className={className} />,
    }
    
    // Fallback if level is higher than 10
    const IconComponent = icons[level] || <Trophy className={className} />
    return <>{IconComponent}</>
}
