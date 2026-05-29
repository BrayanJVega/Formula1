import type { GamificationProfile, Achievement, Level, Streak } from '../types/gamification.types';
export declare const gamificationApi: {
    getProfile(): Promise<{
        data: GamificationProfile;
    }>;
    getAchievements(): Promise<{
        data: Achievement[];
    }>;
    getLevels(): Promise<{
        data: Level[];
    }>;
    getStreaks(): Promise<{
        data: Streak;
    }>;
};
//# sourceMappingURL=gamification.api.d.ts.map