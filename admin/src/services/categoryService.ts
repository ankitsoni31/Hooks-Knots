import api from './api';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export async function fetchCategories() {
    const res = await api.get('/admin/categories');
    return res.data.data as Category[];
}

export async function createCategory(data: Partial<Category>) {
    const res = await api.post('/admin/categories', data);
    return res.data.data as Category;
}

export async function updateCategory(id: number, data: Partial<Category>) {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data.data as Category;
}

export async function deleteCategory(id: number) {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data.data;
}
