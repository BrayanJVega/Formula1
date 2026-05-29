import { DriverList } from '../components/drivers/DriverList';

export default function DriversPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Pilotos</h1>
        <p className="text-gray-400 mt-1">Temporada 2025</p>
      </div>
      <DriverList />
    </div>
  );
}
