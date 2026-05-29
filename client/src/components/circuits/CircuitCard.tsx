import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { Circuit } from '../../types/circuit.types';
import { getFlagEmoji } from '../../utils/flags';

interface CircuitCardProps {
  circuit: Circuit;
}

export function CircuitCard({ circuit }: CircuitCardProps) {
  return (
    <Link to={`/circuits/${circuit.id}`}>
      <Card hover className="h-full cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getFlagEmoji(circuit.country)}</span>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-f1-red transition-colors">
                {circuit.name}
              </h3>
              <p className="text-sm text-gray-400">
                {circuit.city}, {circuit.country}
              </p>
            </div>
          </div>
          {circuit.isStreetCircuit && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-f1-red/20 text-f1-red border border-f1-red/30">
              Urbano
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Longitud</p>
            <p className="text-lg font-semibold text-white">{circuit.lengthKm.toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Curvas</p>
            <p className="text-lg font-semibold text-white">{circuit.turns}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Zonas DRS</p>
            <p className="text-lg font-semibold text-white">{circuit.drsZones}</p>
          </div>
        </div>

        {circuit.firstGpYear && (
          <p className="mt-3 text-xs text-gray-500">
            Primer Gran Premio: {circuit.firstGpYear}
          </p>
        )}
      </Card>
    </Link>
  );
}
