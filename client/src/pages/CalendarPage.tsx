import { useEffect } from 'react';
import { useRaceStore } from '../store/race.store';
import { RaceCalendar } from '../components/races/RaceCalendar';
import { Spinner } from '../components/ui/Spinner';

const CURRENT_SEASON_ID = import.meta.env.VITE_CURRENT_SEASON_ID || 'default-season-id';

export default function CalendarPage() {
  const { races, nextRace, isLoading, error, fetchRaces, fetchNextRace } = useRaceStore();

  useEffect(() => {
    fetchRaces(CURRENT_SEASON_ID);
    fetchNextRace();
  }, [fetchRaces, fetchNextRace]);

  if (isLoading && races.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Calendario de Carreras</h1>
        <p className="text-gray-400 mt-1">Temporada F1 2025</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <RaceCalendar races={races} nextRaceId={nextRace?.id} />
    </div>
  );
}
