import { useMemo } from 'react';
import { clsx } from 'clsx';
import { RaceCard } from './RaceCard';
import type { Race } from '../../types/race.types';

interface RaceCalendarProps {
  races: Race[];
  nextRaceId?: string;
}

interface MonthGroup {
  month: string;
  races: Race[];
}

function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
}

export function RaceCalendar({ races, nextRaceId }: RaceCalendarProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, Race[]> = {};
    for (const race of races) {
      const key = formatMonth(race.raceDate);
      if (!groups[key]) groups[key] = [];
      groups[key].push(race);
    }
    return Object.entries(groups).map(([month, monthRaces]): MonthGroup => ({
      month,
      races: monthRaces,
    }));
  }, [races]);

  if (races.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No se encontraron carreras para esta temporada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {grouped.map((group) => (
        <div key={group.month}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-f1-red rounded-full" />
            {group.month}
          </h2>
          <div className="space-y-3">
            {group.races.map((race) => (
              <div key={race.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center w-10">
                  <div
                    className={clsx(
                      'w-3 h-3 rounded-full border-2',
                      race.id === nextRaceId
                        ? 'bg-f1-red border-f1-red'
                        : 'bg-f1-gray border-gray-600',
                    )}
                  />
                  {group.races.indexOf(race) < group.races.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-700 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <RaceCard race={race} highlight={race.id === nextRaceId} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
