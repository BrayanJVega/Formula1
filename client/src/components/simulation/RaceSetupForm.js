import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useRaceStore } from '../../store/race.store';
import { useDriverStore } from '../../store/driver.store';
import { useCircuitStore } from '../../store/circuit.store';
export function RaceSetupForm({ onRun, isLoading }) {
    const { races, fetchRaces } = useRaceStore();
    useDriverStore();
    useCircuitStore();
    const [selectedRaceId, setSelectedRaceId] = useState('');
    const [laps, setLaps] = useState(70);
    const [weatherCondition, setWeatherCondition] = useState('dry');
    const [temperature, setTemperature] = useState(22);
    const [humidity, setHumidity] = useState(50);
    const [windSpeed, setWindSpeed] = useState(10);
    const [customWeather, setCustomWeather] = useState(false);
    useEffect(() => {
        fetchRaces('');
    }, []);
    const selectedRace = races.find(r => r.id === selectedRaceId);
    const handleRaceSelect = (raceId) => {
        setSelectedRaceId(raceId);
        const race = races.find(r => r.id === raceId);
        if (race) {
            setLaps(race.laps);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRace)
            return;
        onRun({
            raceId: selectedRace.id,
            raceName: selectedRace.name,
            laps,
            weather: customWeather ? {
                condition: weatherCondition,
                temperature,
                humidity,
                windSpeed,
            } : undefined,
        });
    };
    return (_jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Configuraci\u00F3n de Carrera" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Carrera" }), _jsxs("select", { value: selectedRaceId, onChange: (e) => handleRaceSelect(e.target.value), className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none", children: [_jsx("option", { value: "", children: "Seleccionar una carrera..." }), races.map(race => (_jsx("option", { value: race.id, children: race.name }, race.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Vueltas" }), _jsx("input", { type: "number", value: laps, onChange: (e) => setLaps(Number(e.target.value)), min: 5, max: 120, className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "customWeather", checked: customWeather, onChange: (e) => setCustomWeather(e.target.checked), className: "rounded bg-f1-gray-dark border-f1-gray-light/20" }), _jsx("label", { htmlFor: "customWeather", className: "text-sm text-gray-300", children: "Clima Personalizado" })] }), customWeather && (_jsxs("div", { className: "space-y-4 p-4 bg-f1-gray-dark rounded-lg", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Condici\u00F3n" }), _jsxs("select", { value: weatherCondition, onChange: (e) => setWeatherCondition(e.target.value), className: "w-full bg-f1-gray text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none", children: [_jsx("option", { value: "dry", children: "Seco" }), _jsx("option", { value: "light_rain", children: "Lluvia Ligera" }), _jsx("option", { value: "heavy_rain", children: "Lluvia Fuerte" }), _jsx("option", { value: "wet", children: "Mojado" })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-400 mb-1", children: "Temperatura (\u00B0C)" }), _jsx("input", { type: "number", value: temperature, onChange: (e) => setTemperature(Number(e.target.value)), className: "w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-400 mb-1", children: "Humedad (%)" }), _jsx("input", { type: "number", value: humidity, onChange: (e) => setHumidity(Number(e.target.value)), min: 0, max: 100, className: "w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-400 mb-1", children: "Viento (km/h)" }), _jsx("input", { type: "number", value: windSpeed, onChange: (e) => setWindSpeed(Number(e.target.value)), className: "w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm" })] })] })] })), _jsx(Button, { type: "submit", isLoading: isLoading, className: "w-full", disabled: !selectedRace, children: isLoading ? 'Ejecutando Simulación...' : 'Ejecutar Simulación de Carrera' })] }) }));
}
//# sourceMappingURL=RaceSetupForm.js.map