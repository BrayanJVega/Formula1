import type { Achievement } from '../../types/gamification.types';
import { AchievementCard } from './AchievementCard';

interface AchievementsGridProps {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const unlocked = achievements.filter((a) => a.isUnlocked);
  const locked = achievements.filter((a) => !a.isUnlocked);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Logros</h2>
        <span className="text-sm text-gray-400">
          {unlocked.length} / {achievements.length} desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {unlocked.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={true}
            unlockedAt={achievement.unlockedAt}
          />
        ))}
        {locked.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={false}
          />
        ))}
      </div>
    </div>
  );
}
