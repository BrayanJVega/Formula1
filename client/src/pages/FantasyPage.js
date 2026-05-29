import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Trophy, Plus } from 'lucide-react';
import { FantasyTeamCard } from '../components/fantasy/FantasyTeamCard';
import { DriverMarket } from '../components/fantasy/DriverMarket';
import { FantasyStandings } from '../components/fantasy/FantasyStandings';
import { FantasyTeamBuilder } from '../components/fantasy/FantasyTeamBuilder';
import { useFantasyStore } from '../store/fantasy.store';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import clsx from 'clsx';
const SEASON_ID = '00000000-0000-0000-0000-000000000000';
export default function FantasyPage() {
    const { myTeam, loading, error, fetchMyTeam, createTeam, removePick } = useFantasyStore();
    const [activeTab, setActiveTab] = useState('my-team');
    const [showCreate, setShowCreate] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [creating, setCreating] = useState(false);
    useEffect(() => {
        fetchMyTeam(SEASON_ID);
    }, [fetchMyTeam]);
    const handleCreateTeam = async () => {
        if (!teamName.trim())
            return;
        setCreating(true);
        try {
            await createTeam(teamName.trim(), SEASON_ID);
            setShowCreate(false);
            setTeamName('');
            await fetchMyTeam(SEASON_ID);
        }
        catch {
        }
        finally {
            setCreating(false);
        }
    };
    const tabs = [
        { key: 'my-team', label: 'Mi Equipo', icon: _jsx(Coins, { className: "w-4 h-4" }) },
        { key: 'market', label: 'Mercado', icon: _jsx(TrendingUp, { className: "w-4 h-4" }) },
        { key: 'standings', label: 'Clasificación', icon: _jsx(Trophy, { className: "w-4 h-4" }) },
    ];
    if (loading && !myTeam) {
        return (_jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: _jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Liga Fant\u00E1stica" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Construye tu equipo F1 so\u00F1ado" })] }), _jsx("div", { className: "flex items-center gap-1 mb-8 bg-f1-gray rounded-lg p-1 w-fit", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: clsx('flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === tab.key
                        ? 'bg-f1-red text-white'
                        : 'text-gray-400 hover:text-white'), children: [tab.icon, tab.label] }, tab.key))) }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm", children: error })), !myTeam && !showCreate ? (_jsxs("div", { className: "text-center py-20", children: [_jsx(Coins, { className: "w-16 h-16 text-gray-600 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "A\u00FAn no tienes equipo fant\u00E1stico" }), _jsx("p", { className: "text-gray-400 mb-6", children: "\u00A1Crea tu equipo fant\u00E1stico para empezar a competir!" }), _jsxs(Button, { onClick: () => setShowCreate(true), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), " Crear Equipo"] })] })) : showCreate ? (_jsx("div", { className: "max-w-md mx-auto", children: _jsxs("div", { className: "bg-f1-gray rounded-xl p-6 border border-f1-gray-light/20", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Crea tu Equipo" }), _jsx(Input, { label: "Nombre del Equipo", value: teamName, onChange: (e) => setTeamName(e.target.value), placeholder: "ej. Demonios de la Velocidad" }), _jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx(Button, { onClick: handleCreateTeam, isLoading: creating, disabled: !teamName.trim(), children: "Crear" }), _jsx(Button, { variant: "ghost", onClick: () => setShowCreate(false), children: "Cancelar" })] })] }) })) : (_jsxs(_Fragment, { children: [activeTab === 'my-team' && myTeam && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(FantasyTeamCard, { team: myTeam, onRemovePick: (pickId) => removePick(pickId) }), _jsx(FantasyTeamBuilder, { teamId: myTeam.id, picks: myTeam.picks, budget: myTeam.budget })] })), activeTab === 'market' && (_jsx(DriverMarket, { seasonId: SEASON_ID })), activeTab === 'standings' && (_jsx(FantasyStandings, { seasonId: SEASON_ID }))] }))] }));
}
//# sourceMappingURL=FantasyPage.js.map