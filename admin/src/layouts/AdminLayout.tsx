import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Orders', path: '/orders' },
    { label: 'Customers', path: '/customers' },
    { label: 'Payments', path: '/payments' },
    { label: 'Settings', path: '/settings' },
];

interface Props {
    children: React.ReactNode;
}

function AdminLayout({ children }: Props) {
    const [sidebarOpen] = useState(true);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } finally {
            navigate('/login', { replace: true });
            window.location.reload();
        }
    }

    return (
        <div style={{ display: 'grid', gridTemplateRows: '64px 1fr', minHeight: '100vh' }}>
            <header style={{ background: '#1f2937', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <strong>Hooks & Knots Admin</strong>
                </div>
                <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                    Logout
                </button>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? '240px 1fr' : '1fr', gap: '1px', background: '#e5e7eb' }}>
                <aside style={{ background: '#111827', color: '#f9fafb', padding: '24px' }}>
                    <div style={{ marginBottom: '24px', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9ca3af' }}>
                        Navigation
                    </div>
                    <nav style={{ display: 'grid', gap: '12px' }}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'block',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    color: isActive ? '#111827' : '#f9fafb',
                                    background: isActive ? '#f2f4f7' : 'transparent',
                                    textDecoration: 'none',
                                })}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main style={{ padding: '24px', background: '#fff' }}>{children}</main>
            </div>
        </div>
    );
}

export default AdminLayout;
