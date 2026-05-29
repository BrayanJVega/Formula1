import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { PredictionCard } from './PredictionCard';
import { usePredictionStore } from '../../store/prediction.store';
import type { Race } from '../../types/race.types';

interface PredictionHistoryProps {
  races?: Race[];
}

export function PredictionHistory({ races }: PredictionHistoryProps) {
  const { predictions, isLoading, pagination, fetchMyPredictions } = usePredictionStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMyPredictions(page);
  }, [page, fetchMyPredictions]);

  const getRaceName = (raceId: string) => {
    return races?.find((r) => r.id === raceId)?.name;
  };

  if (isLoading && predictions.length === 0) {
    return (
      <Card>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-400">Aún no has hecho pronósticos.</p>
          <p className="text-gray-500 text-sm mt-1">¡Envía tu primer pronóstico arriba!</p>
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Historial de Pronósticos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            raceName={getRaceName(prediction.raceId)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-gray-400 text-sm">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
