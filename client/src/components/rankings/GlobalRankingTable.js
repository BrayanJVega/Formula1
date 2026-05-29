import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRankingStore } from '../../store/ranking.store';
import { getFlagEmoji } from '../../utils/flags';
import { Spinner } from '../ui/Spinner';
import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export function GlobalRankingTable() {
    const { globalRankings, pagination, isLoading, error, fetchGlobalRankings } = useRankingStore();
    useEffect(() => {
        fetchGlobalRankings();
    }, [fetchGlobalRankings]);
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return _jsx("div", { className: "text-center py-8 text-red-400", children: error });
    }
    if (globalRankings.length === 0) {
        return _jsx("div", { className: "text-center py-8 text-gray-400", children: "No hay clasificaciones disponibles." });
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Pos" }), _jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Usuario" }), _jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Pa\u00EDs" }), _jsx("th", { className: "text-right py-3 px-4 text-gray-400 text-sm font-medium", children: "Puntos" }), _jsx("th", { className: "text-center py-3 px-4 text-gray-400 text-sm font-medium", children: "Cambio" })] }) }), _jsx("tbody", { children: globalRankings.map((entry) => (_jsxs("tr", { className: "border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5 transition-colors", children: [_jsx("td", { className: "py-3 px-4", children: _jsxs("span", { className: `font-bold ${entry.position <= 3 ? 'text-f1-red' : 'text-white'}`, children: ["#", entry.position] }) }), _jsx("td", { className: "py-3 px-4 text-white font-medium", children: entry.username }), _jsx("td", { className: "py-3 px-4 text-gray-300", children: entry.country ? (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-lg", children: getFlagEmoji(entry.country) }), _jsx("span", { className: "text-sm", children: entry.country })] })) : (_jsx("span", { className: "text-gray-500", children: "\u2014" })) }), _jsx("td", { className: "py-3 px-4 text-right text-white font-semibold", children: entry.score.toFixed(1) }), _jsx("td", { className: "py-3 px-4 text-center", children: entry.change !== undefined && entry.change !== 0 ? (_jsxs("span", { className: `inline-flex items-center gap-1 text-sm ${entry.change > 0 ? 'text-green-400' : 'text-red-400'}`, children: [entry.change > 0 ? _jsx(TrendingUp, { size: 14 }) : _jsx(TrendingDown, { size: 14 }), Math.abs(entry.change)] })) : (_jsx("span", { className: "text-gray-500 inline-flex items-center", children: _jsx(Minus, { size: 14 }) })) })] }, entry.userId))) })] }) }), _jsx("div", { className: "flex items-center justify-between px-4 py-3 text-sm text-gray-400", children: _jsxs("span", { children: ["Mostrando ", globalRankings.length, " de ", pagination.total, " entradas"] }) })] }));
}
//# sourceMappingURL=GlobalRankingTable.js.map