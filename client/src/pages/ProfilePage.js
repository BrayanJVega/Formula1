import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return (_jsx("div", { className: "max-w-5xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "max-w-5xl mx-auto px-4 py-8", children: _jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4", children: _jsx("p", { className: "text-red-400", children: error }) }) }));
    }
    if (!profile)
        return null;
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Mi Perfil" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Tu resumen de gamificaci\u00F3n y logros" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsx(LevelBadge, { level: profile.level.level, currentXp: profile.level.currentXp, progress: profile.level.progress, size: "lg" }), _jsx("div", { className: "mt-4", children: _jsx(XPProgressBar, { currentXp: profile.level.currentXp, xpForCurrentLevel: profile.level.xpForCurrentLevel, xpToNextLevel: profile.level.xpToNextLevel, progress: profile.level.progress, size: "md" }) })] }), _jsx(Card, { children: _jsx(StreakDisplay, { streaks: profile.streaks, size: "md" }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8", children: [_jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Trophy, { className: "w-8 h-8 text-yellow-500" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-white", children: profile.unlockedAchievements }), _jsxs("div", { className: "text-sm text-gray-400", children: ["/ ", profile.totalAchievements, " Logros"] })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Zap, { className: "w-8 h-8 text-f1-red" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-white", children: profile.streaks.bestStreak }), _jsx("div", { className: "text-sm text-gray-400", children: "Mejor Racha" })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Activity, { className: "w-8 h-8 text-blue-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-white", children: profile.level.level.levelNumber }), _jsx("div", { className: "text-sm text-gray-400", children: "Nivel Actual" })] })] }) })] }), profile.recentActivity.length > 0 && (_jsxs(Card, { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Actividad Reciente" }), _jsx("div", { className: "space-y-3", children: profile.recentActivity.slice(0, 10).map((activity, i) => (_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("span", { className: `
                  w-2 h-2 rounded-full shrink-0
                  ${activity.type === 'achievement' ? 'bg-yellow-400' : ''}
                  ${activity.type === 'xp' ? 'bg-blue-400' : ''}
                  ${activity.type === 'streak' ? 'bg-orange-400' : ''}
                  ${activity.type === 'level_up' ? 'bg-green-400' : ''}
                ` }), _jsx("span", { className: "text-gray-300 flex-1", children: activity.description }), activity.points !== undefined && (_jsxs("span", { className: "text-f1-red font-medium", children: ["+", activity.points, " XP"] })), _jsx("span", { className: "text-gray-500 text-xs", children: formatDate(activity.createdAt) })] }, i))) })] })), _jsx(AchievementsGrid, { achievements: achievements })] }));
}
//# sourceMappingURL=ProfilePage.js.map