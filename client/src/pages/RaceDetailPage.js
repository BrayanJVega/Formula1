import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRaceStore } from '../store/race.store';
import { RaceDetail } from '../components/races/RaceDetail';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
export default function RaceDetailPage() {
    const { id } = useParams();
    const { selectedRace, isLoading, error, fetchRaceById } = useRaceStore();
    useEffect(() => {
        if (id)
            fetchRaceById(id);
    }, [id, fetchRaceById]);
    if (isLoading) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-16 flex justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/calendar", className: "inline-block mb-6", children: _jsx(Button, { variant: "ghost", children: "\u2190 Volver al Calendario" }) }), _jsx("div", { className: "bg-red-500/20 border border-red-500/30 rounded-lg p-4", children: _jsx("p", { className: "text-red-400", children: error }) })] }));
    }
    if (!selectedRace) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/calendar", className: "inline-block mb-6", children: _jsx(Button, { variant: "ghost", children: "\u2190 Volver al Calendario" }) }), _jsx("div", { className: "text-center py-16", children: _jsx("p", { className: "text-gray-500 text-lg", children: "Carrera no encontrada." }) })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx(Link, { to: "/calendar", className: "inline-block mb-6", children: _jsx(Button, { variant: "ghost", children: "\u2190 Volver al Calendario" }) }), _jsx(RaceDetail, { race: selectedRace })] }));
}
//# sourceMappingURL=RaceDetailPage.js.map