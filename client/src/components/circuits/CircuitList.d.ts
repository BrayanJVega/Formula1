import type { Circuit, CircuitFilters } from '../../types/circuit.types';
interface CircuitListProps {
    circuits: Circuit[];
    isLoading: boolean;
    filters: CircuitFilters;
    onFiltersChange: (filters: Partial<CircuitFilters>) => void;
}
export declare function CircuitList({ circuits, isLoading, filters, onFiltersChange }: CircuitListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CircuitList.d.ts.map