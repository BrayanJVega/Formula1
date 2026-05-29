import type { Race } from '../types/race.types';
export declare const racesApi: {
    getRaces(seasonId: string, status?: string): Promise<{
        data: Race[];
    }>;
    getRaceById(id: string): Promise<{
        data: Race;
    }>;
    getNextRace(): Promise<{
        data: Race | null;
    }>;
};
//# sourceMappingURL=races.api.d.ts.map