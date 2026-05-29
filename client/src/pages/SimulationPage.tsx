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
import type { DriverPerformance } from '../types/simulation.types';

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

  const handleRun = async (config: {
    raceId: string;
    raceName: string;
    laps: number;
    weather?: { condition: any; temperature: number; humidity: number; windSpeed: number };
  }) => {
    const selectedRace = races.find(r => r.id === config.raceId);
    const selectedCircuit = circuits.find(c => selectedRace?.circuit?.id === c.id);

    const driverPerformances: DriverPerformance[] = rawDrivers.map(d => ({
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Simulador de Carrera</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoadingData ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RaceSetupForm onRun={handleRun} isLoading={isLoading} />
            {showResults && raceResult && (
              <div className="mt-4">
                <Button variant="secondary" onClick={clearResults} className="w-full">
                  Nueva Simulación
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {isLoading && (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            )}

            {raceResult && !isLoading && (
              <>
                <SimulationResults result={raceResult} />
                <LapChart results={raceResult.results} totalLaps={raceResult.laps} />
                <LapTimesChart results={raceResult.results} totalLaps={raceResult.laps} />
                <IncidentTimeline
                  incidents={raceResult.incidents}
                  safetyCarPeriods={raceResult.safetyCarPeriods}
                  totalLaps={raceResult.laps}
                />
              </>
            )}

            {!raceResult && !isLoading && (
              <div className="bg-f1-gray rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">Configura y ejecuta una simulación de carrera para ver los resultados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
