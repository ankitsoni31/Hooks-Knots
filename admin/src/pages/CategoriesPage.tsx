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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Categories</h1>
                <button onClick={openCreateForm} className="btn btn-primary">
                    + Add Category
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search categories..." 
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
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center' }} className="text-muted">No categories found.</td></tr>
                        ) : (
                            filteredCategories.map(cat => (
                                <tr key={cat.id}>
                                    <td className="font-semibold">{cat.name}</td>
                                    <td className="text-muted">{cat.slug}</td>
                                    <td>
                                        <span className={`badge ${cat.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                                            {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => openEditForm(cat)} style={{ color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id, cat.name)} style={{ color: 'var(--danger)', cursor: 'pointer' }} title="Delete">
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
