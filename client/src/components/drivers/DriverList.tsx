import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { DriverCard } from './DriverCard';
import { useDriverStore } from '../../store/driver.store';

export function DriverList() {
  const { drivers, loading, error, pagination, fetchDrivers } = useDriverStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

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

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar pilotos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-f1-gray border border-f1-gray-light/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-f1-red transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          {search ? 'Ningún piloto coincide con tu búsqueda.' : 'No se encontraron pilotos.'}
        </div>
      )}

      {pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <p className="text-sm text-gray-400">
            Mostrando {drivers.length} de {pagination.total} pilotos
          </p>
        </div>
      )}
    </div>
  );
}
