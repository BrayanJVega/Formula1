import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { TeamList } from '../components/teams/TeamList';
import { useTeamStore } from '../store/team.store';
import { useNavigate } from 'react-router-dom';
export function TeamsPage() {
    const navigate = useNavigate();
    const { teams, isLoading, error, fetchTeams } = useTeamStore();
    useEffect(() => {
        fetchTeams(true);
    }, [fetchTeams]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-2 border-f1-red border-t-transparent" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Equipos" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Explora los equipos de F\u00F3rmula 1 y su historia" })] }), error && (_jsx("div", { className: "p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm", children: error })), _jsx(TeamList, { teams: teams, onTeamClick: (id) => navigate(`/teams/${id}`) })] }));
}
//# sourceMappingURL=TeamsPage.js.map