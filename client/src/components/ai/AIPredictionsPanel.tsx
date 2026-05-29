import { clsx } from 'clsx';
import { Trophy, Zap, Timer, Shield, AlertTriangle, Gauge } from 'lucide-react';
import type { AIPrediction } from '../../types/ai.types';

interface AIPredictionsPanelProps {
  predictions: AIPrediction;
}

function ConfidenceBadge({ probability }: { probability: number }) {
  const getColor = (p: number) => {
    if (p >= 40) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (p >= 20) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getLabel = (p: number) => {
    if (p >= 40) return 'Alta';
    if (p >= 20) return 'Media';
    return 'Baja';
  };

  return (
    <span className={clsx(
      'text-xs px-2 py-0.5 rounded-full border font-medium',
      getColor(probability),
    )}>
      {getLabel(probability)} ({probability.toFixed(0)}%)
    </span>
  );
}

export function AIPredictionsPanel({ predictions }: AIPredictionsPanelProps) {
  const items = [
    {
      icon: Trophy,
      label: 'Ganador Pronosticado',
      value: predictions.predictedWinner.driverName,
      sub: predictions.predictedWinner.driverId ? (
        <ConfidenceBadge probability={predictions.predictedWinner.probability} />
      ) : null,
    },
    {
      icon: Gauge,
      label: 'Pole Pronosticada',
      value: predictions.predictedPolePosition.driverName,
      sub: predictions.predictedPolePosition.driverId ? (
        <ConfidenceBadge probability={predictions.predictedPolePosition.probability} />
      ) : null,
    },
    {
      icon: Timer,
      label: 'Pronóstico de Vuelta Rápida',
      value: predictions.predictedFastestLap.driverName,
      sub: predictions.predictedFastestLap.driverId ? (
        <ConfidenceBadge probability={predictions.predictedFastestLap.probability} />
      ) : null,
    },
    {
      icon: Shield,
      label: 'Probabilidad de Safety Car',
      value: `${predictions.safetyCarProbability}%`,
      sub: (
        <span className="text-xs text-gray-500">Probabilidad</span>
      ),
    },
    {
      icon: AlertTriangle,
      label: 'DNFs Pronosticados',
      value: `${predictions.predictedDnfCount} pilotos`,
      sub: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-f1-red" />
        <h3 className="text-lg font-bold text-white">Pronósticos de IA para la Carrera</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-f1-gray rounded-xl p-4 border border-f1-gray-light/20">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-4 h-4 text-f1-red" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {item.label}
              </span>
            </div>
            <div className="text-white font-semibold text-lg truncate">
              {item.value}
            </div>
            <div className="mt-1">{item.sub}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Podio Pronosticado
        </h4>
        <div className="space-y-2">
          {predictions.predictedPodium.map((driver, index) => (
            <div
              key={driver.driverId}
              className="flex items-center gap-3 bg-f1-gray rounded-lg px-4 py-3 border border-f1-gray-light/20"
            >
              <span className={clsx(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                index === 1 ? 'bg-gray-400/20 text-gray-300' :
                'bg-orange-700/20 text-orange-400',
              )}>
                {index + 1}
              </span>
              <span className="flex-1 text-white font-medium">{driver.driverName}</span>
              <ConfidenceBadge probability={driver.probability} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
