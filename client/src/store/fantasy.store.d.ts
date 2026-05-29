import type { FantasyTeam, FantasyTeamDetail, FantasyPick, DriverMarketValue, StandingsEntry, AddPickPayload, TransferDriverPayload } from '../types/fantasy.types';
interface FantasyState {
    myTeam: FantasyTeamDetail | null;
    marketValues: DriverMarketValue[];
    standings: StandingsEntry[];
    loading: boolean;
    error: string | null;
    createTeam: (name: string, seasonId: string) => Promise<FantasyTeam>;
    fetchMyTeam: (seasonId: string) => Promise<void>;
    fetchTeamById: (id: string) => Promise<FantasyTeamDetail>;
    updateTeam: (id: string, name: string) => Promise<void>;
    addPick: (teamId: string, payload: AddPickPayload) => Promise<FantasyPick>;
    removePick: (pickId: string) => Promise<void>;
    transferDriver: (teamId: string, payload: TransferDriverPayload) => Promise<void>;
    fetchMarketValues: (seasonId: string) => Promise<void>;
    fetchStandings: (seasonId: string) => Promise<void>;
    clearError: () => void;
}
export declare const useFantasyStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FantasyState>>;
export {};
//# sourceMappingURL=fantasy.store.d.ts.map