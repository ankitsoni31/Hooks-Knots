import { useEffect, useState } from 'react';
import api from '../services/api';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

const USER_TOKEN_KEY = 'user_token';

export function setUserToken(token: string) {
    localStorage.setItem(USER_TOKEN_KEY, token);
}

export function clearUserToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
}

export function getUserToken(): string | null {
    return localStorage.getItem(USER_TOKEN_KEY);
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
    });

    useEffect(() => {
        async function loadUser() {
            const token = getUserToken();
            if (!token) {
                setState({ isAuthenticated: false, isLoading: false, user: null });
                return;
            }
            try {
                const res = await api.get('/auth/user/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setState({ isAuthenticated: true, isLoading: false, user: res.data.data.user });
            } catch (err) {
                clearUserToken();
                setState({ isAuthenticated: false, isLoading: false, user: null });
            }
        }

        loadUser();
    }, []);

    return state;
}
