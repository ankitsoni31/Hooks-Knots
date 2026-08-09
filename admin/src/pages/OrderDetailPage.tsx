import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrder, updateOrderStatus, type Order, STATUS_TRANSITIONS, STATUS_COLORS } from '../services/orderService';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const load = () => {
        if (!id) return;
        setLoading(true);
        fetchOrder(parseInt(id))
            .then(setOrder)
            .catch(() => setError('Order not found'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);
        setStatusMsg('');
        try {
            await updateOrderStatus(order.id, newStatus);
            setStatusMsg('Status updated successfully');
            load();
        } catch (err: any) {
            setStatusMsg(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
    if (error || !order) return <div style={{ padding: 24, color: 'var(--danger)' }}>{error || 'Order not found'}</div>;

    const sc = STATUS_COLORS[order.status] || { bg: 'var(--bg-root)', color: 'var(--text-secondary)' };
    const nextStatuses = STATUS_TRANSITIONS[order.status] || [];

    return (
        <div>
            <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginBottom: 24, padding: 0 }}>
                <ArrowLeft size={18} /> Back to Orders
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22 }}>Order {order.order_number}</h1>
                    <div style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>Placed on {new Date(order.placed_at).toLocaleString('en-IN')}</div>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: 9999, background: sc.bg, color: sc.color, fontWeight: 600, fontSize: 14 }}>{order.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Customer */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Customer</h3>
                    <div className="grid gap-2 text-sm">
                        <div className="font-semibold">{order.first_name} {order.last_name}</div>
                        <div className="text-muted">{order.email}</div>
                        <div className="text-muted">{order.customer_phone || '—'}</div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                    {order.shipping_address ? (
                        <div style={{ fontSize: 14, display: 'grid', gap: 4 }}>
                            <div><strong>{order.shipping_name}</strong></div>
                            {order.shipping_phone && <div style={{ color: '#6b7280' }}>📞 {order.shipping_phone}</div>}
                            <div>{order.shipping_address}</div>
                            <div>{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</div>
                            <div>{order.shipping_country}</div>
                        </div>
                    ) : (
                        <div style={{ color: '#9ca3af', fontSize: 14 }}>No address snapshot</div>
                    )}
                </div>
            </div>

            {/* Payment Details */}
            {order.payment && (
                <div className="card mb-6">
                    <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14 }}>
                        <div><span style={{ color: '#6b7280', display: 'block', marginBottom: 4 }}>Status</span>
                            <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: order.payment.payment_status === 'SUCCESS' ? '#dcfce7' : order.payment.payment_status === 'FAILED' ? '#fee2e2' : '#f3f4f6', color: order.payment.payment_status === 'SUCCESS' ? '#166534' : order.payment.payment_status === 'FAILED' ? '#991b1b' : '#374151' }}>
                                {order.payment.payment_status}
                            </span>
                        </div>
                        {order.payment.razorpay_payment_id && (
                            <div><span style={{ color: '#6b7280', display: 'block', marginBottom: 4 }}>Payment ID</span><strong>{order.payment.razorpay_payment_id}</strong></div>
                        )}
                        {order.payment.payment_method && (
                            <div><span style={{ color: '#6b7280', display: 'block', marginBottom: 4 }}>Method</span><strong>{order.payment.payment_method.toUpperCase()}</strong></div>
                        )}
                        <div><span style={{ color: '#6b7280', display: 'block', marginBottom: 4 }}>Amount</span><strong>₹{Number(order.payment.amount).toFixed(2)}</strong></div>
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Items</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                {['Product', 'SKU', 'Unit Price', 'Qty', 'Subtotal'].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', fontWeight: 600, color: '#4b5563', fontSize: 13 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{item.product_name}</td>
                                    <td style={{ padding: '10px 16px', color: '#6b7280', fontSize: 13 }}>{item.product_sku || '—'}</td>
                                    <td style={{ padding: '10px 16px' }}>₹{Number(item.unit_price).toFixed(2)}</td>
                                    <td style={{ padding: '10px 16px' }}>×{item.quantity}</td>
                                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>₹{Number(item.total_price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals + Status Update */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Summary */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Discount</span><span>— ₹{Number(order.discount).toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Shipping</span><span>₹{Number(order.shipping).toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d1d5db', paddingTop: 10, fontWeight: 700, fontSize: 16 }}>
                            <span>Total</span><span>₹{Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Status Update */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                    {nextStatuses.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: 14 }}>No further transitions available for <strong>{order.status}</strong>.</p>
                    ) : (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {nextStatuses.map(s => {
                                const c = STATUS_COLORS[s] || { bg: '#e5e7eb', color: '#374151' };
                                return (
                                    <button
                                        key={s}
                                        disabled={updating}
                                        onClick={() => handleStatusChange(s)}
                                        style={{ padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, background: c.bg, color: c.color }}
                                    >
                                        → {s}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {statusMsg && <div style={{ marginTop: 12, fontSize: 13, color: statusMsg.includes('success') ? '#16a34a' : '#dc2626' }}>{statusMsg}</div>}
                </div>
            </div>
        </div>
    );
}
