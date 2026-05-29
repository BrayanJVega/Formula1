import { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulation.store';
import { useDriverStore } from '../store/driver.store';
import { useCircuitStore } from '../store/circuit.store';
import { useRaceStore } from '../store/race.store';
import { SeasonSimulationView } from '../components/simulation/SeasonSimulationView';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import type { DriverPerformance } from '../types/simulation.types';

export default function SeasonSimulationPage() {
  const { seasonResult, isLoading, error, runSeason, clearResults } = useSimulationStore();
  const { drivers: rawDrivers, fetchDrivers, loading: driversLoading } = useDriverStore();
  const { circuits, fetchCircuits, isLoading: circuitsLoading } = useCircuitStore();
  const { races, fetchRaces } = useRaceStore();

  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRaces('');
    fetchDrivers();
    fetchCircuits();
  }, []);

  const handleRunSeason = async () => {
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

    const seasonRaces = races.map(race => {
      const circuit = circuits.find(c => c.id === race.circuitId);
      return {
        raceId: race.id,
        raceName: race.name,
        circuit: circuit ? {
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
        } : {
          circuitId: 'generic',
          circuitName: race.name,
          lengthKm: 5.5,
          turns: 16,
          drsZones: 2,
          avgSpeed: 210,
          overtakingDifficulty: 50,
          tyreDegradation: 50,
          brakingDifficulty: 50,
          cornerComplexity: 50,
        },
        laps: race.laps,
      };
    });

    await runSeason({
      seasonId: `season-${seasonYear}`,
      year: seasonYear,
      races: seasonRaces,
      drivers: driverPerformances,
    });
  };

  const isLoadingData = driversLoading || circuitsLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Simulador de Temporada</h1>

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
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Año de la Temporada</label>
                <input
                  type="number"
                  value={seasonYear}
                  onChange={(e) => setSeasonYear(Number(e.target.value))}
                  className="bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 w-28"
                />
              </div>
              <div className="pt-5">
                <Button onClick={handleRunSeason} isLoading={isLoading} size="lg">
                  {isLoading ? 'Simulando...' : 'Ejecutar Temporada Completa'}
                </Button>
              </div>
              {seasonResult && (
                <div className="pt-5">
                  <Button variant="secondary" onClick={clearResults}>
                    Reiniciar
                  </Button>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-3">
              {races.length} carreras, {rawDrivers.length} pilotos
            </p>
          </Card>

          {isLoading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {seasonResult && !isLoading && (
            <SeasonSimulationView result={seasonResult} />
          )}

          {!seasonResult && !isLoading && (
            <div className="bg-f1-gray rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg">Ejecuta una simulación de temporada para ver las clasificaciones del campeonato.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
