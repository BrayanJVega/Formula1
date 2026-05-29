import { clsx } from 'clsx';
import { MapPin, Wrench, Trophy, Flag } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Team } from '../../types/team.types';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <Card
      hover
      className={clsx('cursor-pointer transition-colors', onClick && 'hover:border-f1-red/50')}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-f1-gray-dark flex items-center justify-center text-2xl font-bold text-f1-red shrink-0">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain rounded-lg" />
          ) : (
            team.name.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
          <p className="text-sm text-gray-400 truncate">{team.fullName}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Flag className="w-4 h-4 text-f1-red shrink-0" />
          <span>{team.nationality}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4 text-f1-red shrink-0" />
          <span>{team.base}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Wrench className="w-4 h-4 text-f1-red shrink-0" />
          <span>{team.powerUnit}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-f1-gray-light/20 flex items-center gap-2 text-sm text-gray-400">
        <Trophy className="w-4 h-4 text-f1-red" />
        <span>Fundado {team.foundedYear}</span>
        {!team.isActive && (
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-red-900/50 text-red-400">
            Inactivo
          </span>
        )}
      </div>
    </Card>
  );
}
