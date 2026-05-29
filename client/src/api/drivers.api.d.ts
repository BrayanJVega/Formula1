import type { Driver, DriverDetail, CreateDriverPayload, UpdateDriverPayload, DriverFilters, PaginatedDrivers } from '../types';
export declare const driversApi: {
    getDrivers(filters?: DriverFilters): Promise<PaginatedDrivers>;
    getDriverById(id: string): Promise<DriverDetail>;
    createDriver(payload: CreateDriverPayload): Promise<Driver>;
    updateDriver(id: string, payload: UpdateDriverPayload): Promise<Driver>;
    deleteDriver(id: string): Promise<void>;
};
//# sourceMappingURL=drivers.api.d.ts.map