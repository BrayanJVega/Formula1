import type { Team, TeamDetail, UpdateTeamPayload } from '../types/team.types';
interface TeamState {
    teams: Team[];
    selectedTeam: TeamDetail | null;
    isLoading: boolean;
    error: string | null;
    fetchTeams: (isActive?: boolean) => Promise<void>;
    fetchTeamById: (id: string) => Promise<void>;
    createTeam: (payload: Omit<UpdateTeamPayload, 'isActive'> & {
        name: string;
        fullName: string;
        nationality: string;
        base: string;
        teamPrincipal: string;
        chassis: string;
        powerUnit: string;
        foundedYear: number;
    }) => Promise<void>;
    updateTeam: (id: string, payload: UpdateTeamPayload) => Promise<void>;
    deleteTeam: (id: string) => Promise<void>;
    clearError: () => void;
    clearSelectedTeam: () => void;
}
export declare const useTeamStore: import("zustand").UseBoundStore<import("zustand").StoreApi<TeamState>>;
export {};
//# sourceMappingURL=team.store.d.ts.map