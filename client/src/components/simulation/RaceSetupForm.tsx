import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useRaceStore } from '../../store/race.store';
import { useDriverStore } from '../../store/driver.store';
import { useCircuitStore } from '../../store/circuit.store';
import type { WeatherCondition } from '../../types/simulation.types';

interface RaceSetupFormProps {
  onRun: (config: {
    raceId: string;
    raceName: string;
    laps: number;
    weather?: {
      condition: WeatherCondition;
      temperature: number;
      humidity: number;
      windSpeed: number;
    };
  }) => void;
  isLoading: boolean;
}

export function RaceSetupForm({ onRun, isLoading }: RaceSetupFormProps) {
  const { races, fetchRaces } = useRaceStore();
  useDriverStore();
  useCircuitStore();

  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [laps, setLaps] = useState(70);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('dry');
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(50);
  const [windSpeed, setWindSpeed] = useState(10);
  const [customWeather, setCustomWeather] = useState(false);

  useEffect(() => {
    fetchRaces('');
  }, []);

  const selectedRace = races.find(r => r.id === selectedRaceId);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRaceId(raceId);
    const race = races.find(r => r.id === raceId);
    if (race) {
      setLaps(race.laps);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRace) return;

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

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-white">Configuración de Carrera</h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Carrera</label>
          <select
            value={selectedRaceId}
            onChange={(e) => handleRaceSelect(e.target.value)}
            className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
          >
            <option value="">Seleccionar una carrera...</option>
            {races.map(race => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Vueltas</label>
          <input
            type="number"
            value={laps}
            onChange={(e) => setLaps(Number(e.target.value))}
            min={5}
            max={120}
            className="w-full bg-f1-gray-dark text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="customWeather"
            checked={customWeather}
            onChange={(e) => setCustomWeather(e.target.checked)}
            className="rounded bg-f1-gray-dark border-f1-gray-light/20"
          />
          <label htmlFor="customWeather" className="text-sm text-gray-300">Clima Personalizado</label>
        </div>

        {customWeather && (
          <div className="space-y-4 p-4 bg-f1-gray-dark rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Condición</label>
              <select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value as WeatherCondition)}
                className="w-full bg-f1-gray text-white rounded-lg px-3 py-2 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none"
              >
                <option value="dry">Seco</option>
                <option value="light_rain">Lluvia Ligera</option>
                <option value="heavy_rain">Lluvia Fuerte</option>
                <option value="wet">Mojado</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Temperatura (°C)</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Humedad (%)</label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Viento (km/h)</label>
                <input
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full bg-f1-gray text-white rounded-lg px-2 py-1.5 border border-f1-gray-light/20 focus:border-f1-red focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full" disabled={!selectedRace}>
          {isLoading ? 'Ejecutando Simulación...' : 'Ejecutar Simulación de Carrera'}
        </Button>
      </form>
    </Card>
  );
}
