import { Building2, MapPin, Wrench, Trophy, Calendar, User, Flag, Car } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TeamDetail as TeamDetailType } from '../../types/team.types';

interface TeamDetailProps {
  team: TeamDetailType;
  onBack?: () => void;
}

export function TeamDetail({ team, onBack }: TeamDetailProps) {
  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          &larr; Volver a Equipos
        </Button>
      )}

      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-xl bg-f1-gray-dark flex items-center justify-center text-4xl font-bold text-f1-red shrink-0">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              team.name.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
            <p className="text-lg text-gray-400">{team.fullName}</p>
            {team.biography && (
              <p className="mt-4 text-gray-300 leading-relaxed">{team.biography}</p>
            )}
          </div>
          {!team.isActive && (
            <span className="px-3 py-1 text-sm rounded-full bg-red-900/50 text-red-400 shrink-0">
              Inactivo
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-f1-red" />
              Información del Equipo
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Flag className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Nacionalidad:</span>
                <span className="text-white">{team.nationality}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Base:</span>
                <span className="text-white">{team.base}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Jefe de Equipo:</span>
                <span className="text-white">{team.teamPrincipal}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Fundado:</span>
                <span className="text-white">{team.foundedYear}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-f1-red" />
              Especificaciones Técnicas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Car className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Chasis:</span>
                <span className="text-white">{team.chassis}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Wrench className="w-4 h-4 text-f1-red shrink-0" />
                <span className="text-gray-400">Unidad de Potencia:</span>
                <span className="text-white">{team.powerUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {team.stats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-f1-red" />
            Estadísticas del Equipo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="Campeonatos" value={team.stats.championships} />
            <StatItem label="Victorias" value={team.stats.wins} />
            <StatItem label="Podios" value={team.stats.podiums} />
            <StatItem label="Poles" value={team.stats.poles} />
            <StatItem label="Vueltas Rápidas" value={team.stats.fastestLaps} />
            <StatItem label="Puntos de Temporada" value={team.stats.totalPoints} />
            <StatItem label="Carreras Disputadas" value={team.stats.racesEntered} />
            <StatItem label="Posición en Temporada" value={team.stats.seasonPosition} />
          </div>
        </Card>
      )}

      {team.drivers && team.drivers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-f1-red" />
            Pilotos ({team.drivers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.drivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-f1-gray-dark/50"
              >
                <div className="w-10 h-10 rounded-full bg-f1-gray flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {driver.photoUrl ? (
                    <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    `#${driver.number}`
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{driver.name}</p>
                  <p className="text-xs text-gray-400">
                    #{driver.number} &middot; {driver.nationality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg bg-f1-gray-dark/50 text-center">
      <p className="text-2xl font-bold text-f1-red">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
