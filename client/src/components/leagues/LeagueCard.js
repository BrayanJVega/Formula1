import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Users, Trophy, User, ChevronRight } from 'lucide-react';
export function LeagueCard({ myLeague }) {
    const navigate = useNavigate();
    const { league, memberCount, yourRole, yourPosition } = myLeague;
    return (_jsx(Card, { hover: true, className: "cursor-pointer", onClick: () => navigate(`/leagues/${league.id}`), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-white font-semibold text-lg truncate", children: league.name }), league.description && (_jsx("p", { className: "text-gray-400 text-sm mt-1 line-clamp-2", children: league.description })), _jsxs("div", { className: "flex items-center gap-4 mt-3 text-sm text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 14 }), memberCount, "/", league.maxMembers] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Trophy, { size: 14 }), "#", yourPosition] }), _jsxs("span", { className: "flex items-center gap-1 capitalize", children: [_jsx(User, { size: 14 }), yourRole] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 ml-4", children: [_jsxs("div", { className: "bg-f1-gray-light/20 rounded-lg px-3 py-1.5", children: [_jsx("span", { className: "text-xs text-gray-400", children: "C\u00F3digo" }), _jsx("p", { className: "text-white font-mono text-sm font-bold tracking-wider", children: league.code })] }), _jsx(ChevronRight, { size: 20, className: "text-gray-500" })] })] }) }));
}
//# sourceMappingURL=LeagueCard.js.map