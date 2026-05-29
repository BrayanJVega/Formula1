export type TyreCompound = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';
export type WeatherCondition = 'dry' | 'light_rain' | 'heavy_rain' | 'wet';
export type SessionType = 'qualifying' | 'race';
export type IncidentType = 'crash' | 'mechanical' | 'penalty' | 'spin' | 'collision';
export type StrategyType = 'aggressive' | 'balanced' | 'conservative' | 'underdog';
export type PitTyreChoice = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';
export interface DriverPerformance {
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
}
export interface CircuitCharacteristics {
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
}
export interface WeatherState {
    condition: WeatherCondition;
    temperature: number;
    humidity: number;
    windSpeed: number;
    trackTemperature: number;
    rainIntensity: number;
    changeProbability: number;
}
export interface TyreState {
    compound: TyreCompound;
    age: number;
    wear: number;
    temperature: number;
    pressure: number;
}
export interface DriverLapState {
    driverId: string;
    position: number;
    lapNumber: number;
    lapTime: number;
    sector1Time: number;
    sector2Time: number;
    sector3Time: number;
    tyre: TyreState;
    fuelLoad: number;
    damage: number;
    dnf: boolean;
    dnfReason?: string;
    inPit: boolean;
    pitStopCount: number;
    hasPenalty: boolean;
    penaltyTime?: number;
    drsEnabled: boolean;
    gapToFront: number;
    gapToLeader: number;
}
export interface SimulatedDriverResult {
    driverId: string;
    driverName: string;
    teamId: string;
    teamName: string;
    position: number;
    gridPosition: number;
    positionsGained: number;
    totalTime: number;
    gapToWinner: number;
    fastestLap: boolean;
    fastestLapTime?: number;
    pitStops: number;
    dnfd: boolean;
    dnfReason?: string;
    dnfLap?: number;
    points: number;
    lapsCompleted: number;
    avgLapTime: number;
    strategy: StrategyType;
    tyreHistory: {
        lap: number;
        compound: string;
    }[];
    incidents: Incident[];
    lapTimes: number[];
    positionsByLap: number[];
}
export interface Incident {
    type: IncidentType;
    lap: number;
    driverId: string;
    description: string;
    causedDnf?: boolean;
    involvedDrivers?: string[];
    safetyCarDeployed?: boolean;
}
export interface SafetyCarPeriod {
    startLap: number;
    endLap: number;
    reason: string;
}
export interface QualifyingResult {
    driverId: string;
    driverName: string;
    teamId: string;
    teamName: string;
    position: number;
    q1Time?: number;
    q2Time?: number;
    q3Time?: number;
    eliminatedIn: 'q1' | 'q2' | 'q3';
}
export interface RaceSimulationResult {
    raceId: string;
    raceName: string;
    circuit: CircuitCharacteristics;
    weather: WeatherState;
    weatherChanges: {
        lap: number;
        condition: WeatherCondition;
    }[];
    laps: number;
    results: SimulatedDriverResult[];
    qualifyingResults?: QualifyingResult[];
    safetyCarPeriods: SafetyCarPeriod[];
    incidents: Incident[];
    totalDuration: number;
    averageLapTime: number;
    fastestLap: {
        driverId: string;
        time: number;
        lap: number;
    };
    retirements: number;
    margins: {
        winner: number;
        podium: number;
        points: number;
    };
}
export interface SeasonSimulationResult {
    seasonId: string;
    year: number;
    races: RaceSimulationResult[];
    championshipStandings: {
        driverId: string;
        driverName: string;
        teamId: string;
        points: number;
        wins: number;
        podiums: number;
        position: number;
    }[];
    constructorStandings: {
        teamId: string;
        teamName: string;
        points: number;
        wins: number;
        position: number;
    }[];
}
export interface WhatIfScenario {
    type: 'injury' | 'buff' | 'nerf' | 'transfer' | 'weather';
    targetDriverId?: string;
    targetTeamId?: string;
    parameters: Record<string, number>;
}
//# sourceMappingURL=simulation.types.d.ts.map