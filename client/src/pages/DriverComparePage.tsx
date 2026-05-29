import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DriverComparison } from '../components/drivers/DriverComparison';
import { driversApi } from '../api/drivers.api';
import type { DriverDetail } from '../types';

export default function DriverComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [driver1, setDriver1] = useState<DriverDetail | null>(null);
  const [driver2, setDriver2] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id1 = searchParams.get('driver1');
  const id2 = searchParams.get('driver2');

  useEffect(() => {
    if (!id1 || !id2) return;

    const fetchBoth = async () => {
      try {
        setLoading(true);
        setError(null);
        const [d1, d2] = await Promise.all([
          driversApi.getDriverById(id1),
          driversApi.getDriverById(id2),
        ]);
        setDriver1(d1);
        setDriver2(d2);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar pilotos');
      } finally {
        setLoading(false);
      }
    };

    fetchBoth();
  }, [id1, id2]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Comparación de Pilotos</h1>
          <p className="text-gray-400 mt-1">Compara estadísticas lado a lado</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setSearchParams({ driver1: id2!, driver2: id1! })}
          >
            Intercambiar
          </Button>
        </div>
      </div>

      <DriverComparison
        driver1={driver1}
        driver2={driver2}
        loading={loading}
        error={error}
      />
    </div>
  );
}
