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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {customer.addresses.map(addr => (
                            <div key={addr.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff', fontSize: 14 }}>
                                <div>{addr.line1}</div>
                                {addr.line2 && <div>{addr.line2}</div>}
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
                    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    {['Order #', 'Date', 'Total', 'Status', ''].map(h => (
                                        <th key={h} style={{ padding: '10px 16px', fontWeight: 600, color: '#4b5563', fontSize: 13 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customer.recent_orders.map(o => {
                                    const sc = STATUS_COLORS[o.status] || { bg: '#f3f4f6', color: '#374151' };
                                    return (
                                        <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '10px 16px', fontWeight: 600 }}>{o.order_number}</td>
                                            <td style={{ padding: '10px 16px', color: '#6b7280', fontSize: 13 }}>{new Date(o.placed_at).toLocaleDateString('en-IN')}</td>
                                            <td style={{ padding: '10px 16px', fontWeight: 600 }}>₹{Number(o.total).toFixed(2)}</td>
                                            <td style={{ padding: '10px 16px' }}>
                                                <span style={{ padding: '3px 8px', borderRadius: 9999, fontSize: 12, background: sc.bg, color: sc.color, fontWeight: 500 }}>{o.status}</span>
                                            </td>
                                            <td style={{ padding: '10px 16px' }}>
                                                <button onClick={() => navigate(`/orders/${o.id}`)} style={{ padding: '3px 10px', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>View</button>
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
