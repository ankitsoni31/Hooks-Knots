import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, type Order, STATUS_COLORS } from '../services/orderService';
import { ShoppingBag } from 'lucide-react';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const load = async () => {
        try {
            setLoading(true);
            const data = await fetchOrders({ page, limit: 20, search: searchTerm || undefined, status: statusFilter || undefined });
            setOrders(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [page, searchTerm, statusFilter]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24 }}>Orders</h1>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by order #, name, email..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', width: 280, borderRadius: 6, border: '1px solid #d1d5db' }}
                />
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 750 }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            {['Order #', 'Customer', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: '#4b5563' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center' }}>Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                                    <ShoppingBag size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No orders found.
                                </td>
                            </tr>
                        ) : orders.map(o => {
                            const sc = STATUS_COLORS[o.status] || { bg: '#f3f4f6', color: '#374151' };
                            return (
                                <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.order_number}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontWeight: 500 }}>{o.first_name} {o.last_name}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>{o.email}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>{new Date(o.placed_at).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{Number(o.total).toFixed(2)}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 12, background: sc.bg, color: sc.color, fontWeight: 500 }}>{o.status}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button onClick={() => navigate(`/orders/${o.id}`)} style={{ padding: '4px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                    <span style={{ padding: '6px 12px', background: '#f3f4f6', borderRadius: 4, border: '1px solid #e5e7eb' }}>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                </div>
            )}
        </div>
    );
}
