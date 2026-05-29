import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';
export declare const authApi: {
    register(payload: RegisterPayload): Promise<AuthResponse>;
    login(payload: LoginPayload): Promise<AuthResponse>;
    logout(): Promise<void>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(): Promise<{
        user: import("../types").User;
    }>;
    forgotPassword(email: string): Promise<void>;
};
//# sourceMappingURL=auth.api.d.ts.map