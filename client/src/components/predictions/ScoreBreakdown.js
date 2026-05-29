import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../ui/Card';
function ScoreBar({ label, score, maxScore, color }) {
    const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
    return (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm text-gray-300", children: label }), _jsxs("span", { className: "text-sm font-semibold text-white", children: [score, " pts"] })] }), _jsx("div", { className: "w-full bg-f1-gray-dark rounded-full h-2.5", children: _jsx("div", { className: `h-2.5 rounded-full transition-all duration-500 ${color}`, style: { width: `${percentage}%` } }) })] }));
}
export function ScoreBreakdown({ scores }) {
    const items = [
        { label: 'Pole Position', score: scores.poleScore, color: 'bg-purple-500' },
        { label: 'Ganador de la Carrera', score: scores.winnerScore, color: 'bg-yellow-500' },
        { label: 'Podio', score: scores.podiumScore, color: 'bg-green-500' },
        { label: 'Top 10', score: scores.top10Score, color: 'bg-blue-500' },
        { label: 'Vuelta Rápida', score: scores.fastestLapScore, color: 'bg-cyan-500' },
        { label: 'Safety Car', score: scores.safetyCarScore, color: 'bg-orange-500' },
        { label: 'Bandera Roja', score: scores.redFlagScore, color: 'bg-red-500' },
    ].filter((item) => item.score > 0);
    if (items.length === 0) {
        return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Desglose de Puntuaci\u00F3n" }), _jsx("p", { className: "text-gray-400", children: "A\u00FAn no has ganado puntos." })] }));
    }
    const categoryMax = Math.max(...items.map((i) => i.score), 1);
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Desglose de Puntuaci\u00F3n" }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Puntuaci\u00F3n Total" }), _jsxs("span", { className: "text-2xl font-bold text-f1-red", children: [scores.totalScore, " pts"] })] }) }), _jsx("div", { className: "space-y-1", children: items.map((item) => (_jsx(ScoreBar, { label: item.label, score: item.score, maxScore: categoryMax, color: item.color }, item.label))) })] }));
}
//# sourceMappingURL=ScoreBreakdown.js.map