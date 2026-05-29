import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { RaceCard } from './RaceCard';
function formatMonth(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    });
}
export function RaceCalendar({ races, nextRaceId }) {
    const grouped = useMemo(() => {
        const groups = {};
        for (const race of races) {
            const key = formatMonth(race.raceDate);
            if (!groups[key])
                groups[key] = [];
            groups[key].push(race);
        }
        return Object.entries(groups).map(([month, monthRaces]) => ({
            month,
            races: monthRaces,
        }));
    }, [races]);
    if (races.length === 0) {
        return (_jsx("div", { className: "text-center py-16", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No se encontraron carreras para esta temporada." }) }));
    }
    return (_jsx("div", { className: "space-y-10", children: grouped.map((group) => (_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-white mb-4 flex items-center gap-3", children: [_jsx("span", { className: "w-1 h-6 bg-f1-red rounded-full" }), group.month] }), _jsx("div", { className: "space-y-3", children: group.races.map((race) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex flex-col items-center w-10", children: [_jsx("div", { className: clsx('w-3 h-3 rounded-full border-2', race.id === nextRaceId
                                            ? 'bg-f1-red border-f1-red'
                                            : 'bg-f1-gray border-gray-600') }), group.races.indexOf(race) < group.races.length - 1 && (_jsx("div", { className: "w-0.5 flex-1 bg-gray-700 mt-1" }))] }), _jsx("div", { className: "flex-1", children: _jsx(RaceCard, { race: race, highlight: race.id === nextRaceId }) })] }, race.id))) })] }, group.month))) }));
}
//# sourceMappingURL=RaceCalendar.js.map