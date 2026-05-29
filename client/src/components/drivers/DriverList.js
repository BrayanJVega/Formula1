import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { DriverCard } from './DriverCard';
import { useDriverStore } from '../../store/driver.store';
export function DriverList() {
    const { drivers, loading, error, pagination, fetchDrivers } = useDriverStore();
    const [search, setSearch] = useState('');
    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);
    const filteredDrivers = drivers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-red-400", children: error }) }));
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "mb-6 flex items-center gap-4", children: _jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" }), _jsx("input", { type: "text", placeholder: "Buscar pilotos...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full bg-f1-gray border border-f1-gray-light/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-f1-red transition-colors" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredDrivers.map((driver) => (_jsx(DriverCard, { driver: driver }, driver.id))) }), filteredDrivers.length === 0 && (_jsx("div", { className: "text-center py-20 text-gray-500", children: search ? 'Ningún piloto coincide con tu búsqueda.' : 'No se encontraron pilotos.' })), pagination.total > pagination.limit && (_jsx("div", { className: "flex justify-center items-center gap-4 mt-8", children: _jsxs("p", { className: "text-sm text-gray-400", children: ["Mostrando ", drivers.length, " de ", pagination.total, " pilotos"] }) }))] }));
}
//# sourceMappingURL=DriverList.js.map