export interface League {
    id: string;
    name: string;
    description?: string;
    code: string;
    ownerId: string;
    maxMembers: number;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface LeagueMember {
    id: string;
    userId: string;
    username: string;
    email: string;
    country?: string;
    avatarUrl?: string;
    role: string;
    joinedAt: string;
    totalScore: number;
}
export interface CreateLeaguePayload {
    name: string;
    description?: string;
    maxMembers?: number;
    isPrivate?: boolean;
}
export interface LeagueWithMembers {
    league: League;
    members: LeagueMember[];
}
export interface MyLeague {
    league: League;
    memberCount: number;
    yourRole: string;
    yourScore: number;
    yourPosition: number;
}
//# sourceMappingURL=league.types.d.ts.map