import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { Trophy, Target, Zap, Users, Star, Lock, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
const categoryIcons = {
    prediction: Target,
    fantasy: Star,
    streak: Zap,
    social: Users,
    special: Trophy,
};
const categoryColors = {
    prediction: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    fantasy: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    streak: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    social: 'border-green-500/30 bg-green-500/10 text-green-400',
    special: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
};
export function AchievementCard({ achievement, isUnlocked, unlockedAt }) {
    const Icon = categoryIcons[achievement.category] || Trophy;
    return (_jsxs("div", { className: clsx('relative rounded-xl border p-4 transition-all duration-200', isUnlocked
            ? 'bg-f1-gray border-f1-gray-light/30 hover:border-f1-gray-light/50'
            : 'bg-f1-gray/50 border-gray-700/30 opacity-60'), children: [!isUnlocked && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center z-10", children: _jsx(Lock, { className: "w-8 h-8 text-gray-600" }) })), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: clsx('p-2 rounded-lg border', isUnlocked
                            ? categoryColors[achievement.category]
                            : 'border-gray-700/30 bg-gray-800/30 text-gray-600'), children: isUnlocked ? (_jsx(Icon, { className: "w-5 h-5" })) : (_jsx(Icon, { className: "w-5 h-5" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: clsx('font-semibold text-sm truncate', isUnlocked ? 'text-white' : 'text-gray-500'), children: achievement.name }), _jsx("p", { className: clsx('text-xs mt-0.5 line-clamp-2', isUnlocked ? 'text-gray-400' : 'text-gray-600'), children: achievement.description }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsxs("span", { className: "text-xs text-f1-red font-medium", children: ["+", achievement.pointsReward, " XP"] }), isUnlocked && unlockedAt && (_jsx("span", { className: "text-xs text-gray-500", children: formatDate(unlockedAt) }))] })] }), isUnlocked && (_jsx(CheckCircle, { className: "w-4 h-4 text-green-400 shrink-0 mt-1" }))] })] }));
}
//# sourceMappingURL=AchievementCard.js.map