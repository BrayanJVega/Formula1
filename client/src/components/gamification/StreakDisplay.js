import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Flame, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
export function StreakDisplay({ streaks, size = 'md' }) {
    const fireSize = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
    const textSize = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
    const labelSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
    const hasStreak = streaks.currentStreak > 0;
    return (_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Flame, { className: clsx(fireSize[size], hasStreak ? 'text-orange-400' : 'text-gray-600', hasStreak && 'animate-pulse') }), _jsxs("div", { children: [_jsx("div", { className: clsx('font-bold text-white', textSize[size]), children: streaks.currentStreak }), _jsx("div", { className: clsx('text-gray-500', labelSize[size]), children: "Racha Actual" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Trophy, { className: clsx(fireSize[size], 'text-yellow-500') }), _jsxs("div", { children: [_jsx("div", { className: clsx('font-bold text-white', textSize[size]), children: streaks.bestStreak }), _jsx("div", { className: clsx('text-gray-500', labelSize[size]), children: "Mejor Racha" })] })] })] }));
}
//# sourceMappingURL=StreakDisplay.js.map