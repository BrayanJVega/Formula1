import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLeagueStore } from '../../store/league.store';
import { useAuthStore } from '../../store/auth.store';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Code, ArrowLeft, User, Crown } from 'lucide-react';
import { getFlagEmoji } from '../../utils/flags';
export function LeagueDetail({ leagueId }) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentLeague, isLoading, error, fetchLeagueById, leaveLeague, leagueRankings, fetchLeagueRanking } = useLeagueStore();
    useEffect(() => {
        if (leagueId) {
            fetchLeagueById(leagueId);
            fetchLeagueRanking(leagueId);
        }
    }, [leagueId, fetchLeagueById, fetchLeagueRanking]);
    if (isLoading && !currentLeague) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return _jsx("div", { className: "text-center py-8 text-red-400", children: error });
    }
    if (!currentLeague) {
        return _jsx("div", { className: "text-center py-8 text-gray-400", children: "League not found." });
    }
    const { league, members } = currentLeague;
    const isOwner = league.ownerId === user?.id;
    const isMember = members.some((m) => m.userId === user?.id);
    const handleLeave = async () => {
        if (confirm('¿Seguro que quieres abandonar esta liga?')) {
            try {
                await leaveLeague(league.id);
                navigate('/leagues');
            }
            catch { }
        }
    };
    const userMember = members.find((m) => m.userId === user?.id);
    const userRanking = leagueRankings.find((r) => r.userId === user?.id);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("button", { onClick: () => navigate('/leagues'), className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors", children: [_jsx(ArrowLeft, { size: 18 }), "Volver a Ligas"] }), _jsx(Card, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: league.name }), league.description && (_jsx("p", { className: "text-gray-400 mt-1", children: league.description })), _jsxs("div", { className: "flex items-center gap-4 mt-3 text-sm text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 16 }), members.length, "/", league.maxMembers, " miembros"] }), userRanking && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Trophy, { size: 16 }), "Tu Posici\u00F3n: #", userRanking.position] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Code, { size: 16 }), "C\u00F3digo: ", _jsx("span", { className: "font-mono text-white font-bold tracking-wider", children: league.code })] })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${league.isPrivate ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`, children: league.isPrivate ? 'Privada' : 'Pública' }) })] }) }), isMember && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(Card, { children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Tu Rol" }), _jsxs("p", { className: "text-white font-semibold text-lg capitalize mt-1 flex items-center justify-center gap-1", children: [isOwner ? _jsx(Crown, { size: 18, className: "text-yellow-400" }) : _jsx(User, { size: 18 }), userMember?.role || 'member'] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Tu Puntuaci\u00F3n" }), _jsx("p", { className: "text-white font-semibold text-lg mt-1", children: userMember ? userMember.totalScore.toFixed(1) : '0.0' })] }) }), _jsx(Card, { children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Posici\u00F3n" }), _jsx("p", { className: "text-white font-semibold text-lg mt-1", children: userRanking ? `#${userRanking.position}` : '-' })] }) })] })), _jsxs(Card, { children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [_jsx(Trophy, { size: 20, className: "text-f1-red" }), "Miembros y Clasificaci\u00F3n"] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-f1-gray-light/20", children: [_jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Pos" }), _jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Usuario" }), _jsx("th", { className: "text-left py-3 px-4 text-gray-400 text-sm font-medium", children: "Pa\u00EDs" }), _jsx("th", { className: "text-center py-3 px-4 text-gray-400 text-sm font-medium", children: "Rol" }), _jsx("th", { className: "text-right py-3 px-4 text-gray-400 text-sm font-medium", children: "Puntos" })] }) }), _jsx("tbody", { children: members.map((member, index) => {
                                        const ranking = leagueRankings.find((r) => r.userId === member.userId);
                                        const pos = ranking?.position || index + 1;
                                        return (_jsxs("tr", { className: `border-b border-f1-gray-light/10 hover:bg-f1-gray-light/5 transition-colors ${member.userId === user?.id ? 'bg-f1-red/5' : ''}`, children: [_jsx("td", { className: "py-3 px-4", children: _jsxs("span", { className: `font-bold ${pos <= 3 ? 'text-f1-red' : 'text-white'}`, children: ["#", pos] }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("span", { className: "text-white font-medium flex items-center gap-2", children: [member.username, member.userId === league.ownerId && (_jsx(Crown, { size: 14, className: "text-yellow-400" }))] }) }), _jsx("td", { className: "py-3 px-4 text-gray-300", children: member.country ? (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-lg", children: getFlagEmoji(member.country) }), _jsx("span", { className: "text-sm", children: member.country })] })) : (_jsx("span", { className: "text-gray-500", children: "\u2014" })) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("span", { className: `capitalize text-sm ${member.role === 'owner' ? 'text-yellow-400' :
                                                            member.role === 'admin' ? 'text-blue-400' : 'text-gray-400'}`, children: member.role }) }), _jsx("td", { className: "py-3 px-4 text-right text-white font-semibold", children: member.totalScore.toFixed(1) })] }, member.id));
                                    }) })] }) })] }), isMember && !isOwner && (_jsx("div", { className: "flex justify-end", children: _jsx(Button, { variant: "ghost", onClick: handleLeave, isLoading: isLoading, children: "Abandonar Liga" }) }))] }));
}
//# sourceMappingURL=LeagueDetail.js.map