import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamDetail } from '../components/teams/TeamDetail';
import { useTeamStore } from '../store/team.store';
export function TeamDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedTeam, isLoading, error, fetchTeamById } = useTeamStore();
    useEffect(() => {
        if (id) {
            fetchTeamById(id);
        }
    }, [id, fetchTeamById]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-2 border-f1-red border-t-transparent" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "space-y-4", children: _jsx("div", { className: "p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm", children: error }) }));
    }
    if (!selectedTeam) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-gray-400 text-lg", children: "Equipo no encontrado" }) }));
    }
    return (_jsx(TeamDetail, { team: selectedTeam, onBack: () => navigate('/teams') }));
}
//# sourceMappingURL=TeamDetailPage.js.map