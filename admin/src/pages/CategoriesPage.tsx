import { useState, useEffect } from 'react';
import { Category, fetchCategories, deleteCategory } from '../services/categoryService';
import { CategoryForm } from '../components/forms/CategoryForm';
import { Edit2, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const openCreateForm = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const openEditForm = (cat: Category) => {
        setEditingCategory(cat);
        setIsFormOpen(true);
    };

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Categories</h1>
                <button 
                    onClick={openCreateForm}
                    style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Add Category
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

            <div style={{ marginBottom: '16px' }}>
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 12px', width: '300px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Name</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Slug</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No categories found.</td></tr>
                        ) : (
                            filteredCategories.map(cat => (
                                <tr key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{cat.name}</td>
                                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{cat.slug}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '9999px', 
                                            fontSize: '12px',
                                            background: cat.status === 'active' ? '#dcfce7' : '#f3f4f6',
                                            color: cat.status === 'active' ? '#166534' : '#374151',
                                            fontWeight: '500'
                                        }}>
                                            {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => openEditForm(cat)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id, cat.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
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
                <CategoryForm 
                    category={editingCategory}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadCategories();
                    }}
                />
            )}
        </div>
    );
}
