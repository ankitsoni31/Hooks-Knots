import api from './api';

export interface Payment {
    id: number;
    order_id: number;
    customer_id: number;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    payment_method: string | null;
    amount: number;
    currency: string;
    payment_status: string;
    paid_at: string | null;
    created_at: string;
    
    // joined fields
    order_number: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface PaymentListResponse {
    items: Payment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchPayments(params: Record<string, any>) {
    const res = await api.get('/admin/payments', { params });
    return res.data.data as PaymentListResponse;
}

export async function fetchPayment(id: number) {
    const res = await api.get(`/admin/payments/${id}`);
    return res.data.data as Payment;
}
