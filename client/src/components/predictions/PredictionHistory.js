import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { PredictionCard } from './PredictionCard';
import { usePredictionStore } from '../../store/prediction.store';
export function PredictionHistory({ races }) {
    const { predictions, isLoading, pagination, fetchMyPredictions } = usePredictionStore();
    const [page, setPage] = useState(1);
    useEffect(() => {
        fetchMyPredictions(page);
    }, [page, fetchMyPredictions]);
    const getRaceName = (raceId) => {
        return races?.find((r) => r.id === raceId)?.name;
    };
    if (isLoading && predictions.length === 0) {
        return (_jsx(Card, { children: _jsx("div", { className: "flex justify-center py-8", children: _jsx(Spinner, {}) }) }));
    }
    if (predictions.length === 0) {
        return (_jsx(Card, { children: _jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-400", children: "A\u00FAn no has hecho pron\u00F3sticos." }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "\u00A1Env\u00EDa tu primer pron\u00F3stico arriba!" })] }) }));
    }
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Historial de Pron\u00F3sticos" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: predictions.map((prediction) => (_jsx(PredictionCard, { prediction: prediction, raceName: getRaceName(prediction.raceId) }, prediction.id))) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [_jsx(Button, { variant: "ghost", size: "sm", disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)), children: "Anterior" }), _jsxs("span", { className: "text-gray-400 text-sm", children: ["P\u00E1gina ", page, " de ", totalPages] }), _jsx(Button, { variant: "ghost", size: "sm", disabled: page >= totalPages, onClick: () => setPage((p) => p + 1), children: "Siguiente" })] }))] }));
}
//# sourceMappingURL=PredictionHistory.js.map