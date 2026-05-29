export interface Driver {
    id: string;
    name: string;
    number: number;
    nationality: string;
    dateOfBirth: string;
    team: {
        id: string;
        name: string;
        logoUrl?: string;
    };
    photoUrl?: string;
    biography?: string;
    isActive: boolean;
    stats?: DriverStats;
}
export interface DriverStats {
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
export interface DriverDetail extends Driver {
    biography: string;
    stats: DriverStats;
}
export interface CreateDriverPayload {
    name: string;
    number: number;
    nationality: string;
    dateOfBirth: string;
    teamId: string;
    photoUrl?: string;
    biography?: string;
}
export interface UpdateDriverPayload {
    name?: string;
    number?: number;
    nationality?: string;
    dateOfBirth?: string;
    teamId?: string;
    photoUrl?: string;
    biography?: string;
    isActive?: boolean;
}
export interface DriverFilters {
    teamId?: string;
    nationality?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
export interface PaginatedDrivers {
    drivers: Driver[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=driver.types.d.ts.map