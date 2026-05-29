import { useRankingStore } from '../../store/ranking.store';
import { getFlagEmoji } from '../../utils/flags';
import { Spinner } from '../ui/Spinner';
import { useEffect } from 'react';

interface CountryRankingTableProps {
  countryCode: string;
  seasonId?: string;
}

export function CountryRankingTable({ countryCode, seasonId }: CountryRankingTableProps) {
  const { countryRankings, isLoading, error, fetchCountryRankings } = useRankingStore();

  useEffect(() => {
    if (countryCode) {
      fetchCountryRankings(countryCode, seasonId);
    }
  }, [countryCode, seasonId, fetchCountryRankings]);

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

  if (countryRankings.length === 0) {
    return <div className="text-center py-8 text-gray-400">No hay clasificaciones para este país.</div>;
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
              <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {countryRankings.map((entry) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-400">
        <span>Mostrando {countryRankings.length} entradas</span>
      </div>
    </div>
  );
}
