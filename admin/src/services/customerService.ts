import api from './api';

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    created_at: string;
    order_count?: number;
    total_spent?: number;
}

export interface CustomerDetail extends Customer {
    addresses: Address[];
    recent_orders: RecentOrder[];
}

export interface Address {
    id: number;
    customer_id: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
    is_default: boolean;
}

export interface RecentOrder {
    id: number;
    order_number: string;
    status: string;
    total: number;
    placed_at: string;
}

export interface CustomerListResponse {
    items: Customer[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchCustomers(params: Record<string, any>) {
    const res = await api.get('/admin/customers', { params });
    return res.data.data as CustomerListResponse;
}

export async function fetchCustomer(id: number) {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data.data as CustomerDetail;
}

export async function fetchCustomerAddresses(customerId: number) {
    const res = await api.get(`/admin/customers/${customerId}/addresses`);
    return res.data.data as Address[];
}
