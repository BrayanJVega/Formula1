import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePredictionStore } from '../store/prediction.store';
import { useRaceStore } from '../store/race.store';
import { ScoreBreakdown } from '../components/predictions/ScoreBreakdown';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/formatters';
export default function PredictionDetailPage() {
    const { id } = useParams();
    const { currentPrediction, isLoading, error, fetchPredictionById, } = usePredictionStore();
    const { selectedRace, fetchRaceById } = useRaceStore();
    useEffect(() => {
        if (id) {
            fetchPredictionById(id);
        }
    }, [id, fetchPredictionById]);
    useEffect(() => {
        if (currentPrediction?.raceId && currentPrediction.raceId !== selectedRace?.id) {
            fetchRaceById(currentPrediction.raceId);
        }
    }, [currentPrediction?.raceId, fetchRaceById, selectedRace?.id]);
    if (isLoading) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/predictions", children: _jsx(Button, { variant: "ghost", children: "\u2190 Volver a Pron\u00F3sticos" }) }), _jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4 mt-4", children: _jsx("p", { className: "text-red-400", children: error }) })] }));
    }
    if (!currentPrediction) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/predictions", children: _jsx(Button, { variant: "ghost", children: "\u2190 Volver a Pron\u00F3sticos" }) }), _jsx("div", { className: "text-center py-16", children: _jsx("p", { className: "text-gray-500 text-lg", children: "Pron\u00F3stico no encontrado." }) })] }));
    }
    const typeLabel = currentPrediction.type === 'qualifying' ? 'Clasificación' : 'Carrera';
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/predictions", className: "inline-block mb-6", children: _jsx(Button, { variant: "ghost", children: "\u2190 Back to Predictions" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-white", children: [selectedRace?.name || 'Pronóstico', " - ", typeLabel] }), selectedRace && (_jsx("p", { className: "text-gray-400 text-sm mt-1", children: formatDate(selectedRace.raceDate) }))] }), _jsx("span", { className: `text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded ${currentPrediction.type === 'qualifying'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-f1-red/20 text-f1-red'}`, children: typeLabel })] }), _jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Estado:" }), currentPrediction.isLocked ? (_jsx("span", { className: "text-green-400 text-sm font-medium", children: "Puntuado" })) : (_jsx("span", { className: "text-yellow-400 text-sm font-medium", children: "Pendiente" }))] }), _jsxs("div", { className: "space-y-4", children: [currentPrediction.polePrediction && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Pole Position:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.polePrediction })] })), currentPrediction.top3Prediction && currentPrediction.top3Prediction.length > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Pron\u00F3stico Top 3:" }), _jsx("ol", { className: "list-decimal list-inside text-white", children: currentPrediction.top3Prediction.map((driverId, idx) => (_jsx("li", { children: driverId }, idx))) })] })), currentPrediction.top10Prediction && currentPrediction.top10Prediction.length > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Pron\u00F3stico Top 10:" }), _jsx("ol", { className: "list-decimal list-inside text-white text-sm grid grid-cols-2 gap-1", children: currentPrediction.top10Prediction.map((driverId, idx) => (_jsx("li", { children: driverId }, idx))) })] })), currentPrediction.winnerPrediction && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Ganador de la Carrera:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.winnerPrediction })] })), currentPrediction.podiumPrediction && currentPrediction.podiumPrediction.length > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Podio:" }), _jsx("ol", { className: "list-decimal list-inside text-white", children: currentPrediction.podiumPrediction.map((driverId, idx) => (_jsx("li", { children: driverId }, idx))) })] })), currentPrediction.fastestLapPrediction && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Vuelta R\u00E1pida:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.fastestLapPrediction })] })), currentPrediction.safetyCarPrediction !== undefined && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Safety Car:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.safetyCarPrediction ? 'Sí' : 'No' })] })), currentPrediction.redFlagPrediction !== undefined && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "Bandera Roja:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.redFlagPrediction ? 'Sí' : 'No' })] })), currentPrediction.dnfsPrediction !== undefined && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-400 text-sm", children: "N\u00FAmero de DNFs:" }), _jsx("p", { className: "text-white font-medium", children: currentPrediction.dnfsPrediction })] }))] })] }) }), _jsx("div", { className: "lg:col-span-1", children: currentPrediction.scores ? (_jsx(ScoreBreakdown, { scores: currentPrediction.scores })) : currentPrediction.isLocked ? (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Puntuaci\u00F3n" }), _jsxs("p", { className: "text-3xl font-bold text-f1-red", children: [currentPrediction.totalScore, " pts"] })] })) : (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Puntuaci\u00F3n" }), _jsx("p", { className: "text-gray-400", children: "A\u00FAn sin puntuar" })] })) })] })] }));
}
//# sourceMappingURL=PredictionDetailPage.js.map