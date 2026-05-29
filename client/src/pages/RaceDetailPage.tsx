import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRaceStore } from '../store/race.store';
import { RaceDetail } from '../components/races/RaceDetail';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export default function RaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedRace, isLoading, error, fetchRaceById } = useRaceStore();

  useEffect(() => {
    if (id) fetchRaceById(id);
  }, [id, fetchRaceById]);

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
        <Link to="/calendar" className="inline-block mb-6">
          <Button variant="ghost">&larr; Volver al Calendario</Button>
        </Link>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedRace) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/calendar" className="inline-block mb-6">
          <Button variant="ghost">&larr; Volver al Calendario</Button>
        </Link>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Carrera no encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/calendar" className="inline-block mb-6">
        <Button variant="ghost">&larr; Volver al Calendario</Button>
      </Link>
      <RaceDetail race={selectedRace} />
    </div>
  );
}
