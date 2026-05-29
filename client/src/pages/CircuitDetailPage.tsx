import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCircuitStore } from '../store/circuit.store';
import { CircuitDetail } from '../components/circuits/CircuitDetail';
import { Button } from '../components/ui/Button';

export default function CircuitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const selectedCircuit = useCircuitStore((state) => state.selectedCircuit);
  const isLoading = useCircuitStore((state) => state.isLoading);
  const error = useCircuitStore((state) => state.error);
  const fetchCircuitById = useCircuitStore((state) => state.fetchCircuitById);

  useEffect(() => {
    if (id) {
      fetchCircuitById(id);
    }
  }, [id, fetchCircuitById]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/circuits">
          <Button variant="ghost" size="sm">
            &larr; Volver a Circuitos
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <CircuitDetail circuit={selectedCircuit} isLoading={isLoading} />
    </div>
  );
}
