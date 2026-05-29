import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Trophy, Medal, Coins, Repeat } from 'lucide-react';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useFantasyStore } from '../../store/fantasy.store';
export function FantasyStandings({ seasonId }) {
    const { standings, loading, error, fetchStandings } = useFantasyStore();
    useEffect(() => {
        fetchStandings(seasonId);
    }, [seasonId, fetchStandings]);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    const getPositionIcon = (pos) => {
        if (pos === 1)
            return _jsx(Trophy, { className: "w-5 h-5 text-yellow-400" });
        if (pos === 2)
            return _jsx(Medal, { className: "w-5 h-5 text-gray-300" });
        if (pos === 3)
            return _jsx(Medal, { className: "w-5 h-5 text-amber-600" });
        return _jsx("span", { className: "w-5 h-5 flex items-center justify-center text-gray-500 font-bold text-sm", children: pos });
    };
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Clasificaci\u00F3n Fant\u00E1stica" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("th", { className: "text-left pb-3 w-10" }), _jsx("th", { className: "text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: "Equipo" }), _jsxs("th", { className: "text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: [_jsx(Trophy, { className: "inline w-3 h-3 mr-1" }), "Puntos"] }), _jsxs("th", { className: "text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: [_jsx(Coins, { className: "inline w-3 h-3 mr-1" }), "Valor"] }), _jsxs("th", { className: "text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: [_jsx(Repeat, { className: "inline w-3 h-3 mr-1" }), "Transferencias"] })] }) }), _jsxs("tbody", { className: "divide-y divide-f1-gray-light/10", children: [standings.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-8 text-gray-500", children: "No hay clasificaciones disponibles" }) })), standings.map((entry) => (_jsxs("tr", { className: "hover:bg-f1-gray-dark/50 transition-colors", children: [_jsx("td", { className: "py-3", children: getPositionIcon(entry.position) }), _jsx("td", { className: "py-3", children: _jsx("span", { className: "text-white font-medium", children: entry.teamName }) }), _jsx("td", { className: "py-3 text-right", children: _jsx("span", { className: "text-f1-red font-bold", children: entry.totalScore.toFixed(1) }) }), _jsxs("td", { className: "py-3 text-right text-yellow-400 font-semibold", children: [entry.totalValue.toFixed(1), "M"] }), _jsx("td", { className: "py-3 text-right text-gray-400", children: entry.transfersCount })] }, entry.teamId)))] })] }) })] }));
}
//# sourceMappingURL=FantasyStandings.js.map