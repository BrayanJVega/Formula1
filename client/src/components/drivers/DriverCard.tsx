import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { nationalityFlag, getInitials } from '../../utils/formatters';
import type { Driver } from '../../types';

interface DriverCardProps {
  driver: Driver;
}

export function DriverCard({ driver }: DriverCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      hover
      className="cursor-pointer group"
      onClick={() => navigate(`/drivers/${driver.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-f1-gray-dark flex items-center justify-center overflow-hidden">
            {driver.photoUrl ? (
              <img
                src={driver.photoUrl}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-f1-red">
                {getInitials(driver.name)}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{nationalityFlag(driver.nationality)}</span>
              <span className="text-2xl font-bold text-f1-red">#{driver.number}</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-f1-red transition-colors">
              {driver.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {driver.team.logoUrl && (
          <img src={driver.team.logoUrl} alt={driver.team.name} className="w-5 h-5 object-contain" />
        )}
        <span>{driver.team.name}</span>
      </div>
    </Card>
  );
}
