import { useState, useEffect, useRef } from 'react';
import { 
    type Product, 
    type ProductImage,
    fetchProductImages,
    uploadProductImages,
    setPrimaryImage,
    reorderImages,
    deleteProductImage
} from '../../services/productService';
import { Upload, X, Star, ArrowLeft, ArrowRight, Trash2, Image as ImageIcon } from 'lucide-react';

interface Props {
    product: Product;
    onClose: () => void;
}

export function ProductImagesModal({ product, onClose }: Props) {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    
    // File upload state
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadImages = async () => {
        try {
            setLoading(true);
            const data = await fetchProductImages(product.id);
            setImages(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [product.id]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Optional: validate client side size/type here
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        
        setUploading(true);
        setError('');
        
        try {
            await uploadProductImages(product.id, selectedFiles);
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
            await loadImages();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleSetPrimary = async (imageId: number) => {
        try {
            await setPrimaryImage(product.id, imageId);
            await loadImages();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to set primary image');
        }
    };

    const handleMove = async (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === images.length - 1) return;

        const newImages = [...images];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        // Swap
        const temp = newImages[index];
        newImages[index] = newImages[targetIndex];
        newImages[targetIndex] = temp;

        // Optimistic update
        setImages(newImages);

        try {
            const updates = newImages.map((img, i) => ({ id: img.id, sort_order: i + 1 }));
            await reorderImages(product.id, updates);
            // Optionally reload to ensure sync
        } catch (err: any) {
            alert('Failed to reorder');
            await loadImages();
        }
    };

    const handleDelete = async (imageId: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await deleteProductImage(product.id, imageId);
            await loadImages();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete image');
        }
    };

    const API_BASE = (import.meta as any).env.VITE_API_URL ? (import.meta as any).env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

    return (
        <div className="modal-backdrop">
            <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0 }}>Images for: {product.name}</h2>
                    <button type="button" onClick={onClose} className="btn btn-ghost">
                        <X size={24} />
                    </button>
                </div>
                
                {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '12px' }}>
                    
                    {/* Upload Section */}
                    <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '24px', background: 'var(--bg-subtle)' }}>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/jpeg,image/png,image/webp"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Upload size={18} /> Select Images
                        </label>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>JPG, PNG or WEBP. Max 5MB per file.</div>

                        {selectedFiles.length > 0 && (
                            <div style={{ marginTop: '16px', textAlign: 'left' }}>
                                <strong>Selected ({selectedFiles.length}):</strong>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                                    {selectedFiles.map((f, i) => (
                                        <li key={i}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                                    ))}
                                </ul>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <button 
                                        type="button"
                                        onClick={handleUpload} 
                                        disabled={uploading}
                                        className="btn btn-primary"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Selected'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setSelectedFiles([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        disabled={uploading}
                                        className="btn btn-outline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Images List */}
                    <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Current Images</h3>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading images...</div>
                    ) : images.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            <ImageIcon size={48} style={{ margin: '0 auto 12px' }} />
                            <div>No product images yet.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {images.map((img, index) => (
                                <div key={img.id} className="card" style={{ border: `2px solid ${img.is_primary ? 'var(--primary)' : 'var(--border)'}`, padding: 0, position: 'relative' }}>
                                    {img.is_primary && (
                                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--primary)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                                            <Star size={14} fill="currentColor" /> Primary
                                        </div>
                                    )}
                                    <div style={{ height: '150px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img 
                                            src={`${API_BASE}${img.file_path}`} 
                                            alt={img.alt_text || 'Product Image'} 
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            {!img.is_primary && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleSetPrimary(img.id)}
                                                    className="btn btn-outline"
                                                    style={{ flex: 1, padding: '4px', fontSize: '12px' }}
                                                >
                                                    Set Primary
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button 
                                                    type="button"
                                                    disabled={index === 0}
                                                    onClick={() => handleReorder(img.id, 'up')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}
                                                    title="Move Left"
                                                >
                                                    <ArrowLeft size={16} />
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={index === images.length - 1}
                                                    onClick={() => handleReorder(img.id, 'down')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '4px', cursor: index === images.length - 1 ? 'not-allowed' : 'pointer', opacity: index === images.length - 1 ? 0.5 : 1 }}
                                                    title="Move Right"
                                                >
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleDelete(img.id)}
                                                style={{ padding: '4px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
