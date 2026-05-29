import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePredictionStore } from '../store/prediction.store';
import { useRaceStore } from '../store/race.store';
import { ScoreBreakdown } from '../components/predictions/ScoreBreakdown';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

export default function PredictionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    currentPrediction,
    isLoading,
    error,
    fetchPredictionById,
  } = usePredictionStore();
  const { selectedRace, fetchRaceById } = useRaceStore();

  useEffect(() => {
    if (id) {
      fetchPredictionById(id);
    }
  }, [id, fetchPredictionById]);

  useEffect(() => {
    if (currentPrediction?.raceId && currentPrediction.raceId !== selectedRace?.id) {
      fetchRaceById(currentPrediction.raceId);
    }
  }, [currentPrediction?.raceId, fetchRaceById, selectedRace?.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/predictions">
          <Button variant="ghost">&larr; Volver a Pronósticos</Button>
        </Link>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mt-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentPrediction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/predictions">
          <Button variant="ghost">&larr; Volver a Pronósticos</Button>
        </Link>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Pronóstico no encontrado.</p>
        </div>
      </div>
    );
  }

  const typeLabel = currentPrediction.type === 'qualifying' ? 'Clasificación' : 'Carrera';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/predictions" className="inline-block mb-6">
        <Button variant="ghost">&larr; Back to Predictions</Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedRace?.name || 'Pronóstico'} - {typeLabel}
                </h1>
                {selectedRace && (
                  <p className="text-gray-400 text-sm mt-1">{formatDate(selectedRace.raceDate)}</p>
                )}
              </div>
              <span className={`text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded ${
                currentPrediction.type === 'qualifying'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-f1-red/20 text-f1-red'
              }`}>
                {typeLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm">Estado:</span>
              {currentPrediction.isLocked ? (
                <span className="text-green-400 text-sm font-medium">Puntuado</span>
              ) : (
                <span className="text-yellow-400 text-sm font-medium">Pendiente</span>
              )}
            </div>

            <div className="space-y-4">
              {currentPrediction.polePrediction && (
                <div>
                  <span className="text-gray-400 text-sm">Pole Position:</span>
                  <p className="text-white font-medium">{currentPrediction.polePrediction}</p>
                </div>
              )}

              {currentPrediction.top3Prediction && currentPrediction.top3Prediction.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Pronóstico Top 3:</span>
                  <ol className="list-decimal list-inside text-white">
                    {currentPrediction.top3Prediction.map((driverId, idx) => (
                      <li key={idx}>{driverId}</li>
                    ))}
                  </ol>
                </div>
              )}

              {currentPrediction.top10Prediction && currentPrediction.top10Prediction.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Pronóstico Top 10:</span>
                  <ol className="list-decimal list-inside text-white text-sm grid grid-cols-2 gap-1">
                    {currentPrediction.top10Prediction.map((driverId, idx) => (
                      <li key={idx}>{driverId}</li>
                    ))}
                  </ol>
                </div>
              )}

              {currentPrediction.winnerPrediction && (
                <div>
                  <span className="text-gray-400 text-sm">Ganador de la Carrera:</span>
                  <p className="text-white font-medium">{currentPrediction.winnerPrediction}</p>
                </div>
              )}

              {currentPrediction.podiumPrediction && currentPrediction.podiumPrediction.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Podio:</span>
                  <ol className="list-decimal list-inside text-white">
                    {currentPrediction.podiumPrediction.map((driverId, idx) => (
                      <li key={idx}>{driverId}</li>
                    ))}
                  </ol>
                </div>
              )}

              {currentPrediction.fastestLapPrediction && (
                <div>
                  <span className="text-gray-400 text-sm">Vuelta Rápida:</span>
                  <p className="text-white font-medium">{currentPrediction.fastestLapPrediction}</p>
                </div>
              )}

              {currentPrediction.safetyCarPrediction !== undefined && (
                <div>
                  <span className="text-gray-400 text-sm">Safety Car:</span>
                  <p className="text-white font-medium">{currentPrediction.safetyCarPrediction ? 'Sí' : 'No'}</p>
                </div>
              )}

              {currentPrediction.redFlagPrediction !== undefined && (
                <div>
                  <span className="text-gray-400 text-sm">Bandera Roja:</span>
                  <p className="text-white font-medium">{currentPrediction.redFlagPrediction ? 'Sí' : 'No'}</p>
                </div>
              )}

              {currentPrediction.dnfsPrediction !== undefined && (
                <div>
                  <span className="text-gray-400 text-sm">Número de DNFs:</span>
                  <p className="text-white font-medium">{currentPrediction.dnfsPrediction}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {currentPrediction.scores ? (
            <ScoreBreakdown scores={currentPrediction.scores} />
          ) : currentPrediction.isLocked ? (
            <Card>
              <h3 className="text-lg font-bold text-white mb-2">Puntuación</h3>
              <p className="text-3xl font-bold text-f1-red">{currentPrediction.totalScore} pts</p>
            </Card>
          ) : (
            <Card>
              <h3 className="text-lg font-bold text-white mb-2">Puntuación</h3>
              <p className="text-gray-400">Aún sin puntuar</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
