import type { FantasyTeam, FantasyTeamDetail, FantasyPick, FantasyTransfer, DriverMarketValue, StandingsEntry, CreateFantasyTeamPayload, AddPickPayload, TransferDriverPayload } from '../types/fantasy.types';
export declare const fantasyApi: {
    createTeam(payload: CreateFantasyTeamPayload): Promise<FantasyTeam>;
    getMyTeam(seasonId: string): Promise<FantasyTeamDetail>;
    getTeamById(id: string): Promise<FantasyTeamDetail>;
    updateTeam(id: string, name: string): Promise<FantasyTeam>;
    addPick(teamId: string, payload: AddPickPayload): Promise<FantasyPick>;
    removePick(pickId: string): Promise<FantasyTeam>;
    transferDriver(teamId: string, payload: TransferDriverPayload): Promise<{
        team: FantasyTeam;
        transfer: FantasyTransfer;
    }>;
    getMarketValues(seasonId: string): Promise<DriverMarketValue[]>;
    getStandings(seasonId: string): Promise<StandingsEntry[]>;
};
//# sourceMappingURL=fantasy.api.d.ts.map