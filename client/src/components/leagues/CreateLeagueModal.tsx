import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Lock, Globe } from 'lucide-react';
import { useLeagueStore } from '../../store/league.store';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLeagueModal({ isOpen, onClose }: CreateLeagueModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(50);
  const [isPrivate, setIsPrivate] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { createLeague, isLoading } = useLeagueStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre de la liga es obligatorio');
      return;
    }

    try {
      await createLeague({
        name: name.trim(),
        description: description.trim() || undefined,
        maxMembers,
        isPrivate,
      });
      setName('');
      setDescription('');
      setMaxMembers(50);
      setIsPrivate(true);
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
          <h2 className="text-xl font-bold text-white">Crear Nueva Liga</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la Liga"
            id="league-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
                placeholder="Mi Liga F1"
            error={error || undefined}
          />

          <div>
              <label htmlFor="league-desc" className="block text-sm font-medium text-gray-300 mb-1.5">
                Descripción (opcional)
              </label>
            <textarea
              id="league-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                placeholder="Una liga para verdaderos fans de F1..."
              className="w-full bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-f1-red transition-colors duration-200 resize-none"
              rows={3}
            />
          </div>

          <Input
            label="Máximo de Miembros"
            id="max-members"
            type="number"
            min={2}
            max={100}
            value={maxMembers}
            onChange={(e) => setMaxMembers(parseInt(e.target.value, 10) || 50)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Visibilidad</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  isPrivate
                    ? 'border-f1-red bg-f1-red/10 text-white'
                    : 'border-f1-gray-light/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Lock size={16} />
                Privada
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  !isPrivate
                    ? 'border-f1-red bg-f1-red/10 text-white'
                    : 'border-f1-gray-light/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Globe size={16} />
                Pública
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
