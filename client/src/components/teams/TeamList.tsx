import { TeamCard } from './TeamCard';
import type { Team } from '../../types/team.types';

interface TeamListProps {
  teams: Team[];
  onTeamClick?: (id: string) => void;
}

export function TeamList({ teams, onTeamClick }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No se encontraron equipos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onClick={onTeamClick ? () => onTeamClick(team.id) : undefined}
        />
      ))}
    </div>
  );
}
