import { create } from 'zustand';
import { fantasyApi } from '../api/fantasy.api';
export const useFantasyStore = create((set, get) => ({
    myTeam: null,
    marketValues: [],
    standings: [],
    loading: false,
    error: null,
    createTeam: async (name, seasonId) => {
        try {
            set({ loading: true, error: null });
            const team = await fantasyApi.createTeam({ name, seasonId });
            set({ loading: false });
            return team;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to create team';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    fetchMyTeam: async (seasonId) => {
        try {
            set({ loading: true, error: null });
            const team = await fantasyApi.getMyTeam(seasonId);
            set({ myTeam: team, loading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to fetch team';
            set({ error: message, loading: false });
        }
    },
    fetchTeamById: async (id) => {
        try {
            set({ loading: true, error: null });
            const team = await fantasyApi.getTeamById(id);
            set({ loading: false });
            return team;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to fetch team';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    updateTeam: async (id, name) => {
        try {
            set({ loading: true, error: null });
            const updated = await fantasyApi.updateTeam(id, name);
            set((state) => ({
                myTeam: state.myTeam?.id === id ? { ...state.myTeam, ...updated } : state.myTeam,
                loading: false,
            }));
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to update team';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    addPick: async (teamId, payload) => {
        try {
            set({ loading: true, error: null });
            const pick = await fantasyApi.addPick(teamId, payload);
            set((state) => ({
                myTeam: state.myTeam
                    ? {
                        ...state.myTeam,
                        picks: [...state.myTeam.picks, pick],
                        budget: state.myTeam.budget - payload.cost,
                    }
                    : null,
                loading: false,
            }));
            return pick;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to add pick';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    removePick: async (pickId) => {
        try {
            set({ loading: true, error: null });
            const team = await fantasyApi.removePick(pickId);
            set((state) => ({
                myTeam: state.myTeam
                    ? {
                        ...state.myTeam,
                        picks: state.myTeam.picks.filter((p) => p.id !== pickId),
                        budget: team.budget,
                    }
                    : null,
                loading: false,
            }));
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to remove pick';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    transferDriver: async (teamId, payload) => {
        try {
            set({ loading: true, error: null });
            const result = await fantasyApi.transferDriver(teamId, payload);
            await get().fetchMyTeam(result.team.seasonId);
            set({ loading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to transfer driver';
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },
    fetchMarketValues: async (seasonId) => {
        try {
            set({ loading: true, error: null });
            const values = await fantasyApi.getMarketValues(seasonId);
            set({ marketValues: values, loading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to fetch market values';
            set({ error: message, loading: false });
        }
    },
    fetchStandings: async (seasonId) => {
        try {
            set({ loading: true, error: null });
            const standings = await fantasyApi.getStandings(seasonId);
            set({ standings, loading: false });
        }
        catch (err) {
            const msg = err.response?.data?.error || 'Failed to fetch standings';
            set({ error: msg, loading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=fantasy.store.js.map