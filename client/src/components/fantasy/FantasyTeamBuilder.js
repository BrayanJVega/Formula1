import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Coins, Plus, Minus, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useDriverStore } from '../../store/driver.store';
import { useFantasyStore } from '../../store/fantasy.store';
import clsx from 'clsx';
const MAX_DRIVERS = 5;
export function FantasyTeamBuilder({ teamId, picks, budget, onComplete }) {
    const { drivers, loading: driversLoading, fetchDrivers } = useDriverStore();
    const { addPick, removePick } = useFantasyStore();
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);
    useEffect(() => {
        const active = picks.filter((p) => p.isActive);
        setSelectedDrivers(active.filter((p) => p.type === 'driver').map((p) => p.driverId).filter(Boolean));
    }, [picks]);
    const usedDrivers = picks.filter((p) => p.isActive && p.type === 'driver');
    const getDriverPrice = (driverId) => {
        const pick = picks.find((p) => p.driverId === driverId && p.isActive);
        return pick?.cost ?? 10;
    };
    const handleAddDriver = async (driverId) => {
        const price = getDriverPrice(driverId);
        if (budget < price)
            return;
        try {
            await addPick(teamId, { driverId, type: 'driver', cost: price });
            setSelectedDrivers((prev) => [...prev, driverId]);
            onComplete?.();
        }
        catch { }
    };
    const handleRemoveDriver = async (driverId) => {
        const pick = picks.find((p) => p.driverId === driverId && p.isActive);
        if (pick) {
            try {
                await removePick(pick.id);
                setSelectedDrivers((prev) => prev.filter((id) => id !== driverId));
                onComplete?.();
            }
            catch { }
        }
    };
    if (driversLoading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) }));
    }
    const budgetUsed = picks.filter((p) => p.isActive).reduce((sum, p) => sum + p.cost, 0);
    const budgetPct = (budgetUsed / 100) * 100;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Presupuesto Restante" }), _jsxs("span", { className: clsx('font-bold text-lg', budget < 10 ? 'text-red-400' : 'text-yellow-400'), children: [_jsx(Coins, { className: "inline w-4 h-4 mr-1" }), budget.toFixed(1), "M"] })] }), _jsx("div", { className: "w-full bg-f1-gray-dark rounded-full h-3 overflow-hidden", children: _jsx("div", { className: clsx('h-full rounded-full transition-all duration-300', budgetPct > 80 ? 'bg-red-500' : budgetPct > 50 ? 'bg-yellow-500' : 'bg-green-500'), style: { width: `${Math.min(budgetPct, 100)}%` } }) }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [budgetUsed.toFixed(1), "M usados de 100M"] })] }) }), _jsxs(Card, { children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4", children: ["Selecciona Pilotos (", selectedDrivers.length, "/", MAX_DRIVERS, ")"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: drivers.map((driver) => {
                            const isSelected = selectedDrivers.includes(driver.id);
                            const price = getDriverPrice(driver.id);
                            const canAfford = budget >= price;
                            return (_jsx("div", { className: clsx('rounded-lg p-3 border transition-all duration-200', isSelected
                                    ? 'border-f1-red bg-f1-red/10'
                                    : 'border-f1-gray-light/20 bg-f1-gray-dark hover:border-f1-red/50'), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white font-medium text-sm", children: driver.name }), _jsx("p", { className: "text-gray-500 text-xs", children: driver.team?.name })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-yellow-400 font-semibold text-sm", children: [price.toFixed(1), "M"] }), isSelected ? (_jsxs("button", { onClick: () => handleRemoveDriver(driver.id), className: "mt-1 text-red-400 hover:text-red-300 text-xs flex items-center gap-1", children: [_jsx(Minus, { className: "w-3 h-3" }), " Quitar"] })) : (_jsxs("button", { onClick: () => handleAddDriver(driver.id), disabled: !canAfford || usedDrivers.length >= MAX_DRIVERS, className: "mt-1 text-f1-red hover:text-red-300 text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed", children: [_jsx(Plus, { className: "w-3 h-3" }), " A\u00F1adir"] }))] })] }) }, driver.id));
                        }) })] }), usedDrivers.length < MAX_DRIVERS && (_jsxs("div", { className: "flex items-center gap-2 text-yellow-400 text-sm", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Selecciona ", MAX_DRIVERS - usedDrivers.length, " piloto", MAX_DRIVERS - usedDrivers.length !== 1 ? 's' : '', " m\u00E1s"] }))] }));
}
//# sourceMappingURL=FantasyTeamBuilder.js.map