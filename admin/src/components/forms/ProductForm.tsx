import { useState, useEffect } from 'react';
import { type Product, createProduct, updateProduct } from '../../services/productService';
import { type Category, fetchCategories } from '../../services/categoryService';

interface Props {
    product?: Product | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [stock, setStock] = useState('0');
    const [sku, setSku] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [featured, setFeatured] = useState(false);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => {});
        
        if (product) {
            setName(product.name);
            setCategoryId(product.category_id.toString());
            setDescription(product.description || '');
            setPrice(product.price.toString());
            setDiscountPrice(product.discount_price ? product.discount_price.toString() : '');
            setStock(product.stock.toString());
            setSku(product.sku || '');
            setStatus(product.status);
            setFeatured(product.featured);
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            name,
            category_id: parseInt(categoryId),
            description: description || undefined,
            price: parseFloat(price),
            discount_price: discountPrice ? parseFloat(discountPrice) : null,
            stock: parseInt(stock),
            sku: sku || null,
            status,
            featured
        };

        try {
            if (product) {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{product ? 'Edit Product' : 'Add Product'}</h2>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '6px' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Category</label>
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Price (₹)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Discount Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                    
                    {(discountPrice && parseFloat(discountPrice) > 0) ? (
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '-8px' }}>
                            Selling price will be: <strong style={{ color: '#16a34a' }}>₹{parseFloat(discountPrice).toFixed(2)}</strong> (Original: <del>₹{(parseFloat(price) || 0).toFixed(2)}</del>)
                        </div>
                    ) : null}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Stock</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>SKU</label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
                                <input 
                                    type="checkbox" 
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                                />
                                Featured Product
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
