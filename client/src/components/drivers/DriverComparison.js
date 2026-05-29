import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { nationalityFlag } from '../../utils/formatters';
function StatRow({ label, value1, value2, format }) {
    const fmt = format ?? ((v) => v.toString());
    const d1 = fmt(value1);
    const d2 = fmt(value2);
    const better1 = value1 > value2;
    const better2 = value2 > value1;
    const tie = value1 === value2;
    return (_jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("td", { className: clsx('py-3 px-4 text-right font-semibold', better1 && 'text-f1-red', tie && 'text-white'), children: d1 }), _jsx("td", { className: "py-3 px-4 text-gray-400 text-sm font-medium uppercase tracking-wider text-center", children: label }), _jsx("td", { className: clsx('py-3 px-4 font-semibold', better2 && 'text-f1-red', tie && 'text-white'), children: d2 })] }));
}
export function DriverComparison({ driver1, driver2, loading, error }) {
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    if (!driver1 || !driver2) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-gray-400", children: "Selecciona dos pilotos para comparar." }) }));
    }
    const stats = [
        { label: 'Campeonatos', key: 'championships' },
        { label: 'Victorias', key: 'wins' },
        { label: 'Podios', key: 'podiums' },
        { label: 'Poles', key: 'poles' },
        { label: 'Vueltas Rápidas', key: 'fastestLaps' },
        { label: 'Puntos Totales', key: 'totalPoints' },
        { label: 'Carreras Disputadas', key: 'racesEntered' },
        { label: 'Puntos de Temporada', key: 'seasonPoints' },
        { label: 'Posición en Temporada', key: 'seasonPosition', format: (v) => `P${v}` },
    ];
    return (_jsxs("div", { children: [_jsxs("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [_jsx(DriverProfile, { driver: driver1 }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("span", { className: "text-2xl font-bold text-f1-red", children: "VS" }) }), _jsx(DriverProfile, { driver: driver2 })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4 text-center", children: "Comparaci\u00F3n de Estad\u00EDsticas" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("th", { className: "py-3 px-4 text-right text-sm text-gray-400 font-medium", children: driver1.name }), _jsx("th", { className: "py-3 px-4 text-center text-sm text-gray-400 font-medium", children: "Estad\u00EDstica" }), _jsx("th", { className: "py-3 px-4 text-left text-sm text-gray-400 font-medium", children: driver2.name })] }) }), _jsx("tbody", { children: stats.map(({ label, key, format }) => {
                                        const v1 = (driver1.stats?.[key] ?? 0);
                                        const v2 = (driver2.stats?.[key] ?? 0);
                                        return _jsx(StatRow, { label: label, value1: v1, value2: v2, format: format }, key);
                                    }) })] }) })] })] }));
}
function DriverProfile({ driver }) {
    return (_jsxs(Card, { className: "text-center", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-f1-gray-dark mx-auto mb-3 flex items-center justify-center overflow-hidden", children: driver.photoUrl ? (_jsx("img", { src: driver.photoUrl, alt: driver.name, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-2xl font-bold text-f1-red", children: driver.name.split(' ').map((n) => n[0]).join('').toUpperCase() })) }), _jsx("div", { className: "text-2xl mb-1", children: nationalityFlag(driver.nationality) }), _jsx("h3", { className: "text-lg font-bold text-white", children: driver.name }), _jsxs("p", { className: "text-2xl font-bold text-f1-red", children: ["#", driver.number] }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: driver.team.name })] }));
}
//# sourceMappingURL=DriverComparison.js.map