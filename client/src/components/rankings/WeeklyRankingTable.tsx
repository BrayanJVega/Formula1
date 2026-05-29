import { useRankingStore } from '../../store/ranking.store';
import { getFlagEmoji } from '../../utils/flags';
import { Spinner } from '../ui/Spinner';
import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function WeeklyRankingTable() {
  const { weeklyRankings, pagination, isLoading, error, fetchWeeklyRankings } = useRankingStore();

  useEffect(() => {
    fetchWeeklyRankings();
  }, [fetchWeeklyRankings]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  if (weeklyRankings.length === 0) {
    return <div className="text-center py-8 text-gray-400">No hay clasificaciones semanales disponibles.</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-f1-gray-light/20">
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Pos</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Usuario</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">País</th>
              <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">Puntos Semanales</th>
              <th className="text-center py-3 px-4 text-gray-400 text-sm font-medium">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {weeklyRankings.map((entry) => (
              <tr key={entry.userId} className="border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5 transition-colors">
                <td className="py-3 px-4">
                  <span className={`font-bold ${entry.position <= 3 ? 'text-f1-red' : 'text-white'}`}>
                    #{entry.position}
                  </span>
                </td>
                <td className="py-3 px-4 text-white font-medium">{entry.username}</td>
                <td className="py-3 px-4 text-gray-300">
                  {entry.country ? (
                    <span className="flex items-center gap-1">
                      <span className="text-lg">{getFlagEmoji(entry.country)}</span>
                      <span className="text-sm">{entry.country}</span>
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-white font-semibold">
                  {entry.score.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-center">
                  {entry.change !== undefined && entry.change !== 0 ? (
                    <span className={`inline-flex items-center gap-1 text-sm ${entry.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(entry.change)}
                    </span>
                  ) : (
                    <span className="text-gray-500 inline-flex items-center">
                      <Minus size={14} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-400">
        <span>Mostrando {weeklyRankings.length} de {pagination.total} entradas</span>
      </div>
    </div>
  );
}
