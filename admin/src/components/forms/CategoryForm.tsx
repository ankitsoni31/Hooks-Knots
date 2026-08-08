import { useState, useEffect } from 'react';
import { type Category, createCategory, updateCategory } from '../../services/categoryService';

interface Props {
    category?: Category | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || '');
            setStatus(category.status);
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (category) {
                await updateCategory(category.id, { name, description, status });
            } else {
                await createCategory({ name, description, status });
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{category ? 'Edit Category' : 'Add Category'}</h2>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
