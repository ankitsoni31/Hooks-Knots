import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import type { LoginRequest } from '../types/api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload: LoginRequest = { email, password };
            await login(payload);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f3f4f6' }}>
            <div style={{ maxWidth: '420px', width: '100%', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', padding: '32px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem' }}>Hooks & Knots</p>
                    <h1 style={{ margin: '12px 0 0', fontSize: '1.75rem', color: '#111827' }}>Admin Login</h1>
                    <p style={{ marginTop: '12px', color: '#4b5563' }}>Sign in to access the private admin dashboard.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '16px' }}
                        required
                    />

                    <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>Password</label>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d1d5db' }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            style={{ position: 'absolute', top: 0, bottom: 0, right: '12px', border: 'none', background: 'transparent', color: '#4b5563', cursor: 'pointer' }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {error && <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: 'none', background: '#111827', color: '#fff', cursor: loading ? 'default' : 'pointer' }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
