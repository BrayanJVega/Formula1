import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
const statusConfig = {
    upcoming: { label: 'Próxima', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    qualifying_complete: { label: 'Clasificación Completada', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    completed: { label: 'Completada', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    cancelled: { label: 'Cancelada', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};
const countryFlags = {
    'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Azerbaijan': '🇦🇿', 'Bahrain': '🇧🇭',
    'Belgium': '🇧🇪', 'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'China': '🇨🇳',
    'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'France': '🇫🇷', 'Germany': '🇩🇪',
    'Hungary': '🇭🇺', 'India': '🇮🇳', 'Italy': '🇮🇹', 'Japan': '🇯🇵',
    'Mexico': '🇲🇽', 'Monaco': '🇲🇨', 'Morocco': '🇲🇦', 'Netherlands': '🇳🇱',
    'New Zealand': '🇳🇿', 'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Qatar': '🇶🇦',
    'Russia': '🇷🇺', 'Saudi Arabia': '🇸🇦', 'Singapore': '🇸🇬', 'South Africa': '🇿🇦',
    'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭',
    'Thailand': '🇹🇭', 'Turkey': '🇹🇷', 'UAE': '🇦🇪', 'UK': '🇬🇧',
    'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧', 'USA': '🇺🇸',
};
function getFlag(country) {
    return countryFlags[country] || '🏁';
}
export function RaceCard({ race, highlight }) {
    const config = statusConfig[race.status] || statusConfig.upcoming;
    return (_jsx(Link, { to: `/races/${race.id}`, children: _jsxs(Card, { hover: true, className: clsx('relative', highlight && 'ring-2 ring-f1-red'), children: [highlight && (_jsx("span", { className: "absolute -top-2 -right-2 bg-f1-red text-white text-xs font-bold px-2 py-0.5 rounded-full", children: "PR\u00D3XIMA" })), _jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: getFlag(race.circuit.country) }), _jsxs("span", { className: "text-3xl font-bold text-f1-red", children: ["R", race.round] })] }), _jsx("span", { className: clsx('text-xs font-medium px-2 py-1 rounded-full border', config.className), children: config.label })] }), _jsx("h3", { className: "text-white font-bold text-lg mb-1", children: race.name }), _jsx("p", { className: "text-gray-400 text-sm mb-2", children: race.circuit.name }), _jsx("p", { className: "text-gray-500 text-xs", children: new Date(race.raceDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }) })] }) }));
}
//# sourceMappingURL=RaceCard.js.map