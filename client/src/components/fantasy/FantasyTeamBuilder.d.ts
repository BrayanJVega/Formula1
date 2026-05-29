import type { FantasyPick } from '../../types/fantasy.types';
interface FantasyTeamBuilderProps {
    teamId: string;
    picks: FantasyPick[];
    budget: number;
    onComplete?: () => void;
}
export declare function FantasyTeamBuilder({ teamId, picks, budget, onComplete }: FantasyTeamBuilderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FantasyTeamBuilder.d.ts.map