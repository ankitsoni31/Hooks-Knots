import api from './api';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    product_sku: string | null;
    unit_price: number;
    quantity: number;
    total_price: number;
}

export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    placed_at: string;
    first_name: string;
    last_name: string;
    email: string;
    customer_phone: string | null;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_pincode?: string;
    shipping_country?: string;
    items?: OrderItem[];
    payment?: any; // Added for Phase 7
}

export interface OrderListResponse {
    items: Order[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchOrders(params: Record<string, any>) {
    const res = await api.get('/admin/orders', { params });
    return res.data.data as OrderListResponse;
}

export async function fetchOrder(id: number) {
    const res = await api.get(`/admin/orders/${id}`);
    return res.data.data as Order;
}

export async function updateOrderStatus(id: number, status: string) {
    const res = await api.put(`/admin/orders/${id}/status`, { status });
    return res.data.data;
}

export const STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING:    ['CONFIRMED', 'CANCELLED'],
    CONFIRMED:  ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED'],
    SHIPPED:    ['DELIVERED'],
    DELIVERED:  [],
    CANCELLED:  [],
};

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    PENDING:    { bg: '#fef9c3', color: '#854d0e' },
    CONFIRMED:  { bg: '#dbeafe', color: '#1e40af' },
    PROCESSING: { bg: '#f3e8ff', color: '#6b21a8' },
    SHIPPED:    { bg: '#d1fae5', color: '#065f46' },
    DELIVERED:  { bg: '#dcfce7', color: '#166534' },
    CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
};
