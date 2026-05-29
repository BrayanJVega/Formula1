import { Card } from '../ui/Card';
import type { RaceSimulationResult } from '../../types/simulation.types';

interface SimulationResultsProps {
  result: RaceSimulationResult;
}

const STATUS_BADGE = (dnfd: boolean, reason?: string) => {
  if (dnfd) {
    return <span className="text-red-400 text-xs" title={reason}>DNF</span>;
  }
  return <span className="text-green-400 text-xs">Finalizó</span>;
};

export function SimulationResults({ result }: SimulationResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{result.raceName} - Resultados</h2>
          <div className="text-sm text-gray-400">
            Clima: {result.weather.condition} | {result.weather.temperature}°C
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Pos</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Piloto</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Equipo</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Tiempo</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Diferencia</th>
                <th className="text-center py-2 px-2 text-gray-400 font-medium">Paradas</th>
                <th className="text-center py-2 px-2 text-gray-400 font-medium">Parrilla</th>
                <th className="text-center py-2 px-2 text-gray-400 font-medium">+/-</th>
                <th className="text-center py-2 px-2 text-gray-400 font-medium">Estado</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((driver) => (
                <tr
                  key={driver.driverId}
                  className="border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5"
                >
                  <td className="py-2 px-2 font-bold text-white">
                    {driver.position}
                    {driver.position === 1 && <span className="ml-1 text-yellow-400">&#9733;</span>}
                  </td>
                  <td className="py-2 px-2">
                    <span className="text-white">{driver.driverName}</span>
                    {driver.fastestLap && (
                      <span className="ml-1 text-purple-400 text-xs" title="Vuelta Rápida">FL</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-gray-300">{driver.teamName}</td>
                  <td className="py-2 px-2 text-right text-gray-300 font-mono">
                    {formatTime(driver.totalTime)}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-400 font-mono">
                    {driver.position === 1 ? '--' : `+${driver.gapToWinner.toFixed(1)}s`}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-300">{driver.pitStops}</td>
                  <td className="py-2 px-2 text-center text-gray-300">{driver.gridPosition}</td>
                  <td className={`py-2 px-2 text-center font-medium ${driver.positionsGained > 0 ? 'text-green-400' : driver.positionsGained < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {driver.positionsGained > 0 ? `+${driver.positionsGained}` : driver.positionsGained}
                  </td>
                  <td className="py-2 px-2 text-center">{STATUS_BADGE(driver.dnfd, driver.dnfReason)}</td>
                  <td className="py-2 px-2 text-right font-bold text-white">{driver.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-sm text-gray-400 mb-1">Vuelta Rápida</h3>
          <p className="text-white font-bold">
            {result.fastestLap.driverId} - {result.fastestLap.time.toFixed(3)}s
          </p>
          <p className="text-xs text-gray-500">Vuelta {result.fastestLap.lap}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-400 mb-1">Retiros</h3>
          <p className="text-white font-bold">{result.retirements}</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-400 mb-1">Tiempo Promedio por Vuelta</h3>
          <p className="text-white font-bold">{result.averageLapTime.toFixed(3)}s</p>
        </Card>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(7, '0')}`;
}
