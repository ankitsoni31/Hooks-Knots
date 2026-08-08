import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers, type Customer } from '../services/customerService';
import { Users } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const load = async () => {
        try {
            setLoading(true);
            const data = await fetchCustomers({ page, limit: 20, search: searchTerm || undefined });
            setCustomers(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [page, searchTerm]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24 }}>Customers</h1>
            </div>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', width: 320, borderRadius: 6, border: '1px solid #d1d5db' }}
                />
            </div>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            {['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Action'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: '#4b5563' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center' }}>Loading...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                                    <Users size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No customers yet.
                                </td>
                            </tr>
                        ) : customers.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.first_name} {c.last_name}</td>
                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.email}</td>
                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.phone || '—'}</td>
                                <td style={{ padding: '12px 16px' }}>{c.order_count ?? 0}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>₹{Number(c.total_spent ?? 0).toFixed(2)}</td>
                                <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13 }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <button onClick={() => navigate(`/customers/${c.id}`)} style={{ padding: '4px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>View</button>
                                </td>
                            </tr>
                        ))}
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
