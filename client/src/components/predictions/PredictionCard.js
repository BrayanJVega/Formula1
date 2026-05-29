import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { formatDate } from '../../utils/formatters';
export function PredictionCard({ prediction, raceName }) {
    const typeLabel = prediction.type === 'qualifying' ? 'Clasificación' : 'Carrera';
    return (_jsx(Link, { to: `/predictions/${prediction.id}`, children: _jsxs(Card, { hover: true, className: "cursor-pointer", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: `text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${prediction.type === 'qualifying'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-f1-red/20 text-f1-red'}`, children: typeLabel }), prediction.isLocked ? (_jsx("span", { className: "text-xs text-green-400 font-medium", children: "Puntuado" })) : (_jsx("span", { className: "text-xs text-yellow-400 font-medium", children: "Pendiente" }))] }), raceName && (_jsx("h3", { className: "text-white font-semibold mb-1", children: raceName })), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-gray-400 text-sm", children: prediction.submittedAt ? formatDate(prediction.submittedAt) : '-' }), _jsx("span", { className: "text-xl font-bold text-white", children: prediction.totalScore > 0 ? `${prediction.totalScore} pts` : '-' })] })] }) }));
}
//# sourceMappingURL=PredictionCard.js.map