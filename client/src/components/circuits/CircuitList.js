import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { CircuitCard } from './CircuitCard';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
export function CircuitList({ circuits, isLoading, filters, onFiltersChange }) {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const filteredCircuits = useMemo(() => {
        let result = [...circuits];
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter((c) => c.name.toLowerCase().includes(q) ||
                c.country.toLowerCase().includes(q) ||
                c.city.toLowerCase().includes(q));
        }
        if (filters.country) {
            result = result.filter((c) => c.country === filters.country);
        }
        if (filters.isStreetCircuit !== undefined) {
            result = result.filter((c) => c.isStreetCircuit === filters.isStreetCircuit);
        }
        const sortBy = filters.sortBy || 'name';
        const sortOrder = filters.sortOrder || 'asc';
        result.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortOrder === 'asc'
                ? aVal - bVal
                : bVal - aVal;
        });
        return result;
    }, [circuits, filters]);
    const countries = useMemo(() => {
        return [...new Set(circuits.map((c) => c.country))].sort();
    }, [circuits]);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { placeholder: "Buscar circuitos...", value: searchInput, onChange: (e) => {
                                setSearchInput(e.target.value);
                                onFiltersChange({ search: e.target.value });
                            } }) }), _jsxs("select", { className: "bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red transition-colors", value: filters.country || '', onChange: (e) => onFiltersChange({ country: e.target.value || undefined }), children: [_jsx("option", { value: "", children: "Todos los Pa\u00EDses" }), countries.map((c) => (_jsx("option", { value: c, children: c }, c)))] }), _jsxs("select", { className: "bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red transition-colors", value: `${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`, onChange: (e) => {
                            const [sortBy, sortOrder] = e.target.value.split('-');
                            onFiltersChange({ sortBy, sortOrder });
                        }, children: [_jsx("option", { value: "name-asc", children: "Nombre (A-Z)" }), _jsx("option", { value: "name-desc", children: "Nombre (Z-A)" }), _jsx("option", { value: "country-asc", children: "Pa\u00EDs (A-Z)" }), _jsx("option", { value: "country-desc", children: "Pa\u00EDs (Z-A)" }), _jsx("option", { value: "lengthKm-desc", children: "Longitud (Mayor a Menor)" }), _jsx("option", { value: "lengthKm-asc", children: "Longitud (Menor a Mayor)" }), _jsx("option", { value: "turns-desc", children: "Curvas (M\u00E1s)" }), _jsx("option", { value: "turns-asc", children: "Curvas (Menos)" }), _jsx("option", { value: "firstGpYear-desc", children: "Primer GP (M\u00E1s Reciente)" }), _jsx("option", { value: "firstGpYear-asc", children: "Primer GP (M\u00E1s Antiguo)" })] })] }), isLoading ? (_jsx("div", { className: "flex justify-center py-20", children: _jsx(Spinner, { size: "lg" }) })) : filteredCircuits.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("p", { className: "text-gray-400 text-lg", children: "No se encontraron circuitos" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Prueba ajustando tu b\u00FAsqueda o filtros" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredCircuits.map((circuit) => (_jsx(CircuitCard, { circuit: circuit }, circuit.id))) })), _jsxs("p", { className: "text-gray-500 text-sm mt-4", children: ["Mostrando ", filteredCircuits.length, " de ", circuits.length, " circuitos"] })] }));
}
//# sourceMappingURL=CircuitList.js.map