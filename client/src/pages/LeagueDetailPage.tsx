import { useParams } from 'react-router-dom';
import { LeagueDetail } from '../components/leagues/LeagueDetail';

export default function LeagueDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="text-center py-12 text-gray-400">
        League ID is required.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <LeagueDetail leagueId={id} />
    </div>
  );
}
