import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Coins, Trophy, Repeat, Calendar } from 'lucide-react';
import { FantasyTeamCard } from '../components/fantasy/FantasyTeamCard';
import { useFantasyStore } from '../store/fantasy.store';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';
import type { FantasyTeamDetail, FantasyTransfer } from '../types/fantasy.types';

export default function FantasyTeamPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchTeamById, loading } = useFantasyStore();
  const [team, setTeam] = useState<FantasyTeamDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchTeamById(id)
      .then(setTeam)
      .catch((err) => setError(err.message));
  }, [id, fetchTeamById]);

  if (loading && !team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-red-400">{error}</p>
          <Link to="/fantasy" className="text-f1-red hover:underline mt-4 inline-block">
            Volver a Fantástico
          </Link>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const activePicks = team.picks.filter((p) => p.isActive);
  const totalValue = activePicks.reduce((sum, p) => sum + p.cost, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/fantasy"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Fantástico
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{team.name}</h1>
        <p className="text-gray-400 mt-1">Detalles del Equipo Fantástico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-f1-red" />
            <div>
              <p className="text-2xl font-bold text-white">{team.totalScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Puntuación Total</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{team.budget.toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Presupuesto Restante</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{totalValue.toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Valor del Equipo</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FantasyTeamCard team={team} readonly />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Repeat className="w-5 h-5" /> Historial de Transferencias
        </h2>
        {team.transfers.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no hay transferencias.</p>
        ) : (
          <div className="space-y-2">
            {team.transfers.map((t) => (
              <TransferRow key={t.id} transfer={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransferRow({ transfer }: { transfer: FantasyTransfer }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Repeat className="w-5 h-5 text-f1-red" />
          <div>
            <p className="text-white text-sm font-medium">
              {transfer.driverOutId ? `Out: #${transfer.driverOutId.slice(0, 8)}` : 'N/A'}
              <span className="text-gray-500 mx-2">&rarr;</span>
              {transfer.driverInId ? `In: #${transfer.driverInId.slice(0, 8)}` : 'N/A'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {new Date(transfer.transferAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <span className="text-yellow-400 font-semibold">{transfer.cost.toFixed(1)}M</span>
      </div>
    </Card>
  );
}
