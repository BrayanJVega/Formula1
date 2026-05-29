import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function WinProbabilityChart({ probabilities, maxBars = 15 }) {
    const topDrivers = probabilities.slice(0, maxBars);
    const maxProb = Math.max(...topDrivers.map((d) => d.probability), 1);
    const getBarColor = (probability) => {
        if (probability >= 25)
            return 'bg-green-500';
        if (probability >= 15)
            return 'bg-blue-500';
        if (probability >= 8)
            return 'bg-yellow-500';
        return 'bg-gray-500';
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Probabilidad de Victoria" }), _jsx("div", { className: "space-y-2", children: topDrivers.map((driver) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs text-gray-400 w-6 text-right shrink-0", children: ["#", driver.rank] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm text-white truncate", children: driver.driverName }), _jsxs("span", { className: "text-sm text-gray-400 font-mono shrink-0 ml-2", children: [driver.probability.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-700 ease-out ${getBarColor(driver.probability)}`, style: { width: `${(driver.probability / maxProb) * 100}%` } }) })] })] }, driver.driverId))) })] }));
}
//# sourceMappingURL=WinProbabilityChart.js.map