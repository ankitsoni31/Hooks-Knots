import { useState, useEffect } from 'react';
import { Coupon, fetchCoupons, deleteCoupon } from '../services/couponService';
import { CouponForm } from '../components/forms/CouponForm';
import { Edit2, Trash2 } from 'lucide-react';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const loadCoupons = async () => {
        try {
            setLoading(true);
            const data = await fetchCoupons();
            setCoupons(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleDelete = async (id: number, code: string) => {
        if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
        try {
            await deleteCoupon(id);
            loadCoupons();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete coupon');
        }
    };

    const openCreateForm = () => {
        setEditingCoupon(null);
        setIsFormOpen(true);
    };

    const openEditForm = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setIsFormOpen(true);
    };

    const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Coupons</h1>
                <button onClick={openCreateForm} className="btn btn-primary">
                    + Add Coupon
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search coupons by code..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ maxWidth: '300px' }}
                />
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredCoupons.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center' }} className="text-muted">No coupons found.</td></tr>
                        ) : (
                            filteredCoupons.map(coupon => (
                                <tr key={coupon.id}>
                                    <td className="font-semibold">{coupon.code}</td>
                                    <td>
                                        {coupon.discount_type === 'PERCENTAGE' 
                                            ? `${coupon.discount_value}%` 
                                            : `₹${coupon.discount_value}`}
                                    </td>
                                    <td className="text-muted">
                                        {coupon.used_count} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}
                                    </td>
                                    <td className="text-muted">
                                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td>
                                        <span className={`badge ${coupon.is_active ? 'badge-success' : 'badge-neutral'}`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => openEditForm(coupon)} style={{ color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(coupon.id, coupon.code)} style={{ color: 'var(--danger)', cursor: 'pointer' }} title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <CouponForm 
                    coupon={editingCoupon}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadCoupons();
                    }}
                />
            )}
        </div>
    );
}
