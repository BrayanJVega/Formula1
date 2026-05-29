export interface Team {
    id: string;
    name: string;
    fullName: string;
    nationality: string;
    base: string;
    teamPrincipal: string;
    chassis: string;
    powerUnit: string;
    logoUrl?: string;
    photoUrl?: string;
    biography?: string;
    isActive: boolean;
    foundedYear: number;
    createdAt: string;
    updatedAt: string;
}
export interface TeamStats {
    championships: number;
    wins: number;
    podiums: number;
    poles: number;
    fastestLaps: number;
    totalPoints: number;
    racesEntered: number;
    seasonPoints: number;
    seasonPosition: number;
}
export interface TeamDetail extends Team {
    stats?: TeamStats;
    drivers?: TeamDriver[];
}
export interface TeamDriver {
    id: string;
    name: string;
    number: number;
    nationality: string;
    photoUrl?: string;
}
export interface CreateTeamPayload {
    name: string;
    fullName: string;
    nationality: string;
    base: string;
    teamPrincipal: string;
    chassis: string;
    powerUnit: string;
    foundedYear: number;
    logoUrl?: string;
    photoUrl?: string;
    biography?: string;
}
export interface UpdateTeamPayload {
    name?: string;
    fullName?: string;
    nationality?: string;
    base?: string;
    teamPrincipal?: string;
    chassis?: string;
    powerUnit?: string;
    foundedYear?: number;
    logoUrl?: string;
    photoUrl?: string;
    biography?: string;
    isActive?: boolean;
}
//# sourceMappingURL=team.types.d.ts.map