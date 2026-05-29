import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { Card } from '../ui/Card';
const statusConfig = {
    upcoming: { label: 'Próxima', className: 'bg-yellow-500/20 text-yellow-400' },
    qualifying_complete: { label: 'Clasificación Completada', className: 'bg-blue-500/20 text-blue-400' },
    completed: { label: 'Completada', className: 'bg-green-500/20 text-green-400' },
    cancelled: { label: 'Cancelada', className: 'bg-red-500/20 text-red-400' },
};
function formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
}
export function RaceDetail({ race }) {
    const config = statusConfig[race.status] || statusConfig.upcoming;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-4xl", children: "\uD83C\uDFC1" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["Ronda ", race.round] }), _jsx("h1", { className: "text-3xl font-bold text-white", children: race.name })] })] }), _jsx("span", { className: clsx('inline-block text-xs font-medium px-3 py-1 rounded-full', config.className), children: config.label })] }), _jsxs("span", { className: "text-3xl font-bold text-f1-red", children: ["R", race.round] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-gray-400 text-sm font-medium uppercase tracking-wider mb-3", children: "Circuito" }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-white font-semibold", children: race.circuit.name }), _jsxs("p", { className: "text-gray-400 text-sm", children: [race.circuit.city, ", ", race.circuit.country] }), _jsxs("div", { className: "flex gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Longitud: " }), _jsxs("span", { className: "text-white", children: [race.circuit.lengthKm, " km"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Curvas: " }), _jsx("span", { className: "text-white", children: race.circuit.turns })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Zonas DRS: " }), _jsx("span", { className: "text-white", children: race.circuit.drsZones })] })] }), _jsxs("p", { className: "text-gray-500 text-sm mt-1", children: ["Vueltas: ", race.laps] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-400 text-sm font-medium uppercase tracking-wider mb-3", children: "Horario" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-xs uppercase tracking-wide", children: "Clasificaci\u00F3n" }), _jsx("p", { className: "text-white text-sm", children: formatDateTime(race.qualifyingDate) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-xs uppercase tracking-wide", children: "Carrera" }), _jsx("p", { className: "text-white text-sm", children: formatDateTime(race.raceDate) })] }), _jsxs("p", { className: "text-gray-500 text-xs mt-1", children: ["Zona Horaria: ", race.localTimezone] })] })] })] })] }), race.status === 'completed' && (_jsxs(Card, { children: [_jsx("h3", { className: "text-gray-400 text-sm font-medium uppercase tracking-wider mb-4", children: "Resultados de la Carrera" }), _jsx("div", { className: "flex items-center justify-center h-32 text-gray-500", children: _jsx("p", { children: "Los resultados aparecer\u00E1n aqu\u00ED una vez que la carrera est\u00E9 completada." }) })] }))] }));
}
//# sourceMappingURL=RaceDetail.js.map