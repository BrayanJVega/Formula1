import type { Achievement } from '../../types/gamification.types';
interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: string | null;
}
export declare function AchievementCard({ achievement, isUnlocked, unlockedAt }: AchievementCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AchievementCard.d.ts.map