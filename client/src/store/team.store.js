import { create } from 'zustand';
import { teamsApi } from '../api/teams.api';
export const useTeamStore = create((set, get) => ({
    teams: [],
    selectedTeam: null,
    isLoading: false,
    error: null,
    fetchTeams: async (isActive) => {
        try {
            set({ isLoading: true, error: null });
            const teams = await teamsApi.getAll(isActive);
            set({ teams, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to fetch teams';
            set({ error: message, isLoading: false });
        }
    },
    fetchTeamById: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const team = await teamsApi.getById(id);
            set({ selectedTeam: team, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to fetch team';
            set({ error: message, isLoading: false });
        }
    },
    createTeam: async (payload) => {
        try {
            set({ isLoading: true, error: null });
            await teamsApi.create(payload);
            const { fetchTeams } = get();
            await fetchTeams();
            set({ isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to create team';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    updateTeam: async (id, payload) => {
        try {
            set({ isLoading: true, error: null });
            await teamsApi.update(id, payload);
            const { fetchTeamById } = get();
            await fetchTeamById(id);
            set({ isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to update team';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    deleteTeam: async (id) => {
        try {
            set({ isLoading: true, error: null });
            await teamsApi.delete(id);
            set((state) => ({
                teams: state.teams.filter((t) => t.id !== id),
                selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam,
                isLoading: false,
            }));
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to delete team';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    clearError: () => set({ error: null }),
    clearSelectedTeam: () => set({ selectedTeam: null }),
}));
//# sourceMappingURL=team.store.js.map