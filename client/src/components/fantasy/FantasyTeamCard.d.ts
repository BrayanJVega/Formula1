import type { FantasyTeamDetail } from '../../types/fantasy.types';
interface FantasyTeamCardProps {
    team: FantasyTeamDetail;
    onRemovePick?: (pickId: string) => void;
    readonly?: boolean;
}
export declare function FantasyTeamCard({ team, onRemovePick, readonly }: FantasyTeamCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FantasyTeamCard.d.ts.map