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
            try {
                const admin = await getCurrentAdmin();
                setState({ isAuthenticated: true, isLoading: false, admin });
            } catch {
                setState({ isAuthenticated: false, isLoading: false, admin: null });
            }
        }

        loadAdmin();
    }, []);

    return state;
}
