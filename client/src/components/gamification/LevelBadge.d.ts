import type { Level } from '../../types/gamification.types';
interface LevelBadgeProps {
    level: Level;
    currentXp: number;
    progress: number;
    size?: 'sm' | 'md' | 'lg';
}
export declare function LevelBadge({ level, currentXp, progress: _progress, size }: LevelBadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LevelBadge.d.ts.map