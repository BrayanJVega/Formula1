import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DriverDetail } from '../components/drivers/DriverDetail';
import { useDriverStore } from '../store/driver.store';

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedDriver, loading, error, fetchDriverById } = useDriverStore();

  useEffect(() => {
    if (id) fetchDriverById(id);
  }, [id, fetchDriverById]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <DriverDetail driver={selectedDriver} loading={loading} error={error} />
    </div>
  );
}
