import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRaceStore } from '../store/race.store';
import { usePredictionStore } from '../store/prediction.store';
import { PredictionForm } from '../components/predictions/PredictionForm';
import { PredictionHistory } from '../components/predictions/PredictionHistory';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatDate } from '../utils/formatters';
export default function PredictionsPage() {
    const { nextRace, fetchNextRace, isLoading: raceLoading } = useRaceStore();
    const { error } = usePredictionStore();
    const [predictionType, setPredictionType] = useState('race');
    useEffect(() => {
        fetchNextRace();
    }, [fetchNextRace]);
    if (raceLoading) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Pron\u00F3sticos" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Haz tus pron\u00F3sticos para las pr\u00F3ximas carreras" })] }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-400", children: error }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: nextRace ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Pr\u00F3xima Carrera" }), _jsxs("p", { className: "text-gray-400 text-sm", children: [nextRace.name, " - ", formatDate(nextRace.raceDate)] })] }), _jsxs("div", { className: "flex gap-2 mb-6", children: [_jsx(Button, { variant: predictionType === 'race' ? 'primary' : 'ghost', size: "sm", onClick: () => setPredictionType('race'), children: "Pron\u00F3sticos de Carrera" }), _jsx(Button, { variant: predictionType === 'qualifying' ? 'primary' : 'ghost', size: "sm", onClick: () => setPredictionType('qualifying'), children: "Pron\u00F3sticos de Clasificaci\u00F3n" })] }), _jsx(PredictionForm, { race: nextRace, predictionType: predictionType }, `${nextRace.id}-${predictionType}`)] })) : (_jsx(Card, { children: _jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-400 text-lg", children: "No hay pr\u00F3ximas carreras" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Vuelve cuando se anuncie la pr\u00F3xima carrera." }), _jsx(Link, { to: "/calendar", children: _jsx(Button, { variant: "ghost", className: "mt-4", children: "Ver Calendario" }) })] }) })) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(PredictionHistory, {}) })] })] }));
}
//# sourceMappingURL=PredictionsPage.js.map