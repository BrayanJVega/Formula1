import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../ui/Card';
const INCIDENT_ICONS = {
    crash: '💥',
    mechanical: '🔧',
    penalty: '⏱',
    spin: '🔄',
    collision: '💢',
};
export function IncidentTimeline({ incidents, safetyCarPeriods, totalLaps }) {
    const allEvents = [
        ...incidents.map(i => ({ lap: i.lap, type: 'incident', data: i })),
        ...safetyCarPeriods.map(s => ({ lap: s.startLap, type: 'safety_car', data: s })),
    ].sort((a, b) => a.lap - b.lap);
    const lapIncrements = Math.max(1, Math.floor(totalLaps / 15));
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Cronolog\u00EDa de la Carrera" }), _jsxs("div", { className: "relative mb-6", children: [_jsx("div", { className: "flex items-center gap-1 mb-2", children: Array.from({ length: totalLaps }, (_, i) => i + 1).filter(l => l % lapIncrements === 0 || l === 1 || l === totalLaps).map(lap => (_jsx("div", { className: "text-xs text-gray-500 flex-1 text-center", children: lap }, lap))) }), _jsx("div", { className: "relative h-4 bg-f1-gray-dark rounded-full overflow-hidden", children: _jsx("div", { className: "absolute inset-0 flex", children: Array.from({ length: totalLaps }, (_, i) => i + 1).map(lap => {
                                const hasIncident = incidents.some(i => i.lap === lap);
                                const isSC = safetyCarPeriods.some(s => lap >= s.startLap && lap <= s.endLap);
                                let bg = 'bg-f1-gray';
                                if (isSC)
                                    bg = 'bg-yellow-600/50';
                                if (hasIncident)
                                    bg = 'bg-red-500/50';
                                return (_jsx("div", { className: `flex-1 ${bg} ${hasIncident ? 'border-r border-red-400' : ''}`, title: `Vuelta ${lap}${hasIncident ? ' - Incidencia' : ''}${isSC ? ' - Safety Car' : ''}` }, lap));
                            }) }) })] }), allEvents.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Sin incidencias durante esta carrera." })) : (_jsxs("div", { className: "space-y-3 max-h-60 overflow-y-auto", children: [safetyCarPeriods.map((sc, idx) => (_jsxs("div", { className: "flex items-start gap-3 p-2 bg-yellow-500/10 rounded border border-yellow-500/20", children: [_jsx("span", { className: "text-lg", children: "\uD83D\uDEA6" }), _jsxs("div", { children: [_jsx("p", { className: "text-yellow-400 text-sm font-medium", children: "Per\u00EDodo de Safety Car" }), _jsxs("p", { className: "text-gray-400 text-xs", children: ["Vueltas ", sc.startLap, "-", sc.endLap, ": ", sc.reason] })] })] }, `sc-${idx}`))), incidents.map((inc, idx) => (_jsxs("div", { className: "flex items-start gap-3 p-2 bg-f1-gray-dark rounded", children: [_jsx("span", { className: "text-lg", children: INCIDENT_ICONS[inc.type] }), _jsxs("div", { children: [_jsxs("p", { className: "text-white text-sm", children: [_jsx("span", { className: "font-medium", children: inc.driverId }), " - ", inc.description] }), _jsxs("div", { className: "flex gap-2 mt-1", children: [_jsxs("span", { className: "text-xs text-gray-500", children: ["Vuelta ", inc.lap] }), inc.causedDnf && _jsx("span", { className: "text-xs text-red-400", children: "DNF" }), inc.safetyCarDeployed && _jsx("span", { className: "text-xs text-yellow-400", children: "SC Desplegado" })] }), inc.involvedDrivers && inc.involvedDrivers.length > 0 && (_jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Involucrados: ", inc.involvedDrivers.join(', ')] }))] })] }, `inc-${idx}`)))] }))] }));
}
//# sourceMappingURL=IncidentTimeline.js.map