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
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '0 16px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{category ? 'Edit Category' : 'Add Category'}</h2>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="form-input"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" onClick={onClose} disabled={loading} className="btn btn-outline">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
