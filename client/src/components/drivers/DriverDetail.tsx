import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Zap, Clock, Target, MapPin, Calendar, Flag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { nationalityFlag, formatDate, formatPosition } from '../../utils/formatters';
import type { DriverDetail as DriverDetailType } from '../../types';

interface DriverDetailProps {
  driver: DriverDetailType | null;
  loading: boolean;
  error: string | null;
}

export function DriverDetail({ driver, loading, error }: DriverDetailProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Piloto no encontrado</p>
      </div>
    );
  }

  const statItems = [
    { label: 'Campeonatos', value: driver.stats?.championships ?? 0, icon: Trophy },
    { label: 'Victorias', value: driver.stats?.wins ?? 0, icon: Medal },
    { label: 'Podios', value: driver.stats?.podiums ?? 0, icon: Medal },
    { label: 'Poles', value: driver.stats?.poles ?? 0, icon: Zap },
    { label: 'Vueltas Rápidas', value: driver.stats?.fastestLaps ?? 0, icon: Clock },
    { label: 'Puntos Totales', value: driver.stats?.totalPoints ?? 0, icon: Target },
    { label: 'Carreras Disputadas', value: driver.stats?.racesEntered ?? 0, icon: Flag },
  ];

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/drivers')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Pilotos
      </Button>

      <div className="bg-f1-gray rounded-xl p-8 border border-f1-gray-light/20 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-40 h-40 rounded-full bg-f1-gray-dark flex items-center justify-center overflow-hidden shrink-0">
            {driver.photoUrl ? (
              <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-f1-red">
                {driver.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{nationalityFlag(driver.nationality)}</span>
              <h1 className="text-4xl font-bold text-white">{driver.name}</h1>
            </div>

            <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-f1-red">#{driver.number}</span>
                <span>Número</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{driver.nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(driver.dateOfBirth)}</span>
              </div>
              <div className="flex items-center gap-2">
                {driver.team.logoUrl && (
                  <img src={driver.team.logoUrl} alt="" className="w-5 h-5 object-contain" />
                )}
                <span className="text-white font-medium">{driver.team.name}</span>
              </div>
            </div>

            {driver.biography && (
              <p className="mt-6 text-gray-300 leading-relaxed">{driver.biography}</p>
            )}
          </div>
        </div>
      </div>

      {driver.stats && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Estadísticas de Carrera</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item) => (
              <Card key={item.label}>
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-5 h-5 text-f1-red" />
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-f1-red" />
                <span className="text-sm text-gray-400">Posición en Temporada</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatPosition(driver.stats.seasonPosition)}
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-f1-red" />
                <span className="text-sm text-gray-400">Puntos de Temporada</span>
              </div>
              <p className="text-2xl font-bold text-white">{driver.stats.seasonPoints}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
