export interface User {
    id: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
    avatarUrl?: string;
    country?: string;
}
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
export interface LoginPayload {
    email: string;
    password: string;
}
export interface RegisterPayload {
    email: string;
    username: string;
    password: string;
}
//# sourceMappingURL=auth.types.d.ts.map