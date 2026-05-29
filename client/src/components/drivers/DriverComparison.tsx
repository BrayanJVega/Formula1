import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { nationalityFlag } from '../../utils/formatters';

interface ComparableDriver {
  id: string;
  name: string;
  number: number;
  nationality: string;
  team: { id: string; name: string; logoUrl?: string };
  photoUrl?: string;
  stats?: {
    championships: number;
    wins: number;
    podiums: number;
    poles: number;
    fastestLaps: number;
    totalPoints: number;
    racesEntered: number;
    seasonPoints: number;
    seasonPosition: number;
  };
}

interface DriverComparisonProps {
  driver1: ComparableDriver | null;
  driver2: ComparableDriver | null;
  loading: boolean;
  error: string | null;
}

function StatRow({ label, value1, value2, format }: { label: string; value1: number; value2: number; format?: (v: number) => string }) {
  const fmt = format ?? ((v: number) => v.toString());
  const d1 = fmt(value1);
  const d2 = fmt(value2);
  const better1 = value1 > value2;
  const better2 = value2 > value1;
  const tie = value1 === value2;

  return (
    <tr className="border-b border-f1-gray-light/20">
      <td className={clsx('py-3 px-4 text-right font-semibold', better1 && 'text-f1-red', tie && 'text-white')}>
        {d1}
      </td>
      <td className="py-3 px-4 text-gray-400 text-sm font-medium uppercase tracking-wider text-center">
        {label}
      </td>
      <td className={clsx('py-3 px-4 font-semibold', better2 && 'text-f1-red', tie && 'text-white')}>
        {d2}
      </td>
    </tr>
  );
}

export function DriverComparison({ driver1, driver2, loading, error }: DriverComparisonProps) {
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

  if (!driver1 || !driver2) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Selecciona dos pilotos para comparar.</p>
      </div>
    );
  }

  const stats: { label: string; key: keyof NonNullable<ComparableDriver['stats']>; format?: (v: number) => string }[] = [
    { label: 'Campeonatos', key: 'championships' },
    { label: 'Victorias', key: 'wins' },
    { label: 'Podios', key: 'podiums' },
    { label: 'Poles', key: 'poles' },
    { label: 'Vueltas Rápidas', key: 'fastestLaps' },
    { label: 'Puntos Totales', key: 'totalPoints' },
    { label: 'Carreras Disputadas', key: 'racesEntered' },
    { label: 'Puntos de Temporada', key: 'seasonPoints' },
    { label: 'Posición en Temporada', key: 'seasonPosition', format: (v) => `P${v}` },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <DriverProfile driver={driver1} />
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-f1-red">VS</span>
        </div>
        <DriverProfile driver={driver2} />
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4 text-center">Comparación de Estadísticas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="py-3 px-4 text-right text-sm text-gray-400 font-medium">{driver1.name}</th>
                <th className="py-3 px-4 text-center text-sm text-gray-400 font-medium">Estadística</th>
                <th className="py-3 px-4 text-left text-sm text-gray-400 font-medium">{driver2.name}</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(({ label, key, format }) => {
                const v1 = (driver1.stats?.[key] ?? 0) as number;
                const v2 = (driver2.stats?.[key] ?? 0) as number;
                return <StatRow key={key} label={label} value1={v1} value2={v2} format={format} />;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DriverProfile({ driver }: { driver: ComparableDriver }) {
  return (
    <Card className="text-center">
      <div className="w-24 h-24 rounded-full bg-f1-gray-dark mx-auto mb-3 flex items-center justify-center overflow-hidden">
        {driver.photoUrl ? (
          <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-f1-red">
            {driver.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </span>
        )}
      </div>
      <div className="text-2xl mb-1">{nationalityFlag(driver.nationality)}</div>
      <h3 className="text-lg font-bold text-white">{driver.name}</h3>
      <p className="text-2xl font-bold text-f1-red">#{driver.number}</p>
      <p className="text-sm text-gray-400 mt-1">{driver.team.name}</p>
    </Card>
  );
}
