import { type RunRacePayload, type RunSeasonPayload, type RunWhatIfPayload } from '../api/simulation.api';
import type { RaceSimulationResult, SeasonSimulationResult } from '../types/simulation.types';
interface SimulationState {
    raceResult: RaceSimulationResult | null;
    seasonResult: SeasonSimulationResult | null;
    whatIfResult: {
        base: RaceSimulationResult;
        modified: RaceSimulationResult;
    } | null;
    history: unknown[];
    isLoading: boolean;
    error: string | null;
    runRace: (payload: RunRacePayload) => Promise<void>;
    runSeason: (payload: RunSeasonPayload) => Promise<void>;
    runWhatIf: (payload: RunWhatIfPayload) => Promise<void>;
    fetchHistory: (type?: string) => Promise<void>;
    clearResults: () => void;
    clearError: () => void;
}
export declare const useSimulationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SimulationState>>;
export {};
//# sourceMappingURL=simulation.store.d.ts.map