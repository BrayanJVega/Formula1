import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-f1-gray-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-f1-red font-display">F1 Predictor</h1>
          <p className="text-gray-400 mt-2">Simulador de Carreras y Liga Fantástica</p>
        </div>
        <div className="card animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
