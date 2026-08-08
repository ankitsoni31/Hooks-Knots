import { useState, useEffect } from 'react';
import { Product, fetchProducts, deleteProduct } from '../services/productService';
import { Category, fetchCategories } from '../services/categoryService';
import { ProductForm } from '../components/forms/ProductForm';
import { ProductImagesModal } from '../components/forms/ProductImagesModal';
import { Edit2, Archive, Star, Image as ImageIcon } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('');
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageProduct, setImageProduct] = useState<Product | null>(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await fetchProducts({
                page,
                limit: 10,
                search: searchTerm || undefined,
                category_id: categoryId || undefined,
                status: status || undefined
            });
            setProducts(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch (err: any) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => {});
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page, searchTerm, categoryId, status]);

    const handleArchive = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to archive/delete "${name}"?`)) return;
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const openCreateForm = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const openEditForm = (prod: Product) => {
        setEditingProduct(prod);
        setIsFormOpen(true);
    };

    const openImageModal = (prod: Product) => {
        setImageProduct(prod);
        setIsImageModalOpen(true);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) return <span style={{ color: '#dc2626', fontWeight: 600 }}>Out of Stock</span>;
        if (stock <= 5) return <span style={{ color: '#d97706', fontWeight: 600 }}>Low Stock ({stock})</span>;
        return <span style={{ color: '#16a34a' }}>In Stock ({stock})</span>;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Products</h1>
                <button 
                    onClick={openCreateForm}
                    style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Add Product
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', width: '250px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
                <select 
                    value={categoryId} 
                    onChange={e => { setCategoryId(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select 
                    value={status} 
                    onChange={e => { setStatus(e.target.value); setPage(1); }}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', width: '60px' }}>Image</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Product</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Category</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Price</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Stock</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563' }}>Status</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No products found.</td></tr>
                        ) : (
                            products.map(prod => (
                                <tr key={prod.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '10px' }}>
                                            No Img
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {prod.name}
                                            {prod.featured && <Star size={14} color="#f59e0b" fill="#f59e0b" />}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{prod.sku || 'No SKU'}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>{prod.category_name}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {prod.discount_price ? (
                                            <div>
                                                <span style={{ fontWeight: '600' }}>₹{prod.discount_price}</span>
                                                <br />
                                                <del style={{ fontSize: '12px', color: '#6b7280' }}>₹{prod.price}</del>
                                            </div>
                                        ) : (
                                            <span style={{ fontWeight: '600' }}>₹{prod.price}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                        {getStockBadge(prod.stock)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '9999px', 
                                            fontSize: '12px',
                                            background: prod.status === 'active' ? '#dcfce7' : '#f3f4f6',
                                            color: prod.status === 'active' ? '#166534' : '#374151',
                                            fontWeight: '500'
                                        }}>
                                            {prod.status.charAt(0).toUpperCase() + prod.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button onClick={() => openImageModal(prod)} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', marginRight: '12px' }} title="Manage Images">
                                            <ImageIcon size={18} />
                                        </button>
                                        <button onClick={() => openEditForm(prod)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleArchive(prod.id, prod.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Archive/Delete">
                                            <Archive size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '6px 12px', background: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            )}

            {isFormOpen && (
                <ProductForm 
                    product={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadProducts();
                    }}
                />
            )}

            {isImageModalOpen && imageProduct && (
                <ProductImagesModal 
                    product={imageProduct}
                    onClose={() => setIsImageModalOpen(false)}
                />
            )}
        </div>
    );
}
