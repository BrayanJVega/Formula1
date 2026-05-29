import { useEffect, useState } from 'react';
import { useLeagueStore } from '../store/league.store';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { LeagueCard } from '../components/leagues/LeagueCard';
import { CreateLeagueModal } from '../components/leagues/CreateLeagueModal';
import { JoinLeagueModal } from '../components/leagues/JoinLeagueModal';
import { Plus, LogIn, Users } from 'lucide-react';

export default function LeaguesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const { myLeagues, isLoading, error, fetchMyLeagues } = useLeagueStore();

  useEffect(() => {
    fetchMyLeagues();
  }, [fetchMyLeagues]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Ligas</h1>
          <p className="text-gray-400 mt-1">Crea o únete a ligas privadas para competir con amigos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
            <LogIn size={16} className="mr-2" />
            Unirse
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} className="mr-2" />
            Crear Liga
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : myLeagues.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Aún no tienes ligas</p>
          <p className="text-gray-500 text-sm mt-1">Crea una nueva liga o únete a una con un código de invitación.</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
              Unirse a una Liga
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              Crear Liga
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {myLeagues.map((myLeague) => (
            <LeagueCard key={myLeague.league.id} myLeague={myLeague} />
          ))}
        </div>
      )}

      <CreateLeagueModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinLeagueModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </div>
  );
}
