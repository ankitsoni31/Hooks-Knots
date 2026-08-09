import api from './api';

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    stock: number;
    sku: string | null;
    status: 'active' | 'inactive';
    featured: boolean;
    created_at: string;
    updated_at: string;
    category_name?: string;
}

export interface ProductResponse {
    items: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function fetchProducts(params: Record<string, any>) {
    const res = await api.get('/admin/products', { params });
    return res.data.data as ProductResponse;
}

export async function createProduct(data: Partial<Product>) {
    const res = await api.post('/admin/products', data);
    return res.data.data as Product;
}

export async function updateProduct(id: number, data: Partial<Product>) {
    const res = await api.put(`/admin/products/${id}`, data);
    return res.data.data as Product;
}

export async function deleteProduct(id: number) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data.data;
}

export interface ProductImage {
    id: number;
    product_id: number;
    file_path: string;
    alt_text: string | null;
    is_primary: boolean;
    display_order: number;
}

export async function fetchProductImages(productId: number) {
    const res = await api.get(`/admin/products/${productId}/images`);
    return res.data.data as ProductImage[];
}

export async function uploadProductImages(productId: number, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });
    const res = await api.post(`/admin/products/${productId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data.data as ProductImage[];
}

export async function setPrimaryImage(productId: number, imageId: number) {
    const res = await api.post(`/admin/products/${productId}/images/${imageId}/primary`);
    return res.data.data;
}

export async function reorderImages(productId: number, images: { id: number; sort_order: number }[]) {
    const res = await api.put(`/admin/products/${productId}/images/reorder`, { images });
    return res.data.data;
}

export async function deleteProductImage(productId: number, imageId: number) {
    const res = await api.delete(`/admin/products/${productId}/images/${imageId}`);
    return res.data.data;
}
