import { Card } from '../ui/Card';
import type { PredictionScore } from '../../types/prediction.types';

interface ScoreBreakdownProps {
  scores: PredictionScore;
}

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
  color: string;
}

function ScoreBar({ label, score, maxScore, color }: ScoreBarProps) {
  const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-white">{score} pts</span>
      </div>
      <div className="w-full bg-f1-gray-dark rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {

  const items = [
    { label: 'Pole Position', score: scores.poleScore, color: 'bg-purple-500' },
    { label: 'Ganador de la Carrera', score: scores.winnerScore, color: 'bg-yellow-500' },
    { label: 'Podio', score: scores.podiumScore, color: 'bg-green-500' },
    { label: 'Top 10', score: scores.top10Score, color: 'bg-blue-500' },
    { label: 'Vuelta Rápida', score: scores.fastestLapScore, color: 'bg-cyan-500' },
    { label: 'Safety Car', score: scores.safetyCarScore, color: 'bg-orange-500' },
    { label: 'Bandera Roja', score: scores.redFlagScore, color: 'bg-red-500' },
  ].filter((item) => item.score > 0);

  if (items.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Desglose de Puntuación</h3>
        <p className="text-gray-400">Aún no has ganado puntos.</p>
      </Card>
    );
  }

  const categoryMax = Math.max(...items.map((i) => i.score), 1);

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Desglose de Puntuación</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Puntuación Total</span>
          <span className="text-2xl font-bold text-f1-red">{scores.totalScore} pts</span>
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <ScoreBar
            key={item.label}
            label={item.label}
            score={item.score}
            maxScore={categoryMax}
            color={item.color}
          />
        ))}
      </div>
    </Card>
  );
}
