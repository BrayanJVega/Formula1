import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import type { Race } from '../../types/race.types';

interface RaceDetailProps {
  race: Race;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: { label: 'Próxima', className: 'bg-yellow-500/20 text-yellow-400' },
  qualifying_complete: { label: 'Clasificación Completada', className: 'bg-blue-500/20 text-blue-400' },
  completed: { label: 'Completada', className: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Cancelada', className: 'bg-red-500/20 text-red-400' },
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function RaceDetail({ race }: RaceDetailProps) {
  const config = statusConfig[race.status] || statusConfig.upcoming;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🏁</span>
              <div>
                <p className="text-sm text-gray-400">Ronda {race.round}</p>
                <h1 className="text-3xl font-bold text-white">{race.name}</h1>
              </div>
            </div>
            <span className={clsx('inline-block text-xs font-medium px-3 py-1 rounded-full', config.className)}>
              {config.label}
            </span>
          </div>
          <span className="text-3xl font-bold text-f1-red">R{race.round}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Circuito</h3>
            <div className="space-y-2">
              <p className="text-white font-semibold">{race.circuit.name}</p>
              <p className="text-gray-400 text-sm">{race.circuit.city}, {race.circuit.country}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Longitud: </span>
                  <span className="text-white">{race.circuit.lengthKm} km</span>
                </div>
                <div>
                  <span className="text-gray-500">Curvas: </span>
                  <span className="text-white">{race.circuit.turns}</span>
                </div>
                <div>
                  <span className="text-gray-500">Zonas DRS: </span>
                  <span className="text-white">{race.circuit.drsZones}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-1">Vueltas: {race.laps}</p>
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Horario</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Clasificación</p>
                <p className="text-white text-sm">
                  {formatDateTime(race.qualifyingDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Carrera</p>
                <p className="text-white text-sm">
                  {formatDateTime(race.raceDate)}
                </p>
              </div>
              <p className="text-gray-500 text-xs mt-1">Zona Horaria: {race.localTimezone}</p>
            </div>
          </div>
        </div>
      </Card>

      {race.status === 'completed' && (
        <Card>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Resultados de la Carrera</h3>
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>Los resultados aparecerán aquí una vez que la carrera esté completada.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
