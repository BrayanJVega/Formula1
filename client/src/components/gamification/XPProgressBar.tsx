import { clsx } from 'clsx';

interface XPProgressBarProps {
  currentXp: number;
  xpForCurrentLevel: number;
  xpToNextLevel: number;
  progress: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPProgressBar({
  currentXp,
  xpForCurrentLevel: _xpForCurrentLevel,
  xpToNextLevel,
  progress,
  animate = true,
  size = 'md',
}: XPProgressBarProps) {
  const height = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      <div className={clsx('w-full rounded-full bg-gray-700 overflow-hidden', height[size])}>
        <div
          className={clsx(
            'h-full rounded-full bg-gradient-to-r from-f1-red to-red-400',
            animate && 'transition-all duration-1000 ease-out',
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">
          {currentXp.toLocaleString()} XP
        </span>
        <span className="text-xs text-gray-500">
          {xpToNextLevel > 0
            ? `${xpToNextLevel.toLocaleString()} XP para el siguiente nivel`
            : 'Nivel máximo alcanzado'}
        </span>
      </div>
    </div>
  );
}
