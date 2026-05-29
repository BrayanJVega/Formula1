import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Trophy, Plus } from 'lucide-react';
import { FantasyTeamCard } from '../components/fantasy/FantasyTeamCard';
import { DriverMarket } from '../components/fantasy/DriverMarket';
import { FantasyStandings } from '../components/fantasy/FantasyStandings';
import { FantasyTeamBuilder } from '../components/fantasy/FantasyTeamBuilder';
import { useFantasyStore } from '../store/fantasy.store';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import clsx from 'clsx';

const SEASON_ID = '00000000-0000-0000-0000-000000000000';

type Tab = 'my-team' | 'market' | 'standings';

export default function FantasyPage() {
  const { myTeam, loading, error, fetchMyTeam, createTeam, removePick } = useFantasyStore();
  const [activeTab, setActiveTab] = useState<Tab>('my-team');
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchMyTeam(SEASON_ID);
  }, [fetchMyTeam]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    setCreating(true);
    try {
      await createTeam(teamName.trim(), SEASON_ID);
      setShowCreate(false);
      setTeamName('');
      await fetchMyTeam(SEASON_ID);
    } catch {
    } finally {
      setCreating(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'my-team', label: 'Mi Equipo', icon: <Coins className="w-4 h-4" /> },
    { key: 'market', label: 'Mercado', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'standings', label: 'Clasificación', icon: <Trophy className="w-4 h-4" /> },
  ];

  if (loading && !myTeam) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Liga Fantástica</h1>
        <p className="text-gray-400 mt-1">Construye tu equipo F1 soñado</p>
      </div>

      <div className="flex items-center gap-1 mb-8 bg-f1-gray rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-f1-red text-white'
                : 'text-gray-400 hover:text-white',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {!myTeam && !showCreate ? (
        <div className="text-center py-20">
          <Coins className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Aún no tienes equipo fantástico</h2>
          <p className="text-gray-400 mb-6">¡Crea tu equipo fantástico para empezar a competir!</p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> Crear Equipo
          </Button>
        </div>
      ) : showCreate ? (
        <div className="max-w-md mx-auto">
          <div className="bg-f1-gray rounded-xl p-6 border border-f1-gray-light/20">
            <h2 className="text-xl font-bold text-white mb-4">Crea tu Equipo</h2>
            <Input
              label="Nombre del Equipo"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="ej. Demonios de la Velocidad"
            />
            <div className="flex gap-3 mt-4">
              <Button onClick={handleCreateTeam} isLoading={creating} disabled={!teamName.trim()}>
                Crear
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'my-team' && myTeam && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FantasyTeamCard
                team={myTeam}
                onRemovePick={(pickId) => removePick(pickId)}
              />
              <FantasyTeamBuilder
                teamId={myTeam.id}
                picks={myTeam.picks}
                budget={myTeam.budget}
              />
            </div>
          )}

          {activeTab === 'market' && (
            <DriverMarket seasonId={SEASON_ID} />
          )}

          {activeTab === 'standings' && (
            <FantasyStandings seasonId={SEASON_ID} />
          )}
        </>
      )}
    </div>
  );
}
