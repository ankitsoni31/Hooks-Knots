import { useState, useEffect } from 'react';
import { Coupon, createCoupon, updateCoupon } from '../../services/couponService';
import { X } from 'lucide-react';

interface Props {
    coupon: Coupon | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function CouponForm({ coupon, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'PERCENTAGE',
        discount_value: '',
        min_order_amount: '',
        max_discount_amount: '',
        usage_limit: '',
        expires_at: '',
        is_active: true
    });

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: String(coupon.discount_value),
                min_order_amount: coupon.min_order_amount ? String(coupon.min_order_amount) : '',
                max_discount_amount: coupon.max_discount_amount ? String(coupon.max_discount_amount) : '',
                usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : '',
                expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
                is_active: Boolean(coupon.is_active)
            });
        }
    }, [coupon]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload: any = {
            ...formData,
            discount_value: Number(formData.discount_value),
            min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
            max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
            usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
            expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
        };

        try {
            if (coupon) {
                await updateCoupon(coupon.id, payload);
            } else {
                await createCoupon(payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold m-0">{coupon ? 'Edit' : 'Create'} Coupon</h2>
                    <button onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Code *</label>
                        <input
                            required
                            type="text"
                            className="form-input"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g. SUMMER10"
                        />
                    </div>

                    <div>
                        <label className="form-label">Discount Type *</label>
                        <select
                            className="form-input"
                            value={formData.discount_type}
                            onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount (₹)</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Discount Value *</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            value={formData.discount_value}
                            onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Min Order Amount (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            value={formData.min_order_amount}
                            onChange={e => setFormData({ ...formData, min_order_amount: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Max Discount (Optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            value={formData.max_discount_amount}
                            onChange={e => setFormData({ ...formData, max_discount_amount: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Usage Limit (Optional)</label>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={formData.usage_limit}
                            onChange={e => setFormData({ ...formData, usage_limit: e.target.value })}
                            placeholder="Total times it can be used"
                        />
                    </div>

                    <div>
                        <label className="form-label">Expires At (Optional)</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={formData.expires_at}
                            onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="is_active" style={{ cursor: 'pointer', fontWeight: 500 }}>Active</label>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ background: '#f1f5f9', color: '#475569' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Saving...' : 'Save Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
