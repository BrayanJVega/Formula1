import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useFantasyStore } from '../../store/fantasy.store';
import type { DriverMarketValue } from '../../types/fantasy.types';
import clsx from 'clsx';

interface DriverMarketProps {
  seasonId: string;
  onBuy?: (driver: DriverMarketValue) => void;
}

export function DriverMarket({ seasonId, onBuy }: DriverMarketProps) {
  const { marketValues, loading, error, fetchMarketValues } = useFantasyStore();

  useEffect(() => {
    fetchMarketValues(seasonId);
  }, [seasonId, fetchMarketValues]);

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

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Mercado de Pilotos</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-f1-gray-light/20">
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">Piloto</th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">Equipo</th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">Valor</th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3 font-medium">Cambio</th>
              {onBuy && <th className="text-right pb-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-f1-gray-light/10">
            {marketValues.length === 0 && (
              <tr>
                <td colSpan={onBuy ? 5 : 4} className="text-center py-8 text-gray-500">
                  No hay datos de mercado disponibles
                </td>
              </tr>
            )}
            {marketValues.map((mv) => (
              <tr key={mv.id} className="hover:bg-f1-gray-dark/50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-f1-red/20 flex items-center justify-center text-f1-red text-xs font-bold">
                      #{mv.driverNumber ?? '?'}
                    </div>
                    <span className="text-white font-medium">{mv.driverName ?? mv.driverId.slice(0, 8)}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-400 text-sm">{mv.teamName ?? '-'}</td>
                <td className="py-3 text-right">
                  <span className="text-yellow-400 font-semibold">{mv.currentValue.toFixed(1)}M</span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {mv.priceChange > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : mv.priceChange < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-500" />
                    )}
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        mv.priceChange > 0 ? 'text-green-400' : mv.priceChange < 0 ? 'text-red-400' : 'text-gray-500',
                      )}
                    >
                      {mv.priceChange > 0 ? '+' : ''}{mv.priceChange.toFixed(1)}
                    </span>
                  </div>
                </td>
                {onBuy && (
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onBuy(mv)}
                      className="px-3 py-1.5 bg-f1-red hover:bg-f1-red-dark text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Comprar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
