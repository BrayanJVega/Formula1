import type { GamificationProfile, Achievement } from '../types/gamification.types';
interface GamificationState {
    profile: GamificationProfile | null;
    achievements: Achievement[];
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    fetchAchievements: () => Promise<void>;
    clearError: () => void;
}
export declare const useGamificationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GamificationState>>;
export {};
//# sourceMappingURL=gamification.store.d.ts.map