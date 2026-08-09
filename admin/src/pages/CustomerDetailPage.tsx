import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCustomer, type CustomerDetail } from '../services/customerService';
import { STATUS_COLORS } from '../services/orderService';
import { ArrowLeft } from 'lucide-react';

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchCustomer(parseInt(id))
            .then(setCustomer)
            .catch(() => setError('Customer not found'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
    if (error || !customer) return <div style={{ padding: 24, color: '#ef4444' }}>{error || 'Customer not found'}</div>;

    return (
        <div>
            <button onClick={() => navigate('/customers')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: 24, padding: 0 }}>
                <ArrowLeft size={18} /> Back to Customers
            </button>

            <h1 style={{ margin: '0 0 24px', fontSize: 24 }}>{customer.first_name} {customer.last_name}</h1>

            {/* Customer Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#374151' }}>Contact Information</h3>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
                        <div><span style={{ color: '#6b7280' }}>Email:</span> <strong>{customer.email}</strong></div>
                        <div><span style={{ color: '#6b7280' }}>Phone:</span> <strong>{customer.phone || '—'}</strong></div>
                        <div><span style={{ color: '#6b7280' }}>Joined:</span> <strong>{new Date(customer.created_at).toLocaleDateString('en-IN')}</strong></div>
                    </div>
                </div>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#374151' }}>Order Summary</h3>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
                        <div><span style={{ color: '#6b7280' }}>Total Orders:</span> <strong>{customer.order_count}</strong></div>
                        <div><span style={{ color: '#6b7280' }}>Total Spent:</span> <strong>₹{Number(customer.total_spent ?? 0).toFixed(2)}</strong></div>
                    </div>
                </div>
            </div>

            {/* Addresses */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Addresses</h2>
                {customer.addresses.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No addresses saved.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.addresses.map(addr => (
                            <div key={addr.id} className="card p-4 text-sm">
                                <div className="font-semibold mb-2">
                                    {addr.line1}
                                </div>
                                <div>{addr.line2}</div>
                                <div>{addr.city}, {addr.state} — {addr.postal_code}</div>
                                <div>{addr.country}</div>
                                {addr.phone && <div style={{ color: '#6b7280', marginTop: 4 }}>📞 {addr.phone}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order History */}
            <div>
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>Order History</h2>
                {customer.recent_orders.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>No orders yet.</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    {['Order #', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customer.recent_orders.map(o => {
                                    const sc = STATUS_COLORS[o.status] || { bg: 'var(--bg-root)', color: 'var(--text-secondary)' };
                                    return (
                                        <tr key={o.id}>
                                            <td className="font-semibold">{o.order_number}</td>
                                            <td className="text-muted" style={{ fontSize: 13 }}>{new Date(o.placed_at).toLocaleDateString('en-IN')}</td>
                                            <td className="font-semibold">₹{Number(o.total).toFixed(2)}</td>
                                            <td><span className="badge" style={{ background: sc.bg, color: sc.color }}>{o.status}</span></td>
                                            <td>
                                                <button onClick={() => navigate(`/orders/${o.id}`)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 13 }}>View</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
