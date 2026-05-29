import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
export function XPProgressBar({ currentXp, xpForCurrentLevel: _xpForCurrentLevel, xpToNextLevel, progress, animate = true, size = 'md', }) {
    const height = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: clsx('w-full rounded-full bg-gray-700 overflow-hidden', height[size]), children: _jsx("div", { className: clsx('h-full rounded-full bg-gradient-to-r from-f1-red to-red-400', animate && 'transition-all duration-1000 ease-out'), style: { width: `${Math.min(progress, 100)}%` } }) }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsxs("span", { className: "text-xs text-gray-400", children: [currentXp.toLocaleString(), " XP"] }), _jsx("span", { className: "text-xs text-gray-500", children: xpToNextLevel > 0
                            ? `${xpToNextLevel.toLocaleString()} XP para el siguiente nivel`
                            : 'Nivel máximo alcanzado' })] })] }));
}
//# sourceMappingURL=XPProgressBar.js.map