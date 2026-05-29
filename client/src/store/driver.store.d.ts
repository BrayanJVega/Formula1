import type { Driver, DriverDetail, DriverFilters } from '../types';
interface DriverState {
    drivers: Driver[];
    selectedDriver: DriverDetail | null;
    filters: DriverFilters;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
    loading: boolean;
    error: string | null;
    fetchDrivers: (filters?: DriverFilters) => Promise<void>;
    fetchDriverById: (id: string) => Promise<void>;
    createDriver: (data: import('../types').CreateDriverPayload) => Promise<Driver>;
    updateDriver: (id: string, data: import('../types').UpdateDriverPayload) => Promise<Driver>;
    deleteDriver: (id: string) => Promise<void>;
    setFilters: (filters: DriverFilters) => void;
    clearError: () => void;
}
export declare const useDriverStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DriverState>>;
export {};
//# sourceMappingURL=driver.store.d.ts.map