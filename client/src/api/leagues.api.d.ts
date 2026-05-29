import type { League, LeagueMember, LeagueWithMembers, MyLeague, CreateLeaguePayload, RankingEntry } from '../types';
export declare const leaguesApi: {
    create(data: CreateLeaguePayload): Promise<{
        data: League;
    }>;
    getMyLeagues(): Promise<{
        data: MyLeague[];
    }>;
    getById(id: string): Promise<{
        data: LeagueWithMembers;
    }>;
    join(code: string): Promise<{
        data: League;
    }>;
    leave(id: string): Promise<void>;
    getMembers(id: string): Promise<{
        data: LeagueMember[];
    }>;
    getLeagueRanking(id: string): Promise<{
        data: RankingEntry[];
    }>;
};
//# sourceMappingURL=leagues.api.d.ts.map