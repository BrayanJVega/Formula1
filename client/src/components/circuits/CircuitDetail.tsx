import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import type { Circuit } from '../../types/circuit.types';
import { getFlagEmoji } from '../../utils/flags';

interface CircuitDetailProps {
  circuit: Circuit | null;
  isLoading: boolean;
}

export function CircuitDetail({ circuit, isLoading }: CircuitDetailProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!circuit) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Circuito no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <span className="text-5xl">{getFlagEmoji(circuit.country)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{circuit.name}</h1>
              {circuit.isStreetCircuit && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-f1-red/20 text-f1-red border border-f1-red/30">
                  Circuito Urbano
                </span>
              )}
            </div>
            <p className="text-gray-400 text-lg">
              {circuit.city}, {circuit.country}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-f1-gray-dark rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Longitud</p>
            <p className="text-2xl font-bold text-white">{circuit.lengthKm.toFixed(1)} km</p>
          </div>
          <div className="text-center p-4 bg-f1-gray-dark rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Curvas</p>
            <p className="text-2xl font-bold text-white">{circuit.turns}</p>
          </div>
          <div className="text-center p-4 bg-f1-gray-dark rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Zonas DRS</p>
            <p className="text-2xl font-bold text-white">{circuit.drsZones}</p>
          </div>
          <div className="text-center p-4 bg-f1-gray-dark rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Primer GP</p>
            <p className="text-2xl font-bold text-white">{circuit.firstGpYear}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {circuit.altitude !== undefined && circuit.altitude !== null && (
            <div>
              <p className="text-sm text-gray-400">Altitud</p>
              <p className="text-white font-semibold">{circuit.altitude} m</p>
            </div>
          )}
          {circuit.capacity !== undefined && circuit.capacity !== null && (
            <div>
              <p className="text-sm text-gray-400">Capacidad</p>
              <p className="text-white font-semibold">{circuit.capacity.toLocaleString()}</p>
            </div>
          )}
        </div>
      </Card>

      {circuit.lapRecord && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Récord de Vuelta</h2>
          <div className="space-y-2">
            <p className="text-gray-400">
              Récord:{' '}
              <span className="text-white font-semibold">{circuit.lapRecord}</span>
            </p>
            {circuit.lapRecordTime && (
              <p className="text-gray-400">
                Tiempo:{' '}
                <span className="text-f1-red font-mono font-bold text-lg">
                  {circuit.lapRecordTime.toFixed(3)}s
                </span>
              </p>
            )}
            {circuit.lapRecordYear && (
              <p className="text-gray-400">
                Año:{' '}
                <span className="text-white font-semibold">{circuit.lapRecordYear}</span>
              </p>
            )}
          </div>
        </Card>
      )}

      {circuit.description && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Descripción</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {circuit.description}
          </p>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Mapa del Circuito</h2>
        <div className="bg-f1-gray-dark rounded-lg flex items-center justify-center h-64 border-2 border-dashed border-f1-gray-light/20">
          {circuit.circuitMapUrl ? (
            <img
              src={circuit.circuitMapUrl}
              alt={`${circuit.name} circuit map`}
              className="max-h-full max-w-full object-contain p-4"
            />
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="mt-2 text-gray-500 text-sm">No hay mapa del circuito disponible</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
