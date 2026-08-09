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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold m-0">Products</h1>
                <button onClick={openCreateForm} className="btn btn-primary">
                    + Add Product
                </button>
            </div>

            <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '250px' }}
                />
                <select 
                    value={categoryId} 
                    onChange={e => { setCategoryId(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select 
                    value={status} 
                    onChange={e => { setStatus(e.target.value); setPage(1); }}
                    className="form-input"
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="table-container">
                <table className="table" style={{ minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Image</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center' }} className="text-muted">No products found.</td></tr>
                        ) : (
                            products.map(prod => (
                                <tr key={prod.id}>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-root)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '10px' }}>
                                            No Img
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold flex items-center gap-2">
                                            {prod.name}
                                            {prod.featured && <Star size={14} color="#f59e0b" fill="#f59e0b" />}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>{prod.sku || 'No SKU'}</div>
                                    </td>
                                    <td>{prod.category_name}</td>
                                    <td>
                                        {prod.discount_price ? (
                                            <div>
                                                <span className="font-semibold">₹{prod.discount_price}</span>
                                                <br />
                                                <del className="text-muted" style={{ fontSize: '12px' }}>₹{prod.price}</del>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">₹{prod.price}</span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: '14px' }}>
                                        {getStockBadge(prod.stock)}
                                    </td>
                                    <td>
                                        <span className={`badge ${prod.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                                            {prod.status.charAt(0).toUpperCase() + prod.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => openImageModal(prod)} style={{ color: '#8b5cf6', cursor: 'pointer', marginRight: '12px' }} title="Manage Images">
                                            <ImageIcon size={18} />
                                        </button>
                                        <button onClick={() => openEditForm(prod)} style={{ color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleArchive(prod.id, prod.name)} style={{ color: 'var(--danger)', cursor: 'pointer' }} title="Archive/Delete">
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
                <div className="flex justify-center gap-2 mt-4">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="btn btn-outline"
                        style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Previous
                    </button>
                    <span className="badge badge-neutral" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="btn btn-outline"
                        style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
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
