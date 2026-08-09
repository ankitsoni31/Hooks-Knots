import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPayments, type Payment } from '../services/paymentService';
import { CreditCard } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    CREATED:  { bg: 'var(--bg-root)', color: 'var(--text-secondary)' },
    PENDING:  { bg: '#fef9c3', color: '#854d0e' },
    SUCCESS:  { bg: '#dcfce7', color: '#166534' },
    FAILED:   { bg: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' },
    REFUNDED: { bg: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)' },
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Payments</h1>
            </div>

            <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search order #, payment ID, customer..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '320px' }}
                />
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="CREATED">CREATED</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                </select>
            </div>

            <div className="table-container">
                <table className="table" style={{ minWidth: 800 }}>
                    <thead>
                        <tr>
                            {['Payment ID', 'Order', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }} className="text-muted">
                                    <CreditCard size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No payments found.
                                </td>
                            </tr>
                        ) : payments.map(p => {
                            const sc = STATUS_COLORS[p.payment_status] || { bg: 'var(--bg-root)', color: 'var(--text-secondary)' };
                            return (
                                <tr key={p.id}>
                                    <td style={{ fontSize: 13, fontFamily: 'monospace' }}>
                                        {p.razorpay_payment_id || <span className="text-muted">Pending...</span>}
                                    </td>
                                    <td>
                                        <button onClick={() => navigate(`/orders/${p.order_id}`)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, padding: 0 }}>
                                            {p.order_number}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{p.first_name} {p.last_name}</div>
                                    </td>
                                    <td className="font-semibold">₹{Number(p.amount).toFixed(2)}</td>
                                    <td className="text-muted">
                                        {p.payment_method ? p.payment_method.toUpperCase() : '—'}
                                    </td>
                                    <td>
                                        <span className="badge" style={{ background: sc.bg, color: sc.color }}>{p.payment_status}</span>
                                    </td>
                                    <td className="text-muted" style={{ fontSize: 13 }}>
                                        {new Date(p.created_at).toLocaleString('en-IN')}
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
