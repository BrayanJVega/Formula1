import type { RankingEntry, PaginatedRankings } from '../types/ranking.types';
export declare const rankingsApi: {
    getGlobal(seasonId?: string, page?: number, limit?: number): Promise<{
        data: PaginatedRankings;
    }>;
    getWeekly(page?: number, limit?: number): Promise<{
        data: PaginatedRankings;
    }>;
    getCountry(countryCode: string, seasonId?: string): Promise<{
        data: RankingEntry[];
    }>;
    getMyPosition(seasonId?: string): Promise<{
        data: RankingEntry | null;
    }>;
};
//# sourceMappingURL=rankings.api.d.ts.map