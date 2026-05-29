import { useEffect } from 'react';
import { useCircuitStore } from '../store/circuit.store';
import { CircuitList } from '../components/circuits/CircuitList';

export default function CircuitsPage() {
  const circuits = useCircuitStore((state) => state.circuits);
  const isLoading = useCircuitStore((state) => state.isLoading);
  const filters = useCircuitStore((state) => state.filters);
  const error = useCircuitStore((state) => state.error);
  const fetchCircuits = useCircuitStore((state) => state.fetchCircuits);
  const setFilters = useCircuitStore((state) => state.setFilters);

  useEffect(() => {
    fetchCircuits();
  }, [fetchCircuits]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Circuitos</h1>
        <p className="text-gray-400 mt-1">Explora los circuitos de Fórmula 1 alrededor del mundo</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <CircuitList
        circuits={circuits}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
