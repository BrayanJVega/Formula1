import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulation.store';
import { useDriverStore } from '../store/driver.store';
import { useCircuitStore } from '../store/circuit.store';
import { useRaceStore } from '../store/race.store';
import { RaceSetupForm } from '../components/simulation/RaceSetupForm';
import { SimulationResults } from '../components/simulation/SimulationResults';
import { LapChart } from '../components/simulation/LapChart';
import { LapTimesChart } from '../components/simulation/LapTimesChart';
import { IncidentTimeline } from '../components/simulation/IncidentTimeline';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
export default function SimulationPage() {
    const { raceResult, isLoading, error, runRace, clearResults } = useSimulationStore();
    const { drivers: rawDrivers, fetchDrivers, loading: driversLoading } = useDriverStore();
    const { circuits, fetchCircuits, isLoading: circuitsLoading } = useCircuitStore();
    const { races, fetchRaces } = useRaceStore();
    const [showResults, setShowResults] = useState(false);
    useEffect(() => {
        fetchRaces('');
        fetchDrivers();
        fetchCircuits();
    }, []);
    const handleRun = async (config) => {
        const selectedRace = races.find(r => r.id === config.raceId);
        const selectedCircuit = circuits.find(c => selectedRace?.circuit?.id === c.id);
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
        const circuitData = selectedCircuit ? {
            circuitId: selectedCircuit.id,
            circuitName: selectedCircuit.name,
            lengthKm: selectedCircuit.lengthKm,
            turns: selectedCircuit.turns,
            drsZones: selectedCircuit.drsZones,
            avgSpeed: 200 + Math.floor(Math.random() * 60),
            overtakingDifficulty: 30 + Math.floor(Math.random() * 40),
            tyreDegradation: 30 + Math.floor(Math.random() * 40),
            brakingDifficulty: 30 + Math.floor(Math.random() * 40),
            cornerComplexity: 30 + Math.floor(Math.random() * 40),
        } : {
            circuitId: 'generic',
            circuitName: config.raceName,
            lengthKm: 5.5,
            turns: 16,
            drsZones: 2,
            avgSpeed: 210,
            overtakingDifficulty: 50,
            tyreDegradation: 50,
            brakingDifficulty: 50,
            cornerComplexity: 50,
        };
        await runRace({
            raceId: config.raceId,
            raceName: config.raceName,
            drivers: driverPerformances,
            circuit: circuitData,
            laps: config.laps,
            initialWeather: config.weather,
        });
        setShowResults(true);
    };
    const isLoadingData = driversLoading || circuitsLoading;
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-8", children: "Simulador de Carrera" }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-400", children: error }) })), isLoadingData ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Spinner, { size: "lg" }) })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1", children: [_jsx(RaceSetupForm, { onRun: handleRun, isLoading: isLoading }), showResults && raceResult && (_jsx("div", { className: "mt-4", children: _jsx(Button, { variant: "secondary", onClick: clearResults, className: "w-full", children: "Nueva Simulaci\u00F3n" }) }))] }), _jsxs("div", { className: "lg:col-span-2 space-y-6", children: [isLoading && (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Spinner, { size: "lg" }) })), raceResult && !isLoading && (_jsxs(_Fragment, { children: [_jsx(SimulationResults, { result: raceResult }), _jsx(LapChart, { results: raceResult.results, totalLaps: raceResult.laps }), _jsx(LapTimesChart, { results: raceResult.results, totalLaps: raceResult.laps }), _jsx(IncidentTimeline, { incidents: raceResult.incidents, safetyCarPeriods: raceResult.safetyCarPeriods, totalLaps: raceResult.laps })] })), !raceResult && !isLoading && (_jsx("div", { className: "bg-f1-gray rounded-xl p-12 text-center", children: _jsx("p", { className: "text-gray-500 text-lg", children: "Configura y ejecuta una simulaci\u00F3n de carrera para ver los resultados." }) }))] })] }))] }));
}
//# sourceMappingURL=SimulationPage.js.map