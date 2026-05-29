import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useLeagueStore } from '../../store/league.store';

interface JoinLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinLeagueModal({ isOpen, onClose }: JoinLeagueModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { joinLeague, isLoading } = useLeagueStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('El código de la liga es obligatorio');
      return;
    }

    try {
      await joinLeague(code.trim().toUpperCase());
      setCode('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-f1-gray rounded-xl border border-f1-gray-light/20 w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Unirse a Liga</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Código de la Liga"
            id="league-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ej. ABC12345"
            maxLength={20}
            error={error || undefined}
          />

          <p className="text-sm text-gray-400">
            Introduce el código de 8 caracteres compartido por el dueño de la liga.
          </p>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Unirse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
