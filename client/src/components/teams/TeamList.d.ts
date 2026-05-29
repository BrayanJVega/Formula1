import type { Team } from '../../types/team.types';
interface TeamListProps {
    teams: Team[];
    onTeamClick?: (id: string) => void;
}
export declare function TeamList({ teams, onTeamClick }: TeamListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TeamList.d.ts.map