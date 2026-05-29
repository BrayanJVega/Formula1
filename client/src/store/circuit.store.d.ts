import type { Circuit, CircuitFilters, CreateCircuitPayload, UpdateCircuitPayload } from '../types/circuit.types';
interface CircuitState {
    circuits: Circuit[];
    selectedCircuit: Circuit | null;
    isLoading: boolean;
    error: string | null;
    filters: CircuitFilters;
    fetchCircuits: () => Promise<void>;
    fetchCircuitById: (id: string) => Promise<void>;
    createCircuit: (payload: CreateCircuitPayload) => Promise<Circuit>;
    updateCircuit: (id: string, payload: UpdateCircuitPayload) => Promise<Circuit>;
    deleteCircuit: (id: string) => Promise<void>;
    setFilters: (filters: Partial<CircuitFilters>) => void;
    clearError: () => void;
}
export declare const useCircuitStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CircuitState>>;
export {};
//# sourceMappingURL=circuit.store.d.ts.map