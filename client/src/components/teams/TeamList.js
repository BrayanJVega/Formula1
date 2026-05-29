import { jsx as _jsx } from "react/jsx-runtime";
import { TeamCard } from './TeamCard';
export function TeamList({ teams, onTeamClick }) {
    if (teams.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-400 text-lg", children: "No se encontraron equipos" }) }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: teams.map((team) => (_jsx(TeamCard, { team: team, onClick: onTeamClick ? () => onTeamClick(team.id) : undefined }, team.id))) }));
}
//# sourceMappingURL=TeamList.js.map