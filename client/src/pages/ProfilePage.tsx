import { useEffect } from 'react';
import { useGamificationStore } from '../store/gamification.store';
import { LevelBadge } from '../components/gamification/LevelBadge';
import { XPProgressBar } from '../components/gamification/XPProgressBar';
import { AchievementsGrid } from '../components/gamification/AchievementsGrid';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../utils/formatters';
import { Trophy, Activity, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { profile, achievements, isLoading, error, fetchProfile, fetchAchievements } = useGamificationStore();

  useEffect(() => {
    fetchProfile();
    fetchAchievements();
  }, [fetchProfile, fetchAchievements]);

  if (isLoading && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-gray-400 mt-1">Tu resumen de gamificación y logros</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <LevelBadge
            level={profile.level.level}
            currentXp={profile.level.currentXp}
            progress={profile.level.progress}
            size="lg"
          />
          <div className="mt-4">
            <XPProgressBar
              currentXp={profile.level.currentXp}
              xpForCurrentLevel={profile.level.xpForCurrentLevel}
              xpToNextLevel={profile.level.xpToNextLevel}
              progress={profile.level.progress}
              size="md"
            />
          </div>
        </Card>

        <Card>
          <StreakDisplay streaks={profile.streaks} size="md" />
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-white">
                {profile.unlockedAchievements}
              </div>
              <div className="text-sm text-gray-400">
                / {profile.totalAchievements} Logros
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-f1-red" />
            <div>
              <div className="text-2xl font-bold text-white">
                {profile.streaks.bestStreak}
              </div>
              <div className="text-sm text-gray-400">Mejor Racha</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {profile.level.level.levelNumber}
              </div>
              <div className="text-sm text-gray-400">Nivel Actual</div>
            </div>
          </div>
        </Card>
      </div>

      {profile.recentActivity.length > 0 && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {profile.recentActivity.slice(0, 10).map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`
                  w-2 h-2 rounded-full shrink-0
                  ${activity.type === 'achievement' ? 'bg-yellow-400' : ''}
                  ${activity.type === 'xp' ? 'bg-blue-400' : ''}
                  ${activity.type === 'streak' ? 'bg-orange-400' : ''}
                  ${activity.type === 'level_up' ? 'bg-green-400' : ''}
                `} />
                <span className="text-gray-300 flex-1">{activity.description}</span>
                {activity.points !== undefined && (
                  <span className="text-f1-red font-medium">+{activity.points} XP</span>
                )}
                <span className="text-gray-500 text-xs">{formatDate(activity.createdAt)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <AchievementsGrid achievements={achievements} />
    </div>
  );
}
