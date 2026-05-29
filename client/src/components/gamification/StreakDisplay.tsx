import { Flame, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import type { Streak } from '../../types/gamification.types';

interface StreakDisplayProps {
  streaks: Streak;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakDisplay({ streaks, size = 'md' }: StreakDisplayProps) {
  const fireSize = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const textSize = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  const labelSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  const hasStreak = streaks.currentStreak > 0;

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Flame
          className={clsx(
            fireSize[size],
            hasStreak ? 'text-orange-400' : 'text-gray-600',
            hasStreak && 'animate-pulse',
          )}
        />
        <div>
          <div className={clsx('font-bold text-white', textSize[size])}>
            {streaks.currentStreak}
          </div>
          <div className={clsx('text-gray-500', labelSize[size])}>
            Racha Actual
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Trophy className={clsx(fireSize[size], 'text-yellow-500')} />
        <div>
          <div className={clsx('font-bold text-white', textSize[size])}>
            {streaks.bestStreak}
          </div>
          <div className={clsx('text-gray-500', labelSize[size])}>
            Mejor Racha
          </div>
        </div>
      </div>
    </div>
  );
}
