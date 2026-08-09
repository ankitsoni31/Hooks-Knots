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
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Welcome back</h2>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>Here is what's happening with your store today.</p>
                </div>
            </div>

            {loading && <p className="text-muted mb-4">Loading stats...</p>}

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}>
                {cards.map((item) => (
                    <div key={item.label} className="card">
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</p>
                        <p style={{ margin: '12px 0 0', fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 700 }}>{item.value}</p>
                    </div>
                ))}
            </div>

            <section className="card">
                <h3 className="font-semibold text-lg" style={{ margin: 0, color: 'var(--text-primary)' }}>Quick Actions</h3>
                <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.875rem' }}>Manage your store easily from here.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <a href="/orders" className="btn btn-primary">View Recent Orders</a>
                    <a href="/products" className="btn btn-outline">Manage Products</a>
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
