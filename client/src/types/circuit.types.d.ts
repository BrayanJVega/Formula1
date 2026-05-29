export interface Circuit {
    id: string;
    name: string;
    country: string;
    city: string;
    lengthKm: number;
    turns: number;
    drsZones: number;
    lapRecord?: string;
    lapRecordTime?: number;
    lapRecordDriverId?: string;
    lapRecordYear?: number;
    capacity?: number;
    firstGpYear: number;
    circuitMapUrl?: string;
    imageUrl?: string;
    description?: string;
    altitude?: number;
    isStreetCircuit: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CreateCircuitPayload {
    name: string;
    country: string;
    city: string;
    lengthKm: number;
    turns: number;
    drsZones: number;
    lapRecord?: string;
    lapRecordTime?: number;
    lapRecordDriverId?: string;
    lapRecordYear?: number;
    capacity?: number;
    firstGpYear: number;
    circuitMapUrl?: string;
    imageUrl?: string;
    description?: string;
    altitude?: number;
    isStreetCircuit?: boolean;
}
export type UpdateCircuitPayload = Partial<CreateCircuitPayload>;
export interface CircuitFilters {
    search?: string;
    country?: string;
    isStreetCircuit?: boolean;
    sortBy?: 'name' | 'country' | 'lengthKm' | 'turns' | 'firstGpYear';
    sortOrder?: 'asc' | 'desc';
}
//# sourceMappingURL=circuit.types.d.ts.map