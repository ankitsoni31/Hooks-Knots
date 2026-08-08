import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPayments, type Payment } from '../services/paymentService';
import { CreditCard } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    CREATED:  { bg: '#f3f4f6', color: '#4b5563' },
    PENDING:  { bg: '#fef9c3', color: '#854d0e' },
    SUCCESS:  { bg: '#dcfce7', color: '#166534' },
    FAILED:   { bg: '#fee2e2', color: '#991b1b' },
    REFUNDED: { bg: '#e0e7ff', color: '#3730a3' },
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const load = async () => {
        try {
            setLoading(true);
            const data = await fetchPayments({ page, limit: 20, search: searchTerm || undefined, status: statusFilter || undefined });
            setPayments(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [page, searchTerm, statusFilter]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24 }}>Payments</h1>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search order #, payment ID, customer..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', width: 320, borderRadius: 6, border: '1px solid #d1d5db' }}
                />
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}
                >
                    <option value="">All Statuses</option>
                    <option value="CREATED">CREATED</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            {['Payment ID', 'Order', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: '#4b5563' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center' }}>Loading...</td></tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                                    <CreditCard size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No payments found.
                                </td>
                            </tr>
                        ) : payments.map(p => {
                            const sc = STATUS_COLORS[p.payment_status] || { bg: '#f3f4f6', color: '#374151' };
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace' }}>
                                        {p.razorpay_payment_id || <span style={{ color: '#9ca3af' }}>Pending...</span>}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button onClick={() => navigate(`/orders/${p.order_id}`)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 500, padding: 0 }}>
                                            {p.order_number}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontWeight: 500 }}>{p.first_name} {p.last_name}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{Number(p.amount).toFixed(2)}</td>
                                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                        {p.payment_method ? p.payment_method.toUpperCase() : '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 12, background: sc.bg, color: sc.color, fontWeight: 500 }}>{p.payment_status}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>
                                        {new Date(p.created_at).toLocaleString('en-IN')}
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
