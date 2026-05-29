import { useAuthStore } from '../store/auth.store';
import { Card } from '../components/ui/Card';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Bienvenido, {user?.username || 'F1 Fan'}
        </h1>
        <p className="text-gray-400 mt-1">Tu panel de F1 Predictor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Próxima Carrera</h3>
          <p className="text-xl font-bold text-white">No hay próximas carreras</p>
          <p className="text-gray-500 text-sm mt-1">Datos de temporada próximamente</p>
        </Card>

        <Card>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Tu Rango</h3>
          <p className="text-3xl font-bold text-f1-red">--</p>
          <p className="text-gray-500 text-sm mt-1">Haz tu primer pronóstico</p>
        </Card>

        <Card>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Puntos</h3>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-gray-500 text-sm mt-1">Empieza a pronosticar para ganar puntos</p>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
            Clasificación del Campeonato
          </h3>
          <div className="flex items-center justify-center h-48 text-gray-500">
            <p className="text-center">La clasificación de pilotos aparecerá aquí cuando los datos de la temporada estén cargados.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
