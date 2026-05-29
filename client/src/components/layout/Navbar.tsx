import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-f1-gray border-b border-f1-gray-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-f1-red font-display text-xl font-bold">F1 Predictor</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Inicio
            </Link>
            <Link to="/drivers" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Pilotos
            </Link>
            <Link to="/teams" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Equipos
            </Link>
            <Link to="/circuits" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Circuitos
            </Link>
            <Link to="/calendar" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Calendario
            </Link>
            <Link to="/predictions" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
Pronosticar
            </Link>
            <Link to="/fantasy" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Fantástico
            </Link>
            <Link to="/rankings" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Clasificación
            </Link>
            <Link to="/leagues" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Ligas
            </Link>
            <Link to="/ai-predictions" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              IA Pronóstico
            </Link>
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Simular &#9662;
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-f1-gray rounded-lg border border-f1-gray-light/20 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/simulation/race" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-f1-gray-light/20 rounded-t-lg">
                  Simulador de Carrera
                </Link>
                <Link to="/simulation/season" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-f1-gray-light/20">
                  Simulador de Temporada
                </Link>
                <Link to="/simulation/what-if" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-f1-gray-light/20 rounded-b-lg">
                  Simulador What-If
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {user?.username}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
