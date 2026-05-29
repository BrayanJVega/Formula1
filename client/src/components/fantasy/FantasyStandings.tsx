import { useEffect } from 'react';
import { Trophy, Medal, Coins, Repeat } from 'lucide-react';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useFantasyStore } from '../../store/fantasy.store';

interface FantasyStandingsProps {
  seasonId: string;
}

export function FantasyStandings({ seasonId }: FantasyStandingsProps) {
  const { standings, loading, error, fetchStandings } = useFantasyStore();

  useEffect(() => {
    fetchStandings(seasonId);
  }, [seasonId, fetchStandings]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getPositionIcon = (pos: number) => {
    if (pos === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (pos === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (pos === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold text-sm">{pos}</span>;
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Clasificación Fantástica</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-f1-gray-light/20">
              <th className="text-left pb-3 w-10" />
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">Equipo</th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">
                <Trophy className="inline w-3 h-3 mr-1" />Puntos
              </th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">
                <Coins className="inline w-3 h-3 mr-1" />Valor
              </th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">
                <Repeat className="inline w-3 h-3 mr-1" />Transferencias
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-f1-gray-light/10">
            {standings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No hay clasificaciones disponibles
                </td>
              </tr>
            )}
            {standings.map((entry) => (
              <tr key={entry.teamId} className="hover:bg-f1-gray-dark/50 transition-colors">
                <td className="py-3">{getPositionIcon(entry.position)}</td>
                <td className="py-3">
                  <span className="text-white font-medium">{entry.teamName}</span>
                </td>
                <td className="py-3 text-right">
                  <span className="text-f1-red font-bold">{entry.totalScore.toFixed(1)}</span>
                </td>
                <td className="py-3 text-right text-yellow-400 font-semibold">
                  {entry.totalValue.toFixed(1)}M
                </td>
                <td className="py-3 text-right text-gray-400">
                  {entry.transfersCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
