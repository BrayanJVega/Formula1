import type { Circuit, CreateCircuitPayload, UpdateCircuitPayload } from '../types/circuit.types';
export declare const circuitsApi: {
    getAll(): Promise<Circuit[]>;
    getById(id: string): Promise<Circuit>;
    create(payload: CreateCircuitPayload): Promise<Circuit>;
    update(id: string, payload: UpdateCircuitPayload): Promise<Circuit>;
    delete(id: string): Promise<void>;
};
//# sourceMappingURL=circuits.api.d.ts.map