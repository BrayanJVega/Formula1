import { useMemo, useState } from 'react';
import { CircuitCard } from './CircuitCard';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import type { Circuit, CircuitFilters } from '../../types/circuit.types';

interface CircuitListProps {
  circuits: Circuit[];
  isLoading: boolean;
  filters: CircuitFilters;
  onFiltersChange: (filters: Partial<CircuitFilters>) => void;
}

export function CircuitList({ circuits, isLoading, filters, onFiltersChange }: CircuitListProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const filteredCircuits = useMemo(() => {
    let result = [...circuits];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
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
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [circuits, filters]);

  const countries = useMemo(() => {
    return [...new Set(circuits.map((c) => c.country))].sort();
  }, [circuits]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar circuitos..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              onFiltersChange({ search: e.target.value });
            }}
          />
        </div>
        <select
          className="bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red transition-colors"
          value={filters.country || ''}
          onChange={(e) => onFiltersChange({ country: e.target.value || undefined })}
        >
          <option value="">Todos los Países</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="bg-f1-gray-dark border border-f1-gray-light/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-f1-red transition-colors"
          value={`${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [CircuitFilters['sortBy'], CircuitFilters['sortOrder']];
            onFiltersChange({ sortBy, sortOrder });
          }}
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="country-asc">País (A-Z)</option>
          <option value="country-desc">País (Z-A)</option>
          <option value="lengthKm-desc">Longitud (Mayor a Menor)</option>
          <option value="lengthKm-asc">Longitud (Menor a Mayor)</option>
          <option value="turns-desc">Curvas (Más)</option>
          <option value="turns-asc">Curvas (Menos)</option>
          <option value="firstGpYear-desc">Primer GP (Más Reciente)</option>
          <option value="firstGpYear-asc">Primer GP (Más Antiguo)</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredCircuits.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No se encontraron circuitos</p>
          <p className="text-gray-500 text-sm mt-1">Prueba ajustando tu búsqueda o filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircuits.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">
        Mostrando {filteredCircuits.length} de {circuits.length} circuitos
      </p>
    </div>
  );
}
