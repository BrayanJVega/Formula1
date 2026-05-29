import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-f1-gray border-t border-f1-gray-light/20 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          F1 Predictor y Simulador de Carreras &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
