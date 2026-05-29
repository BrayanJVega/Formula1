import type { Prediction, PredictionFormData, PredictionWithScore } from '../types/prediction.types';
interface PredictionState {
    predictions: Prediction[];
    currentPrediction: PredictionWithScore | null;
    racePrediction: Prediction | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    isLoading: boolean;
    error: string | null;
    createPrediction: (data: PredictionFormData) => Promise<Prediction>;
    fetchMyPredictions: (page?: number, limit?: number) => Promise<void>;
    fetchRacePrediction: (raceId: string) => Promise<void>;
    fetchPredictionById: (id: string) => Promise<void>;
    updatePrediction: (id: string, data: Partial<PredictionFormData>) => Promise<Prediction>;
    submitPrediction: (id: string, actualResults: Record<string, unknown>) => Promise<void>;
    clearError: () => void;
}
export declare const usePredictionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PredictionState>>;
export {};
//# sourceMappingURL=prediction.store.d.ts.map