import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { Race } from '../../types/race.types';

interface RaceCardProps {
  race: Race;
  highlight?: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: { label: 'Próxima', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  qualifying_complete: { label: 'Clasificación Completada', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Completada', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelada', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const countryFlags: Record<string, string> = {
  'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Azerbaijan': '🇦🇿', 'Bahrain': '🇧🇭',
  'Belgium': '🇧🇪', 'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'China': '🇨🇳',
  'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'France': '🇫🇷', 'Germany': '🇩🇪',
  'Hungary': '🇭🇺', 'India': '🇮🇳', 'Italy': '🇮🇹', 'Japan': '🇯🇵',
  'Mexico': '🇲🇽', 'Monaco': '🇲🇨', 'Morocco': '🇲🇦', 'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿', 'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Qatar': '🇶🇦',
  'Russia': '🇷🇺', 'Saudi Arabia': '🇸🇦', 'Singapore': '🇸🇬', 'South Africa': '🇿🇦',
  'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭',
  'Thailand': '🇹🇭', 'Turkey': '🇹🇷', 'UAE': '🇦🇪', 'UK': '🇬🇧',
  'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧', 'USA': '🇺🇸',
};

function getFlag(country: string): string {
  return countryFlags[country] || '🏁';
}

export function RaceCard({ race, highlight }: RaceCardProps) {
  const config = statusConfig[race.status] || statusConfig.upcoming;

  return (
    <Link to={`/races/${race.id}`}>
      <Card hover className={clsx('relative', highlight && 'ring-2 ring-f1-red')}>
        {highlight && (
          <span className="absolute -top-2 -right-2 bg-f1-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
            PRÓXIMA
          </span>
        )}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getFlag(race.circuit.country)}</span>
            <span className="text-3xl font-bold text-f1-red">R{race.round}</span>
          </div>
          <span className={clsx('text-xs font-medium px-2 py-1 rounded-full border', config.className)}>
            {config.label}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{race.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{race.circuit.name}</p>
        <p className="text-gray-500 text-xs">
          {new Date(race.raceDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </Card>
    </Link>
  );
}
