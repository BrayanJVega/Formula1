import { useEffect } from 'react';
import { useRaceStore } from '../store/race.store';
import { useAIStore } from '../store/ai.store';
import { AIPredictionsPanel } from '../components/ai/AIPredictionsPanel';
import { WinProbabilityChart } from '../components/ai/WinProbabilityChart';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Brain } from 'lucide-react';

export default function AIPredictionsPage() {
  const { nextRace, fetchNextRace, isLoading: raceLoading } = useRaceStore();
  const { predictions, winProbabilities, isLoading: aiLoading, error, fetchPredictions, fetchWinProbabilities } = useAIStore();

  useEffect(() => {
    fetchNextRace();
  }, [fetchNextRace]);

  useEffect(() => {
    if (nextRace) {
      fetchPredictions(nextRace.id);
      fetchWinProbabilities(nextRace.id);
    }
  }, [nextRace, fetchPredictions, fetchWinProbabilities]);

  if (raceLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!nextRace) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No hay próximas carreras</p>
            <p className="text-gray-500 text-sm mt-1">Los pronósticos con IA aparecerán aquí para la próxima carrera.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-f1-red" />
          <div>
            <h1 className="text-3xl font-bold text-white">Pronósticos con IA</h1>
            <p className="text-gray-400 mt-1">
              Pronósticos estadísticos para {nextRace.name}
            </p>
          </div>
        </div>
      </div>

      {aiLoading && !predictions ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {predictions && <AIPredictionsPanel predictions={predictions} />}
          </div>
          <div className="lg:col-span-2">
            <Card>
              <WinProbabilityChart probabilities={winProbabilities} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
