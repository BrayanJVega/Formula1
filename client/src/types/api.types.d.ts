export interface ApiError {
    error: string;
    details?: Record<string, string[]>;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=api.types.d.ts.map