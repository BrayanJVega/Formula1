import { create } from 'zustand';
import type { League, LeagueWithMembers, MyLeague, CreateLeaguePayload, RankingEntry } from '../types';
import { leaguesApi } from '../api/leagues.api';

interface LeagueState {
  myLeagues: MyLeague[];
  currentLeague: LeagueWithMembers | null;
  leagueRankings: RankingEntry[];
  isLoading: boolean;
  error: string | null;

  createLeague: (data: CreateLeaguePayload) => Promise<League>;
  fetchMyLeagues: () => Promise<void>;
  fetchLeagueById: (id: string) => Promise<void>;
  joinLeague: (code: string) => Promise<League>;
  leaveLeague: (id: string) => Promise<void>;
  fetchLeagueRanking: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useLeagueStore = create<LeagueState>((set, get) => ({
  myLeagues: [],
  currentLeague: null,
  leagueRankings: [],
  isLoading: false,
  error: null,

  createLeague: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const { data: league } = await leaguesApi.create(data);
      const { myLeagues } = get();
      set({
        myLeagues: [
          { league, memberCount: 1, yourRole: 'owner', yourScore: 0, yourPosition: 1 },
          ...myLeagues,
        ],
        isLoading: false,
      });
      return league;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create league';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  fetchMyLeagues: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await leaguesApi.getMyLeagues();
      set({ myLeagues: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load leagues', isLoading: false });
    }
  },

  fetchLeagueById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await leaguesApi.getById(id);
      set({ currentLeague: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load league', isLoading: false });
    }
  },

  joinLeague: async (code) => {
    try {
      set({ isLoading: true, error: null });
      const { data: league } = await leaguesApi.join(code);
      const { myLeagues } = get();
      set({
        myLeagues: [
          { league, memberCount: 0, yourRole: 'member', yourScore: 0, yourPosition: 0 },
          ...myLeagues,
        ],
        isLoading: false,
      });
      return league;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to join league';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  leaveLeague: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await leaguesApi.leave(id);
      const { myLeagues } = get();
      set({
        myLeagues: myLeagues.filter((ml) => ml.league.id !== id),
        currentLeague: get().currentLeague?.league.id === id ? null : get().currentLeague,
        isLoading: false,
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to leave league';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  fetchLeagueRanking: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await leaguesApi.getLeagueRanking(id);
      set({ leagueRankings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load league ranking', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
