import type { Race } from '../types/race.types';
interface RaceState {
    races: Race[];
    nextRace: Race | null;
    selectedRace: Race | null;
    isLoading: boolean;
    error: string | null;
    fetchRaces: (seasonId: string, status?: string) => Promise<void>;
    fetchRaceById: (id: string) => Promise<void>;
    fetchNextRace: () => Promise<void>;
    clearError: () => void;
}
export declare const useRaceStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RaceState>>;
export {};
//# sourceMappingURL=race.store.d.ts.map