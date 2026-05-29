import type { League, LeagueWithMembers, MyLeague, CreateLeaguePayload, RankingEntry } from '../types';
interface LeagueState {
    myLeagues: MyLeague[];
    currentLeague: LeagueWithMembers | null;
    leagueRankings: RankingEntry[];
    isLoading: boolean;
    error: string | null;
    createLeague: (data: CreateLeaguePayload) => Promise<League>;
    fetchMyLeagues: () => Promise<void>;
    fetchLeagueById: (id: string) => Promise<void>;
    joinLeague: (code: string) => Promise<League>;
    leaveLeague: (id: string) => Promise<void>;
    fetchLeagueRanking: (id: string) => Promise<void>;
    clearError: () => void;
}
export declare const useLeagueStore: import("zustand").UseBoundStore<import("zustand").StoreApi<LeagueState>>;
export {};
//# sourceMappingURL=league.store.d.ts.map