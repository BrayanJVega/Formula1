import { Card } from '../ui/Card';
import type { Incident, SafetyCarPeriod } from '../../types/simulation.types';

interface IncidentTimelineProps {
  incidents: Incident[];
  safetyCarPeriods: SafetyCarPeriod[];
  totalLaps: number;
}

const INCIDENT_ICONS: Record<string, string> = {
  crash: '💥',
  mechanical: '🔧',
  penalty: '⏱',
  spin: '🔄',
  collision: '💢',
};

export function IncidentTimeline({ incidents, safetyCarPeriods, totalLaps }: IncidentTimelineProps) {
  const allEvents = [
    ...incidents.map(i => ({ lap: i.lap, type: 'incident' as const, data: i })),
    ...safetyCarPeriods.map(s => ({ lap: s.startLap, type: 'safety_car' as const, data: s })),
  ].sort((a, b) => a.lap - b.lap);

  const lapIncrements = Math.max(1, Math.floor(totalLaps / 15));

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Cronología de la Carrera</h3>

      <div className="relative mb-6">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: totalLaps }, (_, i) => i + 1).filter(l => l % lapIncrements === 0 || l === 1 || l === totalLaps).map(lap => (
            <div key={lap} className="text-xs text-gray-500 flex-1 text-center">{lap}</div>
          ))}
        </div>
        <div className="relative h-4 bg-f1-gray-dark rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalLaps }, (_, i) => i + 1).map(lap => {
              const hasIncident = incidents.some(i => i.lap === lap);
              const isSC = safetyCarPeriods.some(s => lap >= s.startLap && lap <= s.endLap);
              let bg = 'bg-f1-gray';
              if (isSC) bg = 'bg-yellow-600/50';
              if (hasIncident) bg = 'bg-red-500/50';
              return (
                <div
                  key={lap}
                  className={`flex-1 ${bg} ${hasIncident ? 'border-r border-red-400' : ''}`}
                   title={`Vuelta ${lap}${hasIncident ? ' - Incidencia' : ''}${isSC ? ' - Safety Car' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {allEvents.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Sin incidencias durante esta carrera.</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {safetyCarPeriods.map((sc, idx) => (
            <div key={`sc-${idx}`} className="flex items-start gap-3 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
              <span className="text-lg">🚦</span>
              <div>
                <p className="text-yellow-400 text-sm font-medium">Período de Safety Car</p>
                <p className="text-gray-400 text-xs">Vueltas {sc.startLap}-{sc.endLap}: {sc.reason}</p>
              </div>
            </div>
          ))}
          {incidents.map((inc, idx) => (
            <div key={`inc-${idx}`} className="flex items-start gap-3 p-2 bg-f1-gray-dark rounded">
              <span className="text-lg">{INCIDENT_ICONS[inc.type]}</span>
              <div>
                <p className="text-white text-sm">
                  <span className="font-medium">{inc.driverId}</span> - {inc.description}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-500">Vuelta {inc.lap}</span>
                  {inc.causedDnf && <span className="text-xs text-red-400">DNF</span>}
                  {inc.safetyCarDeployed && <span className="text-xs text-yellow-400">SC Desplegado</span>}
                </div>
                {inc.involvedDrivers && inc.involvedDrivers.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Involucrados: {inc.involvedDrivers.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
