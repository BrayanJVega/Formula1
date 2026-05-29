import type { AIPrediction, WinProbability } from '../types/ai.types';
export declare const aiApi: {
    getPredictions(raceId: string): Promise<{
        data: AIPrediction;
    }>;
    getWinProbabilities(raceId: string): Promise<{
        data: WinProbability[];
    }>;
};
//# sourceMappingURL=ai.api.d.ts.map