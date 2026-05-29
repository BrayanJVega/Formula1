export type AchievementCategory = 'prediction' | 'fantasy' | 'streak' | 'social' | 'special';
export interface Achievement {
    id: string;
    key: string;
    name: string;
    description: string;
    iconUrl?: string;
    category: AchievementCategory;
    pointsReward: number;
    criteria: Record<string, unknown>;
    createdAt: string;
    isUnlocked?: boolean;
    unlockedAt?: string | null;
}
export interface UserAchievement {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: string;
    isDisplayed: boolean;
    achievement?: Achievement;
}
export interface Level {
    id: string;
    name: string;
    levelNumber: number;
    minPoints: number;
    badgeUrl?: string;
    rewards?: Record<string, unknown>;
}
export interface UserLevel {
    level: Level;
    currentXp: number;
    progress: number;
    xpToNextLevel: number;
    xpForCurrentLevel: number;
}
export interface Streak {
    currentStreak: number;
    bestStreak: number;
    lastPredictionDate: string | null;
}
export interface GamificationActivity {
    type: 'achievement' | 'level_up' | 'streak' | 'xp';
    description: string;
    points?: number;
    createdAt: string;
}
export interface GamificationProfile {
    level: UserLevel;
    achievements: UserAchievement[];
    streaks: Streak;
    totalAchievements: number;
    unlockedAchievements: number;
    recentActivity: GamificationActivity[];
}
//# sourceMappingURL=gamification.types.d.ts.map