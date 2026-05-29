import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLeagueStore } from '../store/league.store';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { LeagueCard } from '../components/leagues/LeagueCard';
import { CreateLeagueModal } from '../components/leagues/CreateLeagueModal';
import { JoinLeagueModal } from '../components/leagues/JoinLeagueModal';
import { Plus, LogIn, Users } from 'lucide-react';
export default function LeaguesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const { myLeagues, isLoading, error, fetchMyLeagues } = useLeagueStore();
    useEffect(() => {
        fetchMyLeagues();
    }, [fetchMyLeagues]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Mis Ligas" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Crea o \u00FAnete a ligas privadas para competir con amigos." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "secondary", onClick: () => setShowJoinModal(true), children: [_jsx(LogIn, { size: 16, className: "mr-2" }), "Unirse"] }), _jsxs(Button, { onClick: () => setShowCreateModal(true), children: [_jsx(Plus, { size: 16, className: "mr-2" }), "Crear Liga"] })] })] }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm", children: error })), isLoading ? (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) })) : myLeagues.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx(Users, { size: 48, className: "mx-auto text-gray-600 mb-4" }), _jsx("p", { className: "text-gray-400 text-lg", children: "A\u00FAn no tienes ligas" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Crea una nueva liga o \u00FAnete a una con un c\u00F3digo de invitaci\u00F3n." }), _jsxs("div", { className: "flex items-center justify-center gap-3 mt-6", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowJoinModal(true), children: "Unirse a una Liga" }), _jsx(Button, { onClick: () => setShowCreateModal(true), children: "Crear Liga" })] })] })) : (_jsx("div", { className: "grid gap-4", children: myLeagues.map((myLeague) => (_jsx(LeagueCard, { myLeague: myLeague }, myLeague.league.id))) })), _jsx(CreateLeagueModal, { isOpen: showCreateModal, onClose: () => setShowCreateModal(false) }), _jsx(JoinLeagueModal, { isOpen: showJoinModal, onClose: () => setShowJoinModal(false) })] }));
}
//# sourceMappingURL=LeaguesPage.js.map