import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Zap, Clock, Target, MapPin, Calendar, Flag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { nationalityFlag, formatDate, formatPosition } from '../../utils/formatters';
export function DriverDetail({ driver, loading, error }) {
    const navigate = useNavigate();
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    if (!driver) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-gray-400", children: "Piloto no encontrado" }) }));
    }
    const statItems = [
        { label: 'Campeonatos', value: driver.stats?.championships ?? 0, icon: Trophy },
        { label: 'Victorias', value: driver.stats?.wins ?? 0, icon: Medal },
        { label: 'Podios', value: driver.stats?.podiums ?? 0, icon: Medal },
        { label: 'Poles', value: driver.stats?.poles ?? 0, icon: Zap },
        { label: 'Vueltas Rápidas', value: driver.stats?.fastestLaps ?? 0, icon: Clock },
        { label: 'Puntos Totales', value: driver.stats?.totalPoints ?? 0, icon: Target },
        { label: 'Carreras Disputadas', value: driver.stats?.racesEntered ?? 0, icon: Flag },
    ];
    return (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate('/drivers'), className: "mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Volver a Pilotos"] }), _jsx("div", { className: "bg-f1-gray rounded-xl p-8 border border-f1-gray-light/20 mb-8", children: _jsxs("div", { className: "flex flex-col md:flex-row items-start gap-8", children: [_jsx("div", { className: "w-40 h-40 rounded-full bg-f1-gray-dark flex items-center justify-center overflow-hidden shrink-0", children: driver.photoUrl ? (_jsx("img", { src: driver.photoUrl, alt: driver.name, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-5xl font-bold text-f1-red", children: driver.name.split(' ').map((n) => n[0]).join('').toUpperCase() })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "text-3xl", children: nationalityFlag(driver.nationality) }), _jsx("h1", { className: "text-4xl font-bold text-white", children: driver.name })] }), _jsxs("div", { className: "flex flex-wrap gap-6 mt-4 text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-2xl font-bold text-f1-red", children: ["#", driver.number] }), _jsx("span", { children: "N\u00FAmero" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { children: driver.nationality })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: formatDate(driver.dateOfBirth) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [driver.team.logoUrl && (_jsx("img", { src: driver.team.logoUrl, alt: "", className: "w-5 h-5 object-contain" })), _jsx("span", { className: "text-white font-medium", children: driver.team.name })] })] }), driver.biography && (_jsx("p", { className: "mt-6 text-gray-300 leading-relaxed", children: driver.biography }))] })] }) }), driver.stats && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Estad\u00EDsticas de Carrera" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: statItems.map((item) => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(item.icon, { className: "w-5 h-5 text-f1-red" }), _jsx("span", { className: "text-sm text-gray-400", children: item.label })] }), _jsx("p", { className: "text-2xl font-bold text-white", children: item.value })] }, item.label))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Target, { className: "w-4 h-4 text-f1-red" }), _jsx("span", { className: "text-sm text-gray-400", children: "Posici\u00F3n en Temporada" })] }), _jsx("p", { className: "text-2xl font-bold text-white", children: formatPosition(driver.stats.seasonPosition) })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Target, { className: "w-4 h-4 text-f1-red" }), _jsx("span", { className: "text-sm text-gray-400", children: "Puntos de Temporada" })] }), _jsx("p", { className: "text-2xl font-bold text-white", children: driver.stats.seasonPoints })] })] })] }))] }));
}
//# sourceMappingURL=DriverDetail.js.map