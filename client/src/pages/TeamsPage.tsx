import { useEffect } from 'react';
import { TeamList } from '../components/teams/TeamList';
import { useTeamStore } from '../store/team.store';
import { useNavigate } from 'react-router-dom';

export function TeamsPage() {
  const navigate = useNavigate();
  const { teams, isLoading, error, fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchTeams(true);
  }, [fetchTeams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-f1-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Equipos</h1>
        <p className="text-gray-400 mt-1">Explora los equipos de Fórmula 1 y su historia</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}

      <TeamList
        teams={teams}
        onTeamClick={(id) => navigate(`/teams/${id}`)}
      />
    </div>
  );
}
