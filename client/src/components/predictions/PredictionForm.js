import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePredictionStore } from '../../store/prediction.store';
import { useDriverStore } from '../../store/driver.store';
import { formatDate } from '../../utils/formatters';
export function PredictionForm({ race, predictionType }) {
    const { createPrediction, updatePrediction, racePrediction, isLoading } = usePredictionStore();
    const { drivers, fetchDrivers } = useDriverStore();
    const [type, setType] = useState(predictionType);
    const isQualifying = type === 'qualifying';
    const existing = racePrediction?.type === type ? racePrediction : null;
    const [polePrediction, setPolePrediction] = useState(existing?.polePrediction ?? '');
    const [top3Prediction, setTop3Prediction] = useState(existing?.top3Prediction ?? ['', '', '']);
    const [top10Prediction, setTop10Prediction] = useState(existing?.top10Prediction ?? Array(10).fill(''));
    const [winnerPrediction, setWinnerPrediction] = useState(existing?.winnerPrediction ?? '');
    const [podiumPrediction, setPodiumPrediction] = useState(existing?.podiumPrediction ?? ['', '', '']);
    const [fastestLapPrediction, setFastestLapPrediction] = useState(existing?.fastestLapPrediction ?? '');
    const [safetyCarPrediction, setSafetyCarPrediction] = useState(existing?.safetyCarPrediction);
    const [redFlagPrediction, setRedFlagPrediction] = useState(existing?.redFlagPrediction);
    const [dnfsPrediction, setDnfsPrediction] = useState(existing?.dnfsPrediction);
    useEffect(() => {
        fetchDrivers({ isActive: true });
    }, [fetchDrivers]);
    useEffect(() => {
        if (existing) {
            setPolePrediction(existing.polePrediction ?? '');
            setTop3Prediction(existing.top3Prediction ?? ['', '', '']);
            setTop10Prediction(existing.top10Prediction ?? Array(10).fill(''));
            setWinnerPrediction(existing.winnerPrediction ?? '');
            setPodiumPrediction(existing.podiumPrediction ?? ['', '', '']);
            setFastestLapPrediction(existing.fastestLapPrediction ?? '');
            setSafetyCarPrediction(existing.safetyCarPrediction);
            setRedFlagPrediction(existing.redFlagPrediction);
            setDnfsPrediction(existing.dnfsPrediction);
        }
    }, [existing]);
    const activeDrivers = drivers.filter((d) => d.isActive);
    const handleTop3Change = (index, value) => {
        const updated = [...top3Prediction];
        updated[index] = value;
        setTop3Prediction(updated);
    };
    const handleTop10Change = (index, value) => {
        const updated = [...top10Prediction];
        updated[index] = value;
        setTop10Prediction(updated);
    };
    const handlePodiumChange = (index, value) => {
        const updated = [...podiumPrediction];
        updated[index] = value;
        setPodiumPrediction(updated);
    };
    const handleSubmit = async () => {
        const formData = {
            raceId: race.id,
            type,
            ...(isQualifying ? {
                polePrediction: polePrediction || undefined,
                top3Prediction: top3Prediction.every(Boolean) ? top3Prediction : undefined,
                top10Prediction: top10Prediction.every(Boolean) ? top10Prediction : undefined,
            } : {
                winnerPrediction: winnerPrediction || undefined,
                podiumPrediction: podiumPrediction.every(Boolean) ? podiumPrediction : undefined,
                fastestLapPrediction: fastestLapPrediction || undefined,
                safetyCarPrediction,
                redFlagPrediction,
                dnfsPrediction,
            }),
        };
        if (existing) {
            await updatePrediction(existing.id, formData);
        }
        else {
            await createPrediction({ ...formData, raceId: race.id });
        }
    };
    const renderDriverSelect = (value, onChange, label, placeholder = 'Seleccionar piloto') => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: label }), _jsxs("select", { value: value, onChange: (e) => onChange(e.target.value), className: "w-full bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red", children: [_jsx("option", { value: "", children: placeholder }), activeDrivers.map((d) => (_jsx("option", { value: d.id, children: d.name }, d.id)))] })] }));
    return (_jsxs(Card, { className: "w-full", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-xl font-bold text-white", children: [race.name, " - Pron\u00F3sticos de ", isQualifying ? 'Clasificación' : 'Carrera'] }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: formatDate(race.raceDate) })] }), _jsxs("div", { className: "flex gap-2 mb-6", children: [_jsx(Button, { variant: isQualifying ? 'primary' : 'ghost', size: "sm", onClick: () => setType('qualifying'), children: "Clasificaci\u00F3n" }), _jsx(Button, { variant: !isQualifying ? 'primary' : 'ghost', size: "sm", onClick: () => setType('race'), children: "Carrera" })] }), _jsxs("div", { className: "space-y-6", children: [isQualifying ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [renderDriverSelect(polePrediction, setPolePrediction, 'Pole Position'), renderDriverSelect(fastestLapPrediction, setFastestLapPrediction, 'Más Rápido en Clasificación')] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Pron\u00F3stico Top 3 (Ordenado)" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: top3Prediction.map((driverId, idx) => (_jsx("div", { children: renderDriverSelect(driverId, (v) => handleTop3Change(idx, v), `Position ${idx + 1}`) }, idx))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Pron\u00F3stico Top 10 (Ordenado)" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3", children: top10Prediction.map((driverId, idx) => (_jsx("div", { children: renderDriverSelect(driverId, (v) => handleTop10Change(idx, v), `Position ${idx + 1}`) }, idx))) })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [renderDriverSelect(winnerPrediction, setWinnerPrediction, 'Ganador de la Carrera'), renderDriverSelect(fastestLapPrediction, setFastestLapPrediction, 'Vuelta Rápida')] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Podio (Ordenado)" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: podiumPrediction.map((driverId, idx) => (_jsx("div", { children: renderDriverSelect(driverId, (v) => handlePodiumChange(idx, v), `Position ${idx + 1}`) }, idx))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Safety Car" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setSafetyCarPrediction(true), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${safetyCarPrediction === true
                                                            ? 'bg-f1-red text-white'
                                                            : 'bg-f1-gray-dark text-gray-400 hover:text-white'}`, children: "S\u00ED" }), _jsx("button", { type: "button", onClick: () => setSafetyCarPrediction(false), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${safetyCarPrediction === false
                                                            ? 'bg-f1-red text-white'
                                                            : 'bg-f1-gray-dark text-gray-400 hover:text-white'}`, children: "No" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Bandera Roja" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setRedFlagPrediction(true), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${redFlagPrediction === true
                                                            ? 'bg-f1-red text-white'
                                                            : 'bg-f1-gray-dark text-gray-400 hover:text-white'}`, children: "S\u00ED" }), _jsx("button", { type: "button", onClick: () => setRedFlagPrediction(false), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${redFlagPrediction === false
                                                            ? 'bg-f1-red text-white'
                                                            : 'bg-f1-gray-dark text-gray-400 hover:text-white'}`, children: "No" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "N\u00FAmero de DNFs" }), _jsx("input", { type: "number", min: 0, max: 20, value: dnfsPrediction ?? '', onChange: (e) => setDnfsPrediction(e.target.value ? parseInt(e.target.value, 10) : undefined), className: "w-full bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red", placeholder: "N\u00FAmero de DNFs" })] })] })] })), _jsx("div", { className: "pt-4 border-t border-f1-gray-light/20", children: _jsx(Button, { onClick: handleSubmit, isLoading: isLoading, className: "w-full md:w-auto", children: existing ? 'Actualizar Pronóstico' : 'Enviar Pronóstico' }) })] })] }));
}
//# sourceMappingURL=PredictionForm.js.map