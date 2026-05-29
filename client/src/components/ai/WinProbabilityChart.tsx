import type { WinProbability } from '../../types/ai.types';

interface WinProbabilityChartProps {
  probabilities: WinProbability[];
  maxBars?: number;
}

export function WinProbabilityChart({ probabilities, maxBars = 15 }: WinProbabilityChartProps) {
  const topDrivers = probabilities.slice(0, maxBars);
  const maxProb = Math.max(...topDrivers.map((d) => d.probability), 1);

  const getBarColor = (probability: number) => {
    if (probability >= 25) return 'bg-green-500';
    if (probability >= 15) return 'bg-blue-500';
    if (probability >= 8) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white">Probabilidad de Victoria</h3>

      <div className="space-y-2">
        {topDrivers.map((driver) => (
          <div key={driver.driverId} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6 text-right shrink-0">
              #{driver.rank}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white truncate">
                  {driver.driverName}
                </span>
                <span className="text-sm text-gray-400 font-mono shrink-0 ml-2">
                  {driver.probability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(driver.probability)}`}
                  style={{ width: `${(driver.probability / maxProb) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
