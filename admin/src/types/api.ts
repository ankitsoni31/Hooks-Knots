export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface Admin {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    theme?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    admin: Admin;
}
