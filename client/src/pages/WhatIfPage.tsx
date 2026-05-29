import { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulation.store';
import { useDriverStore } from '../store/driver.store';
import { useCircuitStore } from '../store/circuit.store';
import { useRaceStore } from '../store/race.store';
import { SimulationResults } from '../components/simulation/SimulationResults';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import type { DriverPerformance, WhatIfScenario } from '../types/simulation.types';

export default function WhatIfPage() {
  const { whatIfResult, isLoading, error, runWhatIf, clearResults } = useSimulationStore();
  const { drivers: rawDrivers, fetchDrivers, loading: driversLoading } = useDriverStore();
  const { circuits, fetchCircuits, isLoading: circuitsLoading } = useCircuitStore();
  const { races, fetchRaces } = useRaceStore();

  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [laps, setLaps] = useState(70);
  const [scenarioType, setScenarioType] = useState<WhatIfScenario['type']>('buff');
  const [targetDriverId, setTargetDriverId] = useState('');
  const [paramValue, setParamValue] = useState(20);

  useEffect(() => {
    fetchRaces('');
    fetchDrivers();
    fetchCircuits();
  }, []);

  const selectedRace = races.find(r => r.id === selectedRaceId);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRaceId(raceId);
    const race = races.find(r => r.id === raceId);
    if (race) setLaps(race.laps);
  };

  const handleRunWhatIf = async () => {
    if (!selectedRace) return;
    const circuit = circuits.find(c => c.id === selectedRace.circuitId);
    if (!circuit) return;

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

    const params: Record<string, number> = {};
    if (scenarioType === 'buff') {
      params.increase = paramValue;
      params.formBoost = 10;
    } else if (scenarioType === 'nerf') {
      params.reduction = paramValue;
      params.formReduction = 15;
    } else if (scenarioType === 'injury') {
      params.reduction = paramValue;
    }

    const scenario: WhatIfScenario = {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Simulador What-If</h1>

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
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Configuración de Escenario</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Carrera</label>
                  <select
                    value={selectedRaceId}
                    onChange={(e) => handleRaceSelect(e.target.value)}
                    className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
                  >
                    <option value="">Seleccionar una carrera...</option>
                    {races.map(race => (
                      <option key={race.id} value={race.id}>{race.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vueltas</label>
                  <input
                    type="number"
                    value={laps}
                    onChange={(e) => setLaps(Number(e.target.value))}
                    className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Escenario</label>
                  <select
                    value={scenarioType}
                    onChange={(e) => setScenarioType(e.target.value as WhatIfScenario['type'])}
                    className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
                  >
                    <option value="buff">Buff - Potenciar estadísticas del piloto</option>
                    <option value="nerf">Nerf - Reducir estadísticas del piloto</option>
                    <option value="injury">Lesión - Reducción severa de estadísticas</option>
                    <option value="transfer">Transferencia - Mover piloto a equipo</option>
                    <option value="weather">Clima - Forzar condición climática</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Piloto Objetivo</label>
                  <select
                    value={targetDriverId}
                    onChange={(e) => setTargetDriverId(e.target.value)}
                    className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
                  >
                    <option value="">Seleccionar un piloto...</option>
                    {rawDrivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ajuste: {paramValue}%
                  </label>
                  <input
                    type="range"
                    value={paramValue}
                    onChange={(e) => setParamValue(Number(e.target.value))}
                    min={5}
                    max={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                <Button onClick={handleRunWhatIf} isLoading={isLoading} className="w-full" disabled={!selectedRaceId || !targetDriverId}>
                  {isLoading ? 'Ejecutando...' : 'Ejecutar What-If'}
                </Button>

                {whatIfResult && (
                  <Button variant="secondary" onClick={clearResults} className="w-full">
                    Reiniciar
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {isLoading && (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            )}

            {whatIfResult && !isLoading && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Resultado Base</h2>
                  <SimulationResults result={whatIfResult.base} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 mt-6">Resultado Modificado</h2>
                  <SimulationResults result={whatIfResult.modified} />
                </div>
              </>
            )}

            {!whatIfResult && !isLoading && (
              <div className="bg-f1-gray rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">Configura un escenario what-if y compara resultados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
