import type { RankingEntry } from '../types/ranking.types';
interface RankingState {
    globalRankings: RankingEntry[];
    weeklyRankings: RankingEntry[];
    countryRankings: RankingEntry[];
    myPosition: RankingEntry | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    isLoading: boolean;
    error: string | null;
    fetchGlobalRankings: (seasonId?: string, page?: number, limit?: number) => Promise<void>;
    fetchWeeklyRankings: (page?: number, limit?: number) => Promise<void>;
    fetchCountryRankings: (countryCode: string, seasonId?: string) => Promise<void>;
    fetchMyPosition: (seasonId?: string) => Promise<void>;
    clearError: () => void;
}
export declare const useRankingStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RankingState>>;
export {};
//# sourceMappingURL=ranking.store.d.ts.map