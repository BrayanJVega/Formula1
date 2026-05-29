export interface RankingEntry {
    userId: string;
    username: string;
    score: number;
    position: number;
    country?: string;
    change?: number;
}
export interface PaginatedRankings {
    rankings: RankingEntry[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=ranking.types.d.ts.map