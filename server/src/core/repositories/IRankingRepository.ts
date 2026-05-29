export interface RankingEntry {
  userId: string;
  username: string;
  score: number;
  position: number;
  country?: string;
  change?: number;
}

export interface IRankingRepository {
  getGlobalRanking(seasonId: string, options?: { page?: number; limit?: number }): Promise<{ rankings: RankingEntry[]; total: number }>;
  getWeeklyRanking(options?: { page?: number; limit?: number }): Promise<{ rankings: RankingEntry[]; total: number }>;
  getCountryRanking(countryCode: string, seasonId: string): Promise<RankingEntry[]>;
  getLeagueRanking(leagueId: string): Promise<RankingEntry[]>;
  getUserPosition(userId: string, seasonId: string): Promise<RankingEntry | null>;
}
