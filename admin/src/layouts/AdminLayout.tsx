import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Products', path: '/products', icon: '📦' },
    { label: 'Categories', path: '/categories', icon: '📁' },
    { label: 'Orders', path: '/orders', icon: '🛒' },
    { label: 'Customers', path: '/customers', icon: '👥' },
    { label: 'Payments', path: '/payments', icon: '💳' },
];

interface Props {
    children: React.ReactNode;
}

function AdminLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { admin, mutate } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (admin?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (admin?.theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [admin?.theme]);

    async function handleLogout() {
        try {
            await logout();
        } finally {
            navigate('/login', { replace: true });
            window.location.reload();
        }
    }

    const pageTitle = navItems.find(i => location.pathname.startsWith(i.path))?.label || (location.pathname === '/settings' ? 'Settings' : 'Admin Panel');

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-root)' }}>
            {/* Sidebar */}
            <aside style={{ 
                width: sidebarOpen ? '260px' : '80px', 
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-sidebar)',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 40
            }}>
                <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border-sidebar)', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>H</div>
                    {sidebarOpen && <span style={{ color: '#fff', fontWeight: '600', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>Hooks & Knots</span>}
                </div>
                
                <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? '500' : '400',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            })}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-sidebar)' }}>
                        <NavLink
                            to="/settings"
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? '500' : '400',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            })}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                            {sidebarOpen && <span>Settings</span>}
                        </NavLink>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Navbar */}
                <header style={{ 
                    height: '64px', 
                    backgroundColor: 'var(--bg-surface)', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    zIndex: 30
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                            ☰
                        </button>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{pageTitle}</h1>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{admin?.first_name} {admin?.last_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Admin</div>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                                {admin?.first_name?.charAt(0) || 'A'}
                            </div>
                        </div>
                        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
