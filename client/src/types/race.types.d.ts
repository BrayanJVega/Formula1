export type RaceStatus = 'upcoming' | 'qualifying_complete' | 'completed' | 'cancelled';
export interface RaceCircuitInfo {
    id: string;
    name: string;
    country: string;
    city: string;
    lengthKm: number;
    turns: number;
    drsZones: number;
}
export interface Race {
    id: string;
    seasonId: string;
    circuitId: string;
    name: string;
    round: number;
    status: RaceStatus;
    date: string;
    qualifyingDate: string;
    raceDate: string;
    localTimezone: string;
    weatherForecast?: Record<string, unknown>;
    laps: number;
    createdAt: string;
    updatedAt: string;
    circuit: RaceCircuitInfo;
}
export interface CalendarDay {
    date: string;
    label: string;
    isRaceDay: boolean;
    isQualifyingDay: boolean;
}
//# sourceMappingURL=race.types.d.ts.map