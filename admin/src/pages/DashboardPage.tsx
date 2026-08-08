import { useState, useEffect } from 'react';
import api from '../services/api';

interface DashboardStats {
    total_products: number;
    active_products: number;
    total_customers: number;
    total_orders: number;
    pending_orders: number;
    successful_payments: number;
    total_revenue: number;
}

function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(res => setStats(res.data.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const cards = stats ? [
        { label: 'Total Products', value: stats.total_products },
        { label: 'Total Customers', value: stats.total_customers },
        { label: 'Total Orders', value: stats.total_orders },
        { label: 'Successful Payments', value: stats.successful_payments },
        { label: 'Total Revenue', value: `₹${Number(stats.total_revenue).toFixed(2)}` },
    ] : [
        { label: 'Total Products', value: '—' },
        { label: 'Total Customers', value: '—' },
        { label: 'Total Orders', value: '—' },
        { label: 'Successful Payments', value: '—' },
        { label: 'Total Revenue', value: '—' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Dashboard</p>
                <h2 style={{ margin: '8px 0 0', color: '#111827' }}>Welcome back</h2>
            </div>

            {loading && <p style={{ color: '#6b7280' }}>Loading stats...</p>}

            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '24px' }}>
                {cards.map((item) => (
                    <div key={item.label} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px' }}>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>{item.label}</p>
                        <p style={{ margin: '12px 0 0', fontSize: '1.75rem', color: '#111827', fontWeight: 700 }}>{item.value}</p>
                    </div>
                ))}
            </div>

            <section style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: 0, color: '#111827' }}>Recent Orders</h3>
                <p style={{ marginTop: '12px', color: '#6b7280' }}>Visit the <a href="/orders" style={{ color: '#2563eb' }}>Orders</a> page to manage all orders.</p>
            </section>
        </div>
    );
}

export default DashboardPage;
