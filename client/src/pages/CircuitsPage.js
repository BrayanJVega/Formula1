import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Circuitos" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Explora los circuitos de F\u00F3rmula 1 alrededor del mundo" })] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400", children: error })), _jsx(CircuitList, { circuits: circuits, isLoading: isLoading, filters: filters, onFiltersChange: setFilters })] }));
}
//# sourceMappingURL=CircuitsPage.js.map