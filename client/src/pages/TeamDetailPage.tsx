import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamDetail } from '../components/teams/TeamDetail';
import { useTeamStore } from '../store/team.store';

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTeam, isLoading, error, fetchTeamById } = useTeamStore();

  useEffect(() => {
    if (id) {
      fetchTeamById(id);
    }
  }, [id, fetchTeamById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-f1-red border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Equipo no encontrado</p>
      </div>
    );
  }

  return (
    <TeamDetail
      team={selectedTeam}
      onBack={() => navigate('/teams')}
    />
  );
}
