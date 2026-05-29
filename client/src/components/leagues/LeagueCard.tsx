import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Users, Trophy, User, ChevronRight } from 'lucide-react';
import type { MyLeague } from '../../types/league.types';

interface LeagueCardProps {
  myLeague: MyLeague;
}

export function LeagueCard({ myLeague }: LeagueCardProps) {
  const navigate = useNavigate();
  const { league, memberCount, yourRole, yourPosition } = myLeague;

  return (
    <Card hover className="cursor-pointer" onClick={() => navigate(`/leagues/${league.id}`)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{league.name}</h3>
          {league.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{league.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {memberCount}/{league.maxMembers}
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={14} />
              #{yourPosition}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <User size={14} />
              {yourRole}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="bg-f1-gray-light/20 rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-400">Código</span>
            <p className="text-white font-mono text-sm font-bold tracking-wider">{league.code}</p>
          </div>
          <ChevronRight size={20} className="text-gray-500" />
        </div>
      </div>
    </Card>
  );
}
