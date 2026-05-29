import { Card } from '../ui/Card';
import type { SeasonSimulationResult } from '../../types/simulation.types';

interface SeasonSimulationViewProps {
  result: SeasonSimulationResult;
}

export function SeasonSimulationView({ result }: SeasonSimulationViewProps) {
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-bold text-white mb-2">
          {result.year} - Clasificación del Campeonato
        </h2>
        <p className="text-gray-400 text-sm mb-6">{result.races.length} Carreras Completadas</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Pos</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Piloto</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Equipo</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Victorias</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Podios</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {result.championshipStandings.map((driver) => (
                <tr key={driver.driverId} className="border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5">
                  <td className="py-2 px-2 font-bold text-white">{driver.position}</td>
                  <td className="py-2 px-2 text-white">{driver.driverName}</td>
                  <td className="py-2 px-2 text-gray-300">
                    {result.constructorStandings.find(c => c.teamId === driver.teamId)?.teamName ?? driver.teamId}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-300">{driver.wins}</td>
                  <td className="py-2 px-2 text-right text-gray-300">{driver.podiums}</td>
                  <td className="py-2 px-2 text-right font-bold text-white">{driver.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Clasificación de Constructores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Pos</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Equipo</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Victorias</th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {result.constructorStandings.map((team) => (
                <tr key={team.teamId} className="border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5">
                  <td className="py-2 px-2 font-bold text-white">{team.position}</td>
                  <td className="py-2 px-2 text-white">{team.teamName}</td>
                  <td className="py-2 px-2 text-right text-gray-300">{team.wins}</td>
                  <td className="py-2 px-2 text-right font-bold text-white">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Ganadores de Carreras</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Ronda</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Carrera</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Ganador</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">Equipo</th>
              </tr>
            </thead>
            <tbody>
              {result.races.map((race, idx) => {
                const winner = race.results.find(r => r.position === 1);
                return (
                  <tr key={race.raceId} className="border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5">
                    <td className="py-2 px-2 text-gray-300">{idx + 1}</td>
                    <td className="py-2 px-2 text-white">{race.raceName}</td>
                    <td className="py-2 px-2 text-white">{winner?.driverName ?? 'N/A'}</td>
                    <td className="py-2 px-2 text-gray-300">{winner?.teamName ?? 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
