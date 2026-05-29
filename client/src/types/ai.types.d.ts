export interface AIDriverPrediction {
    driverId: string;
    driverName: string;
    probability: number;
}
export interface AIPrediction {
    predictedWinner: AIDriverPrediction;
    predictedPodium: AIDriverPrediction[];
    predictedTop10: AIDriverPrediction[];
    predictedFastestLap: AIDriverPrediction;
    predictedPolePosition: AIDriverPrediction;
    safetyCarProbability: number;
    predictedDnfCount: number;
    raceId: string;
    generatedAt: string;
}
export interface WinProbability {
    driverId: string;
    driverName: string;
    teamName: string;
    probability: number;
    rank: number;
}
//# sourceMappingURL=ai.types.d.ts.map