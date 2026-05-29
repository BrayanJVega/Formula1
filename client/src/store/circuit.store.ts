import { create } from 'zustand';
import type { Circuit, CircuitFilters, CreateCircuitPayload, UpdateCircuitPayload } from '../types/circuit.types';
import { circuitsApi } from '../api/circuits.api';

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

export const useCircuitStore = create<CircuitState>((set) => ({
  circuits: [],
  selectedCircuit: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },

  fetchCircuits: async () => {
    try {
      set({ isLoading: true, error: null });
      const circuits = await circuitsApi.getAll();
      set({ circuits, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch circuits';
      set({ error: message, isLoading: false });
    }
  },

  fetchCircuitById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const circuit = await circuitsApi.getById(id);
      set({ selectedCircuit: circuit, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch circuit';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  createCircuit: async (payload: CreateCircuitPayload) => {
    try {
      set({ error: null });
      const circuit = await circuitsApi.create(payload);
      set((state) => ({ circuits: [...state.circuits, circuit] }));
      return circuit;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create circuit';
      set({ error: message });
      throw new Error(message);
    }
  },

  updateCircuit: async (id: string, payload: UpdateCircuitPayload) => {
    try {
      set({ error: null });
      const circuit = await circuitsApi.update(id, payload);
      set((state) => ({
        circuits: state.circuits.map((c) => (c.id === id ? circuit : c)),
        selectedCircuit: state.selectedCircuit?.id === id ? circuit : state.selectedCircuit,
      }));
      return circuit;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update circuit';
      set({ error: message });
      throw new Error(message);
    }
  },

  deleteCircuit: async (id: string) => {
    try {
      set({ error: null });
      await circuitsApi.delete(id);
      set((state) => ({
        circuits: state.circuits.filter((c) => c.id !== id),
        selectedCircuit: state.selectedCircuit?.id === id ? null : state.selectedCircuit,
      }));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete circuit';
      set({ error: message });
      throw new Error(message);
    }
  },

  setFilters: (filters: Partial<CircuitFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearError: () => set({ error: null }),
}));
