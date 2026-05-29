import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useRaceStore } from '../store/race.store';
import { RaceCalendar } from '../components/races/RaceCalendar';
import { Spinner } from '../components/ui/Spinner';
const CURRENT_SEASON_ID = import.meta.env.VITE_CURRENT_SEASON_ID || 'default-season-id';
export default function CalendarPage() {
    const { races, nextRace, isLoading, error, fetchRaces, fetchNextRace } = useRaceStore();
    useEffect(() => {
        fetchRaces(CURRENT_SEASON_ID);
        fetchNextRace();
    }, [fetchRaces, fetchNextRace]);
    if (isLoading && races.length === 0) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Calendario de Carreras" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Temporada F1 2025" })] }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-400 text-sm", children: error }) })), _jsx(RaceCalendar, { races: races, nextRaceId: nextRace?.id })] }));
}
//# sourceMappingURL=CalendarPage.js.map