import type { Team, TeamDetail, CreateTeamPayload, UpdateTeamPayload } from '../types/team.types';
export declare const teamsApi: {
    getAll(isActive?: boolean): Promise<Team[]>;
    getById(id: string): Promise<TeamDetail>;
    create(payload: CreateTeamPayload): Promise<Team>;
    update(id: string, payload: UpdateTeamPayload): Promise<Team>;
    delete(id: string): Promise<void>;
};
//# sourceMappingURL=teams.api.d.ts.map