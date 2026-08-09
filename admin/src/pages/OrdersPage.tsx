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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Orders</h1>
            </div>

            <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by order #, name, email..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '280px' }}
                />
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="table-container">
                <table className="table" style={{ minWidth: 750 }}>
                    <thead>
                        <tr>
                            {['Order #', 'Customer', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }} className="text-muted">
                                    <ShoppingBag size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No orders found.
                                </td>
                            </tr>
                        ) : orders.map(o => {
                            const sc = STATUS_COLORS[o.status] || { bg: 'var(--bg-root)', color: 'var(--text-secondary)' };
                            return (
                                <tr key={o.id}>
                                    <td className="font-semibold">{o.order_number}</td>
                                    <td>
                                        <div className="font-semibold">{o.first_name} {o.last_name}</div>
                                        <div className="text-muted" style={{ fontSize: 12 }}>{o.email}</div>
                                    </td>
                                    <td className="text-muted" style={{ fontSize: 13 }}>{new Date(o.placed_at).toLocaleDateString('en-IN')}</td>
                                    <td className="font-semibold">₹{Number(o.total).toFixed(2)}</td>
                                    <td>
                                        <span className="badge" style={{ background: sc.bg, color: sc.color }}>{o.status}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => navigate(`/orders/${o.id}`)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 13 }}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline" style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                    <span className="badge badge-neutral" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline" style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                </div>
            )}
        </div>
    );
}
