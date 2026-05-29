import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRaceStore } from '../store/race.store';
import { usePredictionStore } from '../store/prediction.store';
import { PredictionForm } from '../components/predictions/PredictionForm';
import { PredictionHistory } from '../components/predictions/PredictionHistory';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatDate } from '../utils/formatters';

export default function PredictionsPage() {
  const { nextRace, fetchNextRace, isLoading: raceLoading } = useRaceStore();
  const { error } = usePredictionStore();
  const [predictionType, setPredictionType] = useState<'qualifying' | 'race'>('race');

  useEffect(() => {
    fetchNextRace();
  }, [fetchNextRace]);

  if (raceLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Pronósticos</h1>
        <p className="text-gray-400 mt-1">Haz tus pronósticos para las próximas carreras</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {nextRace ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">Próxima Carrera</h2>
                <p className="text-gray-400 text-sm">{nextRace.name} - {formatDate(nextRace.raceDate)}</p>
              </div>

              <div className="flex gap-2 mb-6">
                <Button
                  variant={predictionType === 'race' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setPredictionType('race')}
                >
                  Pronósticos de Carrera
                </Button>
                <Button
                  variant={predictionType === 'qualifying' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setPredictionType('qualifying')}
                >
                  Pronósticos de Clasificación
                </Button>
              </div>

              <PredictionForm
                key={`${nextRace.id}-${predictionType}`}
                race={nextRace}
                predictionType={predictionType}
              />
            </>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No hay próximas carreras</p>
                <p className="text-gray-500 text-sm mt-1">Vuelve cuando se anuncie la próxima carrera.</p>
                <Link to="/calendar">
                  <Button variant="ghost" className="mt-4">Ver Calendario</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <PredictionHistory />
        </div>
      </div>
    </div>
  );
}
