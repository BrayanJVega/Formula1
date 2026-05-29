import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GlobalRankingTable } from '../components/rankings/GlobalRankingTable';
import { WeeklyRankingTable } from '../components/rankings/WeeklyRankingTable';
import { CountryRankingTable } from '../components/rankings/CountryRankingTable';
import { clsx } from 'clsx';
import { Globe, Calendar, Flag } from 'lucide-react';
const TABS = [
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'weekly', label: 'Semanal', icon: Calendar },
    { id: 'country', label: 'País', icon: Flag },
];
export default function RankingsPage() {
    const [activeTab, setActiveTab] = useState('global');
    const [countryCode, setCountryCode] = useState('');
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Clasificaciones" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Mira c\u00F3mo te comparas con la competencia." })] }), _jsx("div", { className: "flex border-b border-f1-gray-light/20", children: TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: clsx('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all', activeTab === tab.id
                            ? 'border-f1-red text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'), children: [_jsx(Icon, { size: 16 }), tab.label] }, tab.id));
                }) }), _jsxs("div", { children: [activeTab === 'global' && _jsx(GlobalRankingTable, {}), activeTab === 'weekly' && _jsx(WeeklyRankingTable, {}), activeTab === 'country' && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex gap-3", children: _jsx("input", { type: "text", value: countryCode, onChange: (e) => setCountryCode(e.target.value), placeholder: "Introduce pa\u00EDs o c\u00F3digo...", className: "flex-1 bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-f1-red transition-colors duration-200" }) }), countryCode ? (_jsx(CountryRankingTable, { countryCode: countryCode })) : (_jsx("p", { className: "text-center py-12 text-gray-400", children: "Introduce un pa\u00EDs para filtrar clasificaciones." }))] }))] })] }));
}
//# sourceMappingURL=RankingsPage.js.map