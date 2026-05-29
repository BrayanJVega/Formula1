import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
import { Trophy, Zap, Timer, Shield, AlertTriangle, Gauge } from 'lucide-react';
function ConfidenceBadge({ probability }) {
    const getColor = (p) => {
        if (p >= 40)
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (p >= 20)
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    };
    const getLabel = (p) => {
        if (p >= 40)
            return 'Alta';
        if (p >= 20)
            return 'Media';
        return 'Baja';
    };
    return (_jsxs("span", { className: clsx('text-xs px-2 py-0.5 rounded-full border font-medium', getColor(probability)), children: [getLabel(probability), " (", probability.toFixed(0), "%)"] }));
}
export function AIPredictionsPanel({ predictions }) {
    const items = [
        {
            icon: Trophy,
            label: 'Ganador Pronosticado',
            value: predictions.predictedWinner.driverName,
            sub: predictions.predictedWinner.driverId ? (_jsx(ConfidenceBadge, { probability: predictions.predictedWinner.probability })) : null,
        },
        {
            icon: Gauge,
            label: 'Pole Pronosticada',
            value: predictions.predictedPolePosition.driverName,
            sub: predictions.predictedPolePosition.driverId ? (_jsx(ConfidenceBadge, { probability: predictions.predictedPolePosition.probability })) : null,
        },
        {
            icon: Timer,
            label: 'Pronóstico de Vuelta Rápida',
            value: predictions.predictedFastestLap.driverName,
            sub: predictions.predictedFastestLap.driverId ? (_jsx(ConfidenceBadge, { probability: predictions.predictedFastestLap.probability })) : null,
        },
        {
            icon: Shield,
            label: 'Probabilidad de Safety Car',
            value: `${predictions.safetyCarProbability}%`,
            sub: (_jsx("span", { className: "text-xs text-gray-500", children: "Probabilidad" })),
        },
        {
            icon: AlertTriangle,
            label: 'DNFs Pronosticados',
            value: `${predictions.predictedDnfCount} pilotos`,
            sub: null,
        },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5 text-f1-red" }), _jsx("h3", { className: "text-lg font-bold text-white", children: "Pron\u00F3sticos de IA para la Carrera" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: items.map((item) => (_jsxs("div", { className: "bg-f1-gray rounded-xl p-4 border border-f1-gray-light/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(item.icon, { className: "w-4 h-4 text-f1-red" }), _jsx("span", { className: "text-xs text-gray-400 uppercase tracking-wider font-medium", children: item.label })] }), _jsx("div", { className: "text-white font-semibold text-lg truncate", children: item.value }), _jsx("div", { className: "mt-1", children: item.sub })] }, item.label))) }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3", children: "Podio Pronosticado" }), _jsx("div", { className: "space-y-2", children: predictions.predictedPodium.map((driver, index) => (_jsxs("div", { className: "flex items-center gap-3 bg-f1-gray rounded-lg px-4 py-3 border border-f1-gray-light/20", children: [_jsx("span", { className: clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                            'bg-orange-700/20 text-orange-400'), children: index + 1 }), _jsx("span", { className: "flex-1 text-white font-medium", children: driver.driverName }), _jsx(ConfidenceBadge, { probability: driver.probability })] }, driver.driverId))) })] })] }));
}
//# sourceMappingURL=AIPredictionsPanel.js.map