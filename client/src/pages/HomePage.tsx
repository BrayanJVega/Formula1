import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/auth.store';

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden bg-gradient-to-b from-f1-gray-dark via-f1-gray to-f1-gray-dark py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            <span className="text-f1-red">F1 Predictor</span>
            <br />
            <span className="text-white">y Simulador de Carreras</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Predice resultados, simula Grandes Premios, compite con amigos
            y demuestra que eres el mejor experto de Fórmula 1.
          </p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">Ir al Panel</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Empieza Gratis</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Iniciar Sesión</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F3C1;</div>
            <h3 className="text-xl font-bold mb-2">Pronósticos de Carreras</h3>
            <p className="text-gray-400 text-sm">
              Predice pole position, podio, top 10, vuelta rápida y más. Gana puntos por pronósticos precisos.
            </p>
          </Card>
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F6F9;</div>
            <h3 className="text-xl font-bold mb-2">Simulador de Carreras</h3>
            <p className="text-gray-400 text-sm">
              Simula cualquier Gran Premio con físicas avanzadas, clima, degradación de neumáticos y safety cars.
            </p>
          </Card>
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F3C6;</div>
            <h3 className="text-xl font-bold mb-2">Liga Fantástica</h3>
            <p className="text-gray-400 text-sm">
              Construye tu equipo soñado con un presupuesto, gestiona transferencias y compite en ligas privadas.
            </p>
          </Card>
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F4CA;</div>
            <h3 className="text-xl font-bold mb-2">Estadísticas Avanzadas</h3>
            <p className="text-gray-400 text-sm">
              Analiza estadísticas de pilotos, equipos y circuitos con gráficos interactivos y comparaciones.
            </p>
          </Card>
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F50D;</div>
            <h3 className="text-xl font-bold mb-2">Pronósticos con IA</h3>
            <p className="text-gray-400 text-sm">
              Obtén pronósticos de probabilidad de victoria basados en datos históricos y forma actual.
            </p>
          </Card>
          <Card hover>
            <div className="text-f1-red text-3xl mb-4">&#x1F3AF;</div>
            <h3 className="text-xl font-bold mb-2">Logros</h3>
            <p className="text-gray-400 text-sm">
              Desbloquea insignias, sube de nivel y sigue tus rachas mientras dominas el arte del pronóstico.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
