import type { Prediction, PredictionFormData, PredictionScore, PredictionWithScore, PaginatedPredictions } from '../types/prediction.types';
export declare const predictionsApi: {
    create(data: PredictionFormData): Promise<{
        data: Prediction;
    }>;
    getMyPredictions(page?: number, limit?: number): Promise<{
        data: PaginatedPredictions;
    }>;
    getByRace(raceId: string): Promise<{
        data: Prediction | null;
    }>;
    getById(id: string): Promise<{
        data: PredictionWithScore;
        scores: PredictionScore | null;
    }>;
    getScore(id: string): Promise<{
        data: PredictionScore;
    }>;
    update(id: string, data: Partial<PredictionFormData>): Promise<{
        data: Prediction;
    }>;
    submit(id: string, actualResults: Record<string, unknown>): Promise<{
        data: {
            prediction: Prediction;
            scores: PredictionScore;
        };
    }>;
};
//# sourceMappingURL=predictions.api.d.ts.map