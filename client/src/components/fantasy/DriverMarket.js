import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useFantasyStore } from '../../store/fantasy.store';
import clsx from 'clsx';
export function DriverMarket({ seasonId, onBuy }) {
    const { marketValues, loading, error, fetchMarketValues } = useFantasyStore();
    useEffect(() => {
        fetchMarketValues(seasonId);
    }, [seasonId, fetchMarketValues]);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Mercado de Pilotos" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("th", { className: "text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: "Piloto" }), _jsx("th", { className: "text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: "Equipo" }), _jsx("th", { className: "text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: "Valor" }), _jsx("th", { className: "text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium", children: "Cambio" }), onBuy && _jsx("th", { className: "text-right pb-3" })] }) }), _jsxs("tbody", { className: "divide-y divide-f1-gray-light/10", children: [marketValues.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: onBuy ? 5 : 4, className: "text-center py-8 text-gray-500", children: "No hay datos de mercado disponibles" }) })), marketValues.map((mv) => (_jsxs("tr", { className: "hover:bg-f1-gray-dark/50 transition-colors", children: [_jsx("td", { className: "py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "w-8 h-8 rounded-full bg-f1-red/20 flex items-center justify-center text-f1-red text-xs font-bold", children: ["#", mv.driverNumber ?? '?'] }), _jsx("span", { className: "text-white font-medium", children: mv.driverName ?? mv.driverId.slice(0, 8) })] }) }), _jsx("td", { className: "py-3 text-gray-400 text-sm", children: mv.teamName ?? '-' }), _jsx("td", { className: "py-3 text-right", children: _jsxs("span", { className: "text-yellow-400 font-semibold", children: [mv.currentValue.toFixed(1), "M"] }) }), _jsx("td", { className: "py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [mv.priceChange > 0 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-green-400" })) : mv.priceChange < 0 ? (_jsx(TrendingDown, { className: "w-4 h-4 text-red-400" })) : (_jsx(Minus, { className: "w-4 h-4 text-gray-500" })), _jsxs("span", { className: clsx('text-sm font-medium', mv.priceChange > 0 ? 'text-green-400' : mv.priceChange < 0 ? 'text-red-400' : 'text-gray-500'), children: [mv.priceChange > 0 ? '+' : '', mv.priceChange.toFixed(1)] })] }) }), onBuy && (_jsx("td", { className: "py-3 text-right", children: _jsx("button", { onClick: () => onBuy(mv), className: "px-3 py-1.5 bg-f1-red hover:bg-f1-red-dark text-white text-xs font-semibold rounded-lg transition-colors", children: "Comprar" }) }))] }, mv.id)))] })] }) })] }));
}
//# sourceMappingURL=DriverMarket.js.map