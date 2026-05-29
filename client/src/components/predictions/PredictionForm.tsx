import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePredictionStore } from '../../store/prediction.store';
import { useDriverStore } from '../../store/driver.store';
import type { PredictionFormData, PredictionType } from '../../types/prediction.types';
import type { Race } from '../../types/race.types';
import { formatDate } from '../../utils/formatters';

interface PredictionFormProps {
  race: Race;
  predictionType: PredictionType;
}

export function PredictionForm({ race, predictionType }: PredictionFormProps) {
  const { createPrediction, updatePrediction, racePrediction, isLoading } = usePredictionStore();
  const { drivers, fetchDrivers } = useDriverStore();
  const [type, setType] = useState<PredictionType>(predictionType);

  const isQualifying = type === 'qualifying';
  const existing = racePrediction?.type === type ? racePrediction : null;

  const [polePrediction, setPolePrediction] = useState(existing?.polePrediction ?? '');
  const [top3Prediction, setTop3Prediction] = useState<string[]>(existing?.top3Prediction ?? ['', '', '']);
  const [top10Prediction, setTop10Prediction] = useState<string[]>(existing?.top10Prediction ?? Array(10).fill(''));
  const [winnerPrediction, setWinnerPrediction] = useState(existing?.winnerPrediction ?? '');
  const [podiumPrediction, setPodiumPrediction] = useState<string[]>(existing?.podiumPrediction ?? ['', '', '']);
  const [fastestLapPrediction, setFastestLapPrediction] = useState(existing?.fastestLapPrediction ?? '');
  const [safetyCarPrediction, setSafetyCarPrediction] = useState<boolean | undefined>(existing?.safetyCarPrediction);
  const [redFlagPrediction, setRedFlagPrediction] = useState<boolean | undefined>(existing?.redFlagPrediction);
  const [dnfsPrediction, setDnfsPrediction] = useState<number | undefined>(existing?.dnfsPrediction);

  useEffect(() => {
    fetchDrivers({ isActive: true });
  }, [fetchDrivers]);

  useEffect(() => {
    if (existing) {
      setPolePrediction(existing.polePrediction ?? '');
      setTop3Prediction(existing.top3Prediction ?? ['', '', '']);
      setTop10Prediction(existing.top10Prediction ?? Array(10).fill(''));
      setWinnerPrediction(existing.winnerPrediction ?? '');
      setPodiumPrediction(existing.podiumPrediction ?? ['', '', '']);
      setFastestLapPrediction(existing.fastestLapPrediction ?? '');
      setSafetyCarPrediction(existing.safetyCarPrediction);
      setRedFlagPrediction(existing.redFlagPrediction);
      setDnfsPrediction(existing.dnfsPrediction);
    }
  }, [existing]);

  const activeDrivers = drivers.filter((d) => d.isActive);

  const handleTop3Change = (index: number, value: string) => {
    const updated = [...top3Prediction];
    updated[index] = value;
    setTop3Prediction(updated);
  };

  const handleTop10Change = (index: number, value: string) => {
    const updated = [...top10Prediction];
    updated[index] = value;
    setTop10Prediction(updated);
  };

  const handlePodiumChange = (index: number, value: string) => {
    const updated = [...podiumPrediction];
    updated[index] = value;
    setPodiumPrediction(updated);
  };

  const handleSubmit = async () => {
    const formData: PredictionFormData = {
      raceId: race.id,
      type,
      ...(isQualifying ? {
        polePrediction: polePrediction || undefined,
        top3Prediction: top3Prediction.every(Boolean) ? top3Prediction : undefined,
        top10Prediction: top10Prediction.every(Boolean) ? top10Prediction : undefined,
      } : {
        winnerPrediction: winnerPrediction || undefined,
        podiumPrediction: podiumPrediction.every(Boolean) ? podiumPrediction : undefined,
        fastestLapPrediction: fastestLapPrediction || undefined,
        safetyCarPrediction,
        redFlagPrediction,
        dnfsPrediction,
      }),
    };

    if (existing) {
      await updatePrediction(existing.id, formData);
    } else {
      await createPrediction({ ...formData, raceId: race.id });
    }
  };

  const renderDriverSelect = (
    value: string,
    onChange: (v: string) => void,
    label: string,
    placeholder = 'Seleccionar piloto',
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red"
      >
        <option value="">{placeholder}</option>
        {activeDrivers.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          {race.name} - Pronósticos de {isQualifying ? 'Clasificación' : 'Carrera'}
        </h2>
        <p className="text-gray-400 text-sm mt-1">{formatDate(race.raceDate)}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={isQualifying ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setType('qualifying')}
        >
          Clasificación
        </Button>
        <Button
          variant={!isQualifying ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setType('race')}
        >
          Carrera
        </Button>
      </div>

      <div className="space-y-6">
        {isQualifying ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDriverSelect(polePrediction, setPolePrediction, 'Pole Position')}
              {renderDriverSelect(fastestLapPrediction, setFastestLapPrediction, 'Más Rápido en Clasificación')}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Pronóstico Top 3 (Ordenado)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {top3Prediction.map((driverId, idx) => (
                  <div key={idx}>
                    {renderDriverSelect(
                      driverId,
                      (v) => handleTop3Change(idx, v),
                      `Position ${idx + 1}`,
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Pronóstico Top 10 (Ordenado)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {top10Prediction.map((driverId, idx) => (
                  <div key={idx}>
                    {renderDriverSelect(
                      driverId,
                      (v) => handleTop10Change(idx, v),
                      `Position ${idx + 1}`,
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDriverSelect(winnerPrediction, setWinnerPrediction, 'Ganador de la Carrera')}
              {renderDriverSelect(fastestLapPrediction, setFastestLapPrediction, 'Vuelta Rápida')}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Podio (Ordenado)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {podiumPrediction.map((driverId, idx) => (
                  <div key={idx}>
                    {renderDriverSelect(
                      driverId,
                      (v) => handlePodiumChange(idx, v),
                      `Position ${idx + 1}`,
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Safety Car</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSafetyCarPrediction(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      safetyCarPrediction === true
                        ? 'bg-f1-red text-white'
                        : 'bg-f1-gray-dark text-gray-400 hover:text-white'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setSafetyCarPrediction(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      safetyCarPrediction === false
                        ? 'bg-f1-red text-white'
                        : 'bg-f1-gray-dark text-gray-400 hover:text-white'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bandera Roja</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRedFlagPrediction(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      redFlagPrediction === true
                        ? 'bg-f1-red text-white'
                        : 'bg-f1-gray-dark text-gray-400 hover:text-white'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setRedFlagPrediction(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      redFlagPrediction === false
                        ? 'bg-f1-red text-white'
                        : 'bg-f1-gray-dark text-gray-400 hover:text-white'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Número de DNFs</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={dnfsPrediction ?? ''}
                  onChange={(e) => setDnfsPrediction(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className="w-full bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red"
                  placeholder="Número de DNFs"
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-4 border-t border-f1-gray-light/20">
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="w-full md:w-auto"
          >
            {existing ? 'Actualizar Pronóstico' : 'Enviar Pronóstico'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
