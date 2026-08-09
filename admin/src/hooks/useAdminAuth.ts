import { useEffect, useState } from 'react';
import { getCurrentAdmin } from '../services/authService';
import type { Admin } from '../types/api';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    admin: Admin | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    admin: null,
};

export function useAdminAuth() {
    const [state, setState] = useState<AuthState>(initialState);

    useEffect(() => {
        async function loadAdmin() {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setState({ isAuthenticated: false, isLoading: false, admin: null });
                return;
            }
            try {
                const admin = await getCurrentAdmin();
                setState({ isAuthenticated: true, isLoading: false, admin });
            } catch {
                localStorage.removeItem('admin_token');
                setState({ isAuthenticated: false, isLoading: false, admin: null });
            }
        }

        loadAdmin();
    }, []);

    return state;
}
