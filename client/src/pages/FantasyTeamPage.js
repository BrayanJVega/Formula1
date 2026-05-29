import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Coins, Trophy, Repeat, Calendar } from 'lucide-react';
import { FantasyTeamCard } from '../components/fantasy/FantasyTeamCard';
import { useFantasyStore } from '../store/fantasy.store';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';
export default function FantasyTeamPage() {
    const { id } = useParams();
    const { fetchTeamById, loading } = useFantasyStore();
    const [team, setTeam] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        fetchTeamById(id)
            .then(setTeam)
            .catch((err) => setError(err.message));
    }, [id, fetchTeamById]);
    if (loading && !team) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: _jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: _jsxs("div", { className: "text-center py-20", children: [_jsx("p", { className: "text-red-400", children: error }), _jsx(Link, { to: "/fantasy", className: "text-f1-red hover:underline mt-4 inline-block", children: "Volver a Fant\u00E1stico" })] }) }));
    }
    if (!team)
        return null;
    const activePicks = team.picks.filter((p) => p.isActive);
    const totalValue = activePicks.reduce((sum, p) => sum + p.cost, 0);
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("div", { className: "mb-6", children: _jsxs(Link, { to: "/fantasy", className: "inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Volver a Fant\u00E1stico"] }) }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: team.name }), _jsx("p", { className: "text-gray-400 mt-1", children: "Detalles del Equipo Fant\u00E1stico" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Trophy, { className: "w-8 h-8 text-f1-red" }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: team.totalScore.toFixed(1) }), _jsx("p", { className: "text-xs text-gray-500", children: "Puntuaci\u00F3n Total" })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Coins, { className: "w-8 h-8 text-yellow-400" }), _jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold text-white", children: [team.budget.toFixed(1), "M"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Presupuesto Restante" })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Coins, { className: "w-8 h-8 text-green-400" }), _jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold text-white", children: [totalValue.toFixed(1), "M"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Valor del Equipo" })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: _jsx(FantasyTeamCard, { team: team, readonly: true }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h2", { className: "text-xl font-bold text-white flex items-center gap-2", children: [_jsx(Repeat, { className: "w-5 h-5" }), " Historial de Transferencias"] }), team.transfers.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm", children: "A\u00FAn no hay transferencias." })) : (_jsx("div", { className: "space-y-2", children: team.transfers.map((t) => (_jsx(TransferRow, { transfer: t }, t.id))) }))] })] }));
}
function TransferRow({ transfer }) {
    return (_jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Repeat, { className: "w-5 h-5 text-f1-red" }), _jsxs("div", { children: [_jsxs("p", { className: "text-white text-sm font-medium", children: [transfer.driverOutId ? `Out: #${transfer.driverOutId.slice(0, 8)}` : 'N/A', _jsx("span", { className: "text-gray-500 mx-2", children: "\u2192" }), transfer.driverInId ? `In: #${transfer.driverInId.slice(0, 8)}` : 'N/A'] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Calendar, { className: "w-3 h-3 text-gray-500" }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(transfer.transferAt).toLocaleDateString() })] })] })] }), _jsxs("span", { className: "text-yellow-400 font-semibold", children: [transfer.cost.toFixed(1), "M"] })] }) }));
}
//# sourceMappingURL=FantasyTeamPage.js.map