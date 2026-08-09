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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Customers</h1>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '320px' }}
                />
            </div>

            <div className="table-container">
                <table className="table" style={{ minWidth: 700 }}>
                    <thead>
                        <tr>
                            {['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Action'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }} className="text-muted">
                                    <Users size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
                                    No customers yet.
                                </td>
                            </tr>
                        ) : customers.map(c => (
                            <tr key={c.id}>
                                <td className="font-semibold">{c.first_name} {c.last_name}</td>
                                <td className="text-muted">{c.email}</td>
                                <td className="text-muted">{c.phone || '—'}</td>
                                <td>{c.order_count ?? 0}</td>
                                <td className="font-semibold">₹{Number(c.total_spent ?? 0).toFixed(2)}</td>
                                <td className="text-muted" style={{ fontSize: 13 }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <button onClick={() => navigate(`/customers/${c.id}`)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 13 }}>View</button>
                                </td>
                            </tr>
                        ))}
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
