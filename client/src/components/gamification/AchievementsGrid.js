import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AchievementCard } from './AchievementCard';
export function AchievementsGrid({ achievements }) {
    const unlocked = achievements.filter((a) => a.isUnlocked);
    const locked = achievements.filter((a) => !a.isUnlocked);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Logros" }), _jsxs("span", { className: "text-sm text-gray-400", children: [unlocked.length, " / ", achievements.length, " desbloqueados"] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [unlocked.map((achievement) => (_jsx(AchievementCard, { achievement: achievement, isUnlocked: true, unlockedAt: achievement.unlockedAt }, achievement.id))), locked.map((achievement) => (_jsx(AchievementCard, { achievement: achievement, isUnlocked: false }, achievement.id)))] })] }));
}
//# sourceMappingURL=AchievementsGrid.js.map