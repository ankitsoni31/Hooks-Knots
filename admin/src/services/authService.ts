import api from './api';
import type { LoginRequest, ApiResponse, LoginResponse, Admin } from '../types/api';

export async function login(payload: LoginRequest) {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    if (response.data.data.token) {
        localStorage.setItem('admin_token', response.data.data.token);
    }
    return response.data.data.admin;
}

export async function logout() {
    try {
        await api.post<ApiResponse>('/auth/logout');
    } finally {
        localStorage.removeItem('admin_token');
    }
}

export async function getCurrentAdmin() {
    const response = await api.get<ApiResponse<{ admin: Admin }>>('/auth/me');
    return response.data.data.admin;
}
