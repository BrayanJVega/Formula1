import { clsx } from 'clsx';
import { Trophy, Star, Award, Zap, Target, Crown } from 'lucide-react';
import type { Level } from '../../types/gamification.types';

interface LevelBadgeProps {
  level: Level;
  currentXp: number;
  progress: number;
  size?: 'sm' | 'md' | 'lg';
}

const levelIcons: Record<number, typeof Trophy> = {
  1: Target,
  2: Target,
  3: Target,
  4: Zap,
  5: Zap,
  6: Zap,
  7: Star,
  8: Star,
  9: Star,
  10: Award,
  11: Award,
  12: Crown,
  13: Crown,
};

const levelColors: Record<number, string> = {
  1: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
  2: 'text-gray-300 border-gray-400/30 bg-gray-400/10',
  3: 'text-gray-200 border-gray-300/30 bg-gray-300/10',
  4: 'text-green-400 border-green-500/30 bg-green-500/10',
  5: 'text-green-300 border-green-400/30 bg-green-400/10',
  6: 'text-green-200 border-green-300/30 bg-green-300/10',
  7: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  8: 'text-blue-300 border-blue-400/30 bg-blue-400/10',
  9: 'text-blue-200 border-blue-300/30 bg-blue-300/10',
  10: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  11: 'text-purple-300 border-purple-400/30 bg-purple-400/10',
  12: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  13: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
};

export function LevelBadge({ level, currentXp, progress: _progress, size = 'md' }: LevelBadgeProps) {
  const Icon = levelIcons[level.levelNumber] || Trophy;

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const labelSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-4">
      <div className={clsx(
        'rounded-xl border-2 flex items-center justify-center shrink-0',
        levelColors[level.levelNumber] || 'text-gray-400 border-gray-500/30',
        sizeClasses[size],
      )}>
        <Icon className="w-1/2 h-1/2" />
      </div>
      <div className="min-w-0">
        <div className={clsx('font-bold text-white truncate', labelSize[size])}>
          {level.name}
        </div>
        <div className={clsx('text-gray-400', size === 'sm' ? 'text-xs' : 'text-sm')}>
          Nivel {level.levelNumber}
        </div>
        <div className={clsx('text-gray-500', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {currentXp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}
