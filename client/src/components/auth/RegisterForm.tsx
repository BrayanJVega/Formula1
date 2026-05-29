import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'El email es obligatorio';
    if (!username) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    } else if (username.length > 30) {
      newErrors.username = 'El usuario debe tener como máximo 30 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'El usuario solo puede contener letras, números y guiones bajos (sin espacios)';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      if (password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'La contraseña debe contener al menos un número';
      }
    }
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(email, username, password);
    } catch {
      // Error is handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
      <p className="text-gray-400 text-sm">Únete a F1 Predictor y empieza a competir</p>

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
        id="username"
        label="Usuario"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        placeholder="Elige un usuario"
      />

      <Input
        id="password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Mín. 8 caracteres, 1 mayúscula y 1 número"
      />

      <Input
        id="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        placeholder="Confirma tu contraseña"
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
Crear Cuenta
      </Button>

      <p className="text-center text-sm text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-f1-red hover:text-f1-red-dark transition-colors font-medium">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
}
