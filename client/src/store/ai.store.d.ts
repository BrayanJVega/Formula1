import type { AIPrediction, WinProbability } from '../types/ai.types';
interface AIState {
    predictions: AIPrediction | null;
    winProbabilities: WinProbability[];
    isLoading: boolean;
    error: string | null;
    fetchPredictions: (raceId: string) => Promise<void>;
    fetchWinProbabilities: (raceId: string) => Promise<void>;
    clearError: () => void;
}
export declare const useAIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AIState>>;
export {};
//# sourceMappingURL=ai.store.d.ts.map