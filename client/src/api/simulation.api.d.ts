import type { RaceSimulationResult, SeasonSimulationResult } from '../types/simulation.types';
export interface RunRacePayload {
    raceId: string;
    raceName: string;
    drivers: {
        driverId: string;
        driverName: string;
        teamId: string;
        teamName: string;
        skill: number;
        qualiSkill: number;
        raceSkill: number;
        consistency: number;
        experience: number;
        aggression: number;
        tyreManagement: number;
        wetSkill: number;
        form: number;
    }[];
    circuit: {
        circuitId: string;
        circuitName: string;
        lengthKm: number;
        turns: number;
        drsZones: number;
        avgSpeed: number;
        overtakingDifficulty: number;
        tyreDegradation: number;
        brakingDifficulty: number;
        cornerComplexity: number;
    };
    laps: number;
    initialWeather?: {
        condition?: string;
        temperature?: number;
        humidity?: number;
        windSpeed?: number;
        trackTemperature?: number;
        rainIntensity?: number;
        changeProbability?: number;
    };
}
export interface RunSeasonPayload {
    seasonId: string;
    year: number;
    races: {
        raceId: string;
        raceName: string;
        circuit: RunRacePayload['circuit'];
        laps: number;
    }[];
    drivers: RunRacePayload['drivers'];
}
export interface RunWhatIfPayload extends RunRacePayload {
    scenario: {
        type: 'injury' | 'buff' | 'nerf' | 'transfer' | 'weather';
        targetDriverId?: string;
        targetTeamId?: string;
        parameters: Record<string, number>;
    };
}
interface ApiResponse<T> {
    data: T;
}
export declare const simulationApi: {
    runRace(payload: RunRacePayload): Promise<ApiResponse<{
        result: RaceSimulationResult;
    }>>;
    runSeason(payload: RunSeasonPayload): Promise<ApiResponse<{
        result: SeasonSimulationResult;
    }>>;
    runWhatIf(payload: RunWhatIfPayload): Promise<ApiResponse<{
        result: {
            base: RaceSimulationResult;
            modified: RaceSimulationResult;
        };
    }>>;
    getHistory(type?: string): Promise<ApiResponse<unknown[]>>;
    getById(id: string): Promise<ApiResponse<unknown>>;
};
export {};
//# sourceMappingURL=simulation.api.d.ts.map