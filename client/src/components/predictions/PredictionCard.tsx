import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { Prediction } from '../../types/prediction.types';
import { formatDate } from '../../utils/formatters';

interface PredictionCardProps {
  prediction: Prediction;
  raceName?: string;
}

export function PredictionCard({ prediction, raceName }: PredictionCardProps) {
  const typeLabel = prediction.type === 'qualifying' ? 'Clasificación' : 'Carrera';

  return (
    <Link to={`/predictions/${prediction.id}`}>
      <Card hover className="cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${
            prediction.type === 'qualifying'
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-f1-red/20 text-f1-red'
          }`}>
            {typeLabel}
          </span>
          {prediction.isLocked ? (
            <span className="text-xs text-green-400 font-medium">Puntuado</span>
          ) : (
            <span className="text-xs text-yellow-400 font-medium">Pendiente</span>
          )}
        </div>

        {raceName && (
          <h3 className="text-white font-semibold mb-1">{raceName}</h3>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-400 text-sm">
            {prediction.submittedAt ? formatDate(prediction.submittedAt) : '-'}
          </span>
          <span className="text-xl font-bold text-white">
            {prediction.totalScore > 0 ? `${prediction.totalScore} pts` : '-'}
          </span>
        </div>
      </Card>
    </Link>
  );
}
