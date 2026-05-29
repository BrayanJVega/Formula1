import { Users, Coins, Trophy, X } from 'lucide-react';
import { Card } from '../ui/Card';
import type { FantasyTeamDetail, FantasyPick } from '../../types/fantasy.types';

interface FantasyTeamCardProps {
  team: FantasyTeamDetail;
  onRemovePick?: (pickId: string) => void;
  readonly?: boolean;
}

export function FantasyTeamCard({ team, onRemovePick, readonly }: FantasyTeamCardProps) {
  const activePicks = team.picks.filter((p) => p.isActive);
  const drivers = activePicks.filter((p) => p.type === 'driver');
  const constructors = activePicks.filter((p) => p.type === 'constructor');

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{team.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Tu Equipo Fantástico</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="font-bold text-lg">{team.budget.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500">Presupuesto</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-f1-red">
              <Trophy className="w-4 h-4" />
              <span className="font-bold text-lg">{team.totalScore.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500">Puntos</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Pilotos ({drivers.length}/5)
            </h3>
          </div>
          <div className="space-y-2">
            {drivers.map((pick) => (
              <PickRow key={pick.id} pick={pick} onRemove={onRemovePick} readonly={readonly} />
            ))}
            {drivers.length === 0 && (
              <p className="text-gray-600 text-sm italic">Sin pilotos seleccionados</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Constructor ({constructors.length}/1)
            </h3>
          </div>
          <div className="space-y-2">
            {constructors.map((pick) => (
              <PickRow key={pick.id} pick={pick} onRemove={onRemovePick} readonly={readonly} />
            ))}
            {constructors.length === 0 && (
              <p className="text-gray-600 text-sm italic">Sin constructor seleccionado</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface PickRowProps {
  pick: FantasyPick;
  onRemove?: (pickId: string) => void;
  readonly?: boolean;
}

function PickRow({ pick, onRemove, readonly }: PickRowProps) {
  return (
    <div className="flex items-center justify-between bg-f1-gray-dark rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-f1-red" />
        <div>
          <p className="text-white text-sm font-medium">
            {pick.type === 'driver' ? `Driver #${pick.driverId?.slice(0, 8)}` : `Constructor #${pick.teamId?.slice(0, 8)}`}
          </p>
          <p className="text-xs text-gray-500">{pick.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-yellow-400 font-semibold text-sm">{pick.cost.toFixed(1)}M</span>
        {!readonly && onRemove && (
          <button
            onClick={() => onRemove(pick.id)}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
