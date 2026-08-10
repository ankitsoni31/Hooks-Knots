import api from './api';

export interface Coupon {
    id: number;
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: string | number;
    min_order_amount: string | number | null;
    max_discount_amount: string | number | null;
    usage_limit: number | null;
    used_count: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export const fetchCoupons = async (): Promise<Coupon[]> => {
    const response = await api.get('/admin/coupons');
    return response.data.data;
};

export const createCoupon = async (data: Partial<Coupon>): Promise<Coupon> => {
    const response = await api.post('/admin/coupons', data);
    return response.data.data;
};

export const updateCoupon = async (id: number, data: Partial<Coupon>): Promise<void> => {
    await api.put(`/admin/coupons/${id}`, data);
};

export const deleteCoupon = async (id: number): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
};
