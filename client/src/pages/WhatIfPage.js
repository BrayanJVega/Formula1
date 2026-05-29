import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulation.store';
import { useDriverStore } from '../store/driver.store';
import { useCircuitStore } from '../store/circuit.store';
import { useRaceStore } from '../store/race.store';
import { SimulationResults } from '../components/simulation/SimulationResults';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
export default function WhatIfPage() {
    const { whatIfResult, isLoading, error, runWhatIf, clearResults } = useSimulationStore();
    const { drivers: rawDrivers, fetchDrivers, loading: driversLoading } = useDriverStore();
    const { circuits, fetchCircuits, isLoading: circuitsLoading } = useCircuitStore();
    const { races, fetchRaces } = useRaceStore();
    const [selectedRaceId, setSelectedRaceId] = useState('');
    const [laps, setLaps] = useState(70);
    const [scenarioType, setScenarioType] = useState('buff');
    const [targetDriverId, setTargetDriverId] = useState('');
    const [paramValue, setParamValue] = useState(20);
    useEffect(() => {
        fetchRaces('');
        fetchDrivers();
        fetchCircuits();
    }, []);
    const selectedRace = races.find(r => r.id === selectedRaceId);
    const handleRaceSelect = (raceId) => {
        setSelectedRaceId(raceId);
        const race = races.find(r => r.id === raceId);
        if (race)
            setLaps(race.laps);
    };
    const handleRunWhatIf = async () => {
        if (!selectedRace)
            return;
        const circuit = circuits.find(c => c.id === selectedRace.circuitId);
        if (!circuit)
            return;
        const driverPerformances = rawDrivers.map(d => ({
            driverId: d.id,
            driverName: d.name,
            teamId: d.team?.id ?? '',
            teamName: d.team?.name ?? '',
            skill: 70 + Math.floor(Math.random() * 30),
            qualiSkill: 65 + Math.floor(Math.random() * 35),
            raceSkill: 65 + Math.floor(Math.random() * 35),
            consistency: 50 + Math.floor(Math.random() * 50),
            experience: 40 + Math.floor(Math.random() * 60),
            aggression: 30 + Math.floor(Math.random() * 70),
            tyreManagement: 40 + Math.floor(Math.random() * 60),
            wetSkill: 40 + Math.floor(Math.random() * 60),
            form: 60 + Math.floor(Math.random() * 40),
        }));
        const params = {};
        if (scenarioType === 'buff') {
            params.increase = paramValue;
            params.formBoost = 10;
        }
        else if (scenarioType === 'nerf') {
            params.reduction = paramValue;
            params.formReduction = 15;
        }
        else if (scenarioType === 'injury') {
            params.reduction = paramValue;
        }
        const scenario = {
            type: scenarioType,
            targetDriverId: targetDriverId || undefined,
            parameters: params,
        };
        await runWhatIf({
            raceId: selectedRace.id,
            raceName: selectedRace.name,
            drivers: driverPerformances,
            circuit: {
                circuitId: circuit.id,
                circuitName: circuit.name,
                lengthKm: circuit.lengthKm,
                turns: circuit.turns,
                drsZones: circuit.drsZones,
                avgSpeed: 200 + Math.floor(Math.random() * 60),
                overtakingDifficulty: 30 + Math.floor(Math.random() * 40),
                tyreDegradation: 30 + Math.floor(Math.random() * 40),
                brakingDifficulty: 30 + Math.floor(Math.random() * 40),
                cornerComplexity: 30 + Math.floor(Math.random() * 40),
            },
            laps,
            scenario,
        });
    };
    const isLoadingData = driversLoading || circuitsLoading;
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-8", children: "Simulador What-If" }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-400", children: error }) })), isLoadingData ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Spinner, { size: "lg" }) })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Configuraci\u00F3n de Escenario" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Carrera" }), _jsxs("select", { value: selectedRaceId, onChange: (e) => handleRaceSelect(e.target.value), className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none", children: [_jsx("option", { value: "", children: "Seleccionar una carrera..." }), races.map(race => (_jsx("option", { value: race.id, children: race.name }, race.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Vueltas" }), _jsx("input", { type: "number", value: laps, onChange: (e) => setLaps(Number(e.target.value)), className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Tipo de Escenario" }), _jsxs("select", { value: scenarioType, onChange: (e) => setScenarioType(e.target.value), className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none", children: [_jsx("option", { value: "buff", children: "Buff - Potenciar estad\u00EDsticas del piloto" }), _jsx("option", { value: "nerf", children: "Nerf - Reducir estad\u00EDsticas del piloto" }), _jsx("option", { value: "injury", children: "Lesi\u00F3n - Reducci\u00F3n severa de estad\u00EDsticas" }), _jsx("option", { value: "transfer", children: "Transferencia - Mover piloto a equipo" }), _jsx("option", { value: "weather", children: "Clima - Forzar condici\u00F3n clim\u00E1tica" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Piloto Objetivo" }), _jsxs("select", { value: targetDriverId, onChange: (e) => setTargetDriverId(e.target.value), className: "w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none", children: [_jsx("option", { value: "", children: "Seleccionar un piloto..." }), rawDrivers.map(d => (_jsx("option", { value: d.id, children: d.name }, d.id)))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: ["Ajuste: ", paramValue, "%"] }), _jsx("input", { type: "range", value: paramValue, onChange: (e) => setParamValue(Number(e.target.value)), min: 5, max: 50, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "5%" }), _jsx("span", { children: "50%" })] })] }), _jsx(Button, { onClick: handleRunWhatIf, isLoading: isLoading, className: "w-full", disabled: !selectedRaceId || !targetDriverId, children: isLoading ? 'Ejecutando...' : 'Ejecutar What-If' }), whatIfResult && (_jsx(Button, { variant: "secondary", onClick: clearResults, className: "w-full", children: "Reiniciar" }))] })] }) }), _jsxs("div", { className: "lg:col-span-2 space-y-6", children: [isLoading && (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Spinner, { size: "lg" }) })), whatIfResult && !isLoading && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Resultado Base" }), _jsx(SimulationResults, { result: whatIfResult.base })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white mb-2 mt-6", children: "Resultado Modificado" }), _jsx(SimulationResults, { result: whatIfResult.modified })] })] })), !whatIfResult && !isLoading && (_jsx("div", { className: "bg-f1-gray rounded-xl p-12 text-center", children: _jsx("p", { className: "text-gray-500 text-lg", children: "Configura un escenario what-if y compara resultados." }) }))] })] }))] }));
}
//# sourceMappingURL=WhatIfPage.js.map