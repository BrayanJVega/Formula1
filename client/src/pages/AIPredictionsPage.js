import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useRaceStore } from '../store/race.store';
import { useAIStore } from '../store/ai.store';
import { AIPredictionsPanel } from '../components/ai/AIPredictionsPanel';
import { WinProbabilityChart } from '../components/ai/WinProbabilityChart';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Brain } from 'lucide-react';
export default function AIPredictionsPage() {
    const { nextRace, fetchNextRace, isLoading: raceLoading } = useRaceStore();
    const { predictions, winProbabilities, isLoading: aiLoading, error, fetchPredictions, fetchWinProbabilities } = useAIStore();
    useEffect(() => {
        fetchNextRace();
    }, [fetchNextRace]);
    useEffect(() => {
        if (nextRace) {
            fetchPredictions(nextRace.id);
            fetchWinProbabilities(nextRace.id);
        }
    }, [nextRace, fetchPredictions, fetchWinProbabilities]);
    if (raceLoading) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: _jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4", children: _jsx("p", { className: "text-red-400", children: error }) }) }));
    }
    if (!nextRace) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-16", children: _jsx(Card, { children: _jsxs("div", { className: "text-center py-8", children: [_jsx(Brain, { className: "w-12 h-12 text-gray-600 mx-auto mb-3" }), _jsx("p", { className: "text-gray-400 text-lg", children: "No hay pr\u00F3ximas carreras" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Los pron\u00F3sticos con IA aparecer\u00E1n aqu\u00ED para la pr\u00F3xima carrera." })] }) }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Brain, { className: "w-8 h-8 text-f1-red" }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Pron\u00F3sticos con IA" }), _jsxs("p", { className: "text-gray-400 mt-1", children: ["Pron\u00F3sticos estad\u00EDsticos para ", nextRace.name] })] })] }) }), aiLoading && !predictions ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Spinner, { size: "lg" }) })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [_jsx("div", { className: "lg:col-span-3", children: predictions && _jsx(AIPredictionsPanel, { predictions: predictions }) }), _jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsx(WinProbabilityChart, { probabilities: winProbabilities }) }) })] }))] }));
}
//# sourceMappingURL=AIPredictionsPage.js.map