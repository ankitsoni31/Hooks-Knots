import api from './api';
import type { LoginRequest, ApiResponse, LoginResponse, Admin } from '../types/api';

export async function login(payload: LoginRequest) {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    return response.data.data.admin;
}

export async function logout() {
    await api.post<ApiResponse>('/auth/logout');
}

export async function getCurrentAdmin() {
    const response = await api.get<ApiResponse<{ admin: Admin }>>('/auth/me');
    return response.data.data.admin;
}
