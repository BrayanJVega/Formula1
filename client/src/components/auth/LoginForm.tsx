import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'El email es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
    } catch {
      // Error is handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
      <p className="text-gray-400 text-sm">Inicia sesión en tu cuenta de F1 Predictor</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="your@email.com"
      />

      <Input
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="text-f1-red hover:text-f1-red-dark transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Iniciar Sesión
      </Button>

      <p className="text-center text-sm text-gray-400">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-f1-red hover:text-f1-red-dark transition-colors font-medium">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
