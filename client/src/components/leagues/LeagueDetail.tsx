import { useLeagueStore } from '../../store/league.store';
import { useAuthStore } from '../../store/auth.store';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Code, ArrowLeft, User, Crown } from 'lucide-react';
import { getFlagEmoji } from '../../utils/flags';

interface LeagueDetailProps {
  leagueId: string;
}

export function LeagueDetail({ leagueId }: LeagueDetailProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentLeague, isLoading, error, fetchLeagueById, leaveLeague, leagueRankings, fetchLeagueRanking } = useLeagueStore();

  useEffect(() => {
    if (leagueId) {
      fetchLeagueById(leagueId);
      fetchLeagueRanking(leagueId);
    }
  }, [leagueId, fetchLeagueById, fetchLeagueRanking]);

  if (isLoading && !currentLeague) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  if (!currentLeague) {
    return <div className="text-center py-8 text-gray-400">League not found.</div>;
  }

  const { league, members } = currentLeague;
  const isOwner = league.ownerId === user?.id;
  const isMember = members.some((m) => m.userId === user?.id);

  const handleLeave = async () => {
    if (confirm('¿Seguro que quieres abandonar esta liga?')) {
      try {
        await leaveLeague(league.id);
        navigate('/leagues');
      } catch {}
    }
  };

  const userMember = members.find((m) => m.userId === user?.id);
  const userRanking = leagueRankings.find((r) => r.userId === user?.id);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/leagues')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} />
        Volver a Ligas
      </button>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{league.name}</h1>
            {league.description && (
              <p className="text-gray-400 mt-1">{league.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {members.length}/{league.maxMembers} miembros
              </span>
              {userRanking && (
                <span className="flex items-center gap-1">
                  <Trophy size={16} />
                  Tu Posición: #{userRanking.position}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Code size={16} />
                Código: <span className="font-mono text-white font-bold tracking-wider">{league.code}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              league.isPrivate ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
            }`}>
              {league.isPrivate ? 'Privada' : 'Pública'}
            </span>
          </div>
        </div>
      </Card>

      {isMember && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Tu Rol</p>
              <p className="text-white font-semibold text-lg capitalize mt-1 flex items-center justify-center gap-1">
                {isOwner ? <Crown size={18} className="text-yellow-400" /> : <User size={18} />}
                {userMember?.role || 'member'}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Tu Puntuación</p>
              <p className="text-white font-semibold text-lg mt-1">
                {userMember ? userMember.totalScore.toFixed(1) : '0.0'}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Posición</p>
              <p className="text-white font-semibold text-lg mt-1">
                {userRanking ? `#${userRanking.position}` : '-'}
              </p>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy size={20} className="text-f1-red" />
            Miembros y Clasificación
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-f1-gray-light/20">
                <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Pos</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">Usuario</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">País</th>
                <th className="text-center py-3 px-4 text-gray-400 text-sm font-medium">Rol</th>
                <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const ranking = leagueRankings.find((r) => r.userId === member.userId);
                const pos = ranking?.position || index + 1;
                return (
                  <tr key={member.id} className={`border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5 transition-colors ${
                    member.userId === user?.id ? 'bg-f1-red/5' : ''
                  }`}>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${pos <= 3 ? 'text-f1-red' : 'text-white'}`}>
                        #{pos}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium flex items-center gap-2">
                        {member.username}
                        {member.userId === league.ownerId && (
                          <Crown size={14} className="text-yellow-400" />
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {member.country ? (
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{getFlagEmoji(member.country)}</span>
                          <span className="text-sm">{member.country}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`capitalize text-sm ${
                        member.role === 'owner' ? 'text-yellow-400' :
                        member.role === 'admin' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white font-semibold">
                      {member.totalScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {isMember && !isOwner && (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={handleLeave} isLoading={isLoading}>
            Abandonar Liga
          </Button>
        </div>
      )}
    </div>
  );
}
