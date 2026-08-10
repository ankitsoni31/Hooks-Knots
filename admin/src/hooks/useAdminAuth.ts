import { useEffect, useState } from 'react';
import { getCurrentAdmin } from '../services/authService';
import type { Admin } from '../types/api';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    admin: Admin | null;
    mutate: () => Promise<void>;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    admin: null,
    mutate: async () => {},
};

export function useAdminAuth() {
    const [state, setState] = useState<AuthState>(initialState);

    const loadAdmin = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setState(s => ({ ...s, isAuthenticated: false, isLoading: false, admin: null }));
            return;
        }
        try {
            const admin = await getCurrentAdmin();
            setState(s => ({ ...s, isAuthenticated: true, isLoading: false, admin }));
        } catch {
            localStorage.removeItem('admin_token');
            setState(s => ({ ...s, isAuthenticated: false, isLoading: false, admin: null }));
        }
    };

    useEffect(() => {
        loadAdmin();
    }, []);

    return { ...state, mutate: loadAdmin };
}
