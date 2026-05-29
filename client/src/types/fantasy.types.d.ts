export interface FantasyTeam {
    id: string;
    userId: string;
    seasonId: string;
    name: string;
    budget: number;
    totalScore: number;
    createdAt: string;
    updatedAt: string;
}
export interface FantasyTeamDetail extends FantasyTeam {
    picks: FantasyPick[];
    transfers: FantasyTransfer[];
}
export interface FantasyPick {
    id: string;
    fantasyTeamId: string;
    driverId: string | null;
    teamId: string | null;
    type: 'driver' | 'constructor';
    cost: number;
    isActive: boolean;
    pickedAt: string;
    transferredAt: string | null;
}
export interface FantasyTransfer {
    id: string;
    fantasyTeamId: string;
    driverOutId: string | null;
    driverInId: string | null;
    cost: number;
    transferAt: string;
    raceId: string | null;
}
export interface DriverMarketValue {
    id: string;
    driverId: string;
    seasonId: string;
    currentValue: number;
    priceChange: number;
    lastUpdated: string;
    driverName?: string;
    driverNumber?: number;
    teamName?: string;
}
export interface CreateFantasyTeamPayload {
    name: string;
    seasonId: string;
}
export interface AddPickPayload {
    driverId?: string;
    teamId?: string;
    type: 'driver' | 'constructor';
    cost: number;
}
export interface TransferDriverPayload {
    pickId: string;
    newDriverId: string;
    newDriverCost: number;
    raceId?: string;
}
export interface StandingsEntry {
    position: number;
    teamId: string;
    teamName: string;
    userId: string;
    totalScore: number;
    budget: number;
    totalValue: number;
    transfersCount: number;
}
//# sourceMappingURL=fantasy.types.d.ts.map