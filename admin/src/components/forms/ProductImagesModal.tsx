import { useState, useEffect, useRef } from 'react';
import {
    type Product,
    type ProductImage,
    fetchProductImages,
    uploadProductImages,
    setPrimaryImage,
    reorderImages,
    deleteProductImage,
} from '../../services/productService';
import {
    Upload,
    X,
    Star,
    ArrowLeft,
    ArrowRight,
    Trash2,
    Image as ImageIcon,
} from 'lucide-react';

interface Props {
    product: Product;
    onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

export function ProductImagesModal({ product, onClose }: Props) {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Build API base URL.
     *
     * Example:
     * VITE_API_URL=http://localhost:5000/api
     * becomes:
     * http://localhost:5000
     */
    const API_BASE =
        (import.meta as any).env?.VITE_API_URL
            ? (import.meta as any).env.VITE_API_URL.replace(/\/api\/?$/, '')
            : 'http://localhost:5000';

    /**
     * Load all images for the current product.
     */
    const loadImages = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchProductImages(product.id);

            setImages(
                [...data].sort(
                    (a, b) => a.display_order - b.display_order
                )
            );
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to load product images'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [product.id]);

    /**
     * Handle file selection.
     *
     * Validates:
     * - JPG / PNG / WEBP
     * - Maximum 5 MB
     * - Avoid duplicate file selections
     */
    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        setError('');

        const validFiles: File[] = [];
        const errors: string[] = [];

        files.forEach((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(
                    `${file.name}: Only JPG, PNG or WEBP images are allowed.`
                );
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                errors.push(
                    `${file.name}: File size must be 5MB or less.`
                );
                return;
            }

            const alreadySelected = selectedFiles.some(
                (existingFile) =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );

            if (!alreadySelected) {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join(' '));
        }

        if (validFiles.length > 0) {
            setSelectedFiles((prev) => [...prev, ...validFiles]);
        }

        // Allow selecting the same file again after clearing.
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Remove one selected file before uploading.
     */
    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    /**
     * Clear all selected files.
     */
    const clearSelectedFiles = () => {
        setSelectedFiles([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Upload selected images.
     */
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Please select at least one image.');
            return;
        }

        setUploading(true);
        setError('');

        try {
            await uploadProductImages(
                product.id,
                selectedFiles
            );

            clearSelectedFiles();

            await loadImages();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to upload images'
            );
        } finally {
            setUploading(false);
        }
    };

    /**
     * Set an image as the primary product image.
     */
    const handleSetPrimary = async (imageId: number) => {
        setActionLoading(imageId);
        setError('');

        try {
            await setPrimaryImage(
                product.id,
                imageId
            );

            await loadImages();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to set primary image'
            );
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Reorder images.
     *
     * Moves an image left/right and persists
     * the new display order through the API.
     */
    const handleMove = async (
        index: number,
        direction: 'left' | 'right'
    ) => {
        if (
            direction === 'left' &&
            index === 0
        ) {
            return;
        }

        if (
            direction === 'right' &&
            index === images.length - 1
        ) {
            return;
        }

        const newImages = [...images];

        const targetIndex =
            direction === 'left'
                ? index - 1
                : index + 1;

        const temp = newImages[index];

        newImages[index] =
            newImages[targetIndex];

        newImages[targetIndex] = temp;

        // Optimistic UI update.
        setImages(newImages);

        try {
            const updates = newImages.map(
                (img, i) => ({
                    id: img.id,
                    sort_order: i + 1,
                })
            );

            await reorderImages(
                product.id,
                updates
            );

            await loadImages();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to reorder images'
            );

            // Restore server state.
            await loadImages();
        }
    };

    /**
     * Delete an image.
     */
    const handleDelete = async (
        imageId: number
    ) => {
        const image = images.find(
            (img) => img.id === imageId
        );

        const imageName =
            image?.alt_text || 'this image';

        if (
            !confirm(
                `Are you sure you want to delete ${imageName}?`
            )
        ) {
            return;
        }

        setActionLoading(imageId);
        setError('');

        try {
            await deleteProductImage(
                product.id,
                imageId
            );

            await loadImages();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to delete image'
            );
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Safely construct image URL.
     */
    const getImageUrl = (
        filePath: string
    ) => {
        if (!filePath) return '';

        if (
            filePath.startsWith('http://') ||
            filePath.startsWith('https://')
        ) {
            return filePath;
        }

        return `${API_BASE}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    };

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '20px',
                            }}
                        >
                            Product Images
                        </h2>

                        <div
                            style={{
                                marginTop: '4px',
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                            }}
                        >
                            {product.name}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost"
                        disabled={uploading}
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="alert alert-error"
                        style={{
                            marginBottom: '16px',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Scrollable content */}
                <div
                    style={{
                        overflowY: 'auto',
                        flex: 1,
                        paddingRight: '12px',
                    }}
                >
                    {/* Upload Section */}
                    <div
                        style={{
                            border: '2px dashed var(--border)',
                            borderRadius: '8px',
                            padding: '24px',
                            textAlign: 'center',
                            marginBottom: '24px',
                            background: 'var(--bg-subtle)',
                        }}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{
                                display: 'none',
                            }}
                            id="image-upload"
                            disabled={uploading}
                        />

                        <label
                            htmlFor="image-upload"
                            className="btn btn-outline"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: uploading
                                    ? 'not-allowed'
                                    : 'pointer',
                                opacity: uploading
                                    ? 0.6
                                    : 1,
                            }}
                        >
                            <Upload size={18} />
                            Select Images
                        </label>

                        <div
                            style={{
                                marginTop: '8px',
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                            }}
                        >
                            JPG, PNG or WEBP.
                            Maximum 5MB per file.
                        </div>

                        {/* Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div
                                style={{
                                    marginTop: '16px',
                                    textAlign: 'left',
                                }}
                            >
                                <strong>
                                    Selected (
                                    {selectedFiles.length}
                                    ):
                                </strong>

                                <div
                                    style={{
                                        marginTop: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    {selectedFiles.map(
                                        (file, index) => (
                                            <div
                                                key={`${file.name}-${file.lastModified}-${index}`}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems:
                                                        'center',
                                                    gap: '12px',
                                                    padding:
                                                        '8px 10px',
                                                    background:
                                                        'var(--bg-root)',
                                                    borderRadius:
                                                        '6px',
                                                    fontSize:
                                                        '13px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        overflow:
                                                            'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace:
                                                            'nowrap',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {file.name}{' '}
                                                    (
                                                    {(
                                                        file.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(
                                                        2
                                                    )}{' '}
                                                    MB)
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSelectedFile(
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                    style={{
                                                        border:
                                                            'none',
                                                        background:
                                                            'transparent',
                                                        color: '#dc2626',
                                                        cursor:
                                                            uploading
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                        padding:
                                                            '2px',
                                                    }}
                                                    title="Remove"
                                                >
                                                    <X
                                                        size={16}
                                                    />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Upload Controls */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginTop: '12px',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            handleUpload
                                        }
                                        disabled={
                                            uploading ||
                                            selectedFiles.length ===
                                                0
                                        }
                                        className="btn btn-primary"
                                    >
                                        <Upload
                                            size={16}
                                        />

                                        {uploading
                                            ? 'Uploading...'
                                            : `Upload ${selectedFiles.length} ${
                                                  selectedFiles.length ===
                                                  1
                                                      ? 'Image'
                                                      : 'Images'
                                              }`}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            clearSelectedFiles
                                        }
                                        disabled={
                                            uploading
                                        }
                                        className="btn btn-outline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Current Images */}
                    <h3
                        style={{
                            marginTop: 0,
                            marginBottom: '16px',
                            fontSize: '18px',
                        }}
                    >
                        Current Images
                    </h3>

                    {loading ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: 'var(--text-muted)',
                            }}
                        >
                            Loading images...
                        </div>
                    ) : images.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '40px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <ImageIcon
                                size={48}
                                style={{
                                    margin: '0 auto 12px',
                                }}
                            />

                            <div>
                                No product images yet.
                            </div>

                            <div
                                style={{
                                    marginTop: '6px',
                                    fontSize: '13px',
                                }}
                            >
                                Upload images above to
                                get started.
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '16px',
                            }}
                        >
                            {images.map(
                                (img, index) => {
                                    const isActionLoading =
                                        actionLoading ===
                                        img.id;

                                    return (
                                        <div
                                            key={img.id}
                                            className="card"
                                            style={{
                                                border: `2px solid ${
                                                    img.is_primary
                                                        ? 'var(--primary)'
                                                        : 'var(--border)'
                                                }`,
                                                padding: 0,
                                                position:
                                                    'relative',
                                                overflow:
                                                    'hidden',
                                            }}
                                        >
                                            {/* Primary Badge */}
                                            {img.is_primary && (
                                                <div
                                                    style={{
                                                        position:
                                                            'absolute',
                                                        top: '8px',
                                                        left: '8px',
                                                        background:
                                                            'var(--primary)',
                                                        color: '#fff',
                                                        padding:
                                                            '4px 8px',
                                                        borderRadius:
                                                            '4px',
                                                        fontSize:
                                                            '12px',
                                                        fontWeight:
                                                            'bold',
                                                        display:
                                                            'flex',
                                                        alignItems:
                                                            'center',
                                                        gap: '4px',
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <Star
                                                        size={
                                                            14
                                                        }
                                                        fill="currentColor"
                                                    />
                                                    Primary
                                                </div>
                                            )}

                                            {/* Image */}
                                            <div
                                                style={{
                                                    height: '150px',
                                                    background:
                                                        'var(--bg-subtle)',
                                                    display:
                                                        'flex',
                                                    alignItems:
                                                        'center',
                                                    justifyContent:
                                                        'center',
                                                    overflow:
                                                        'hidden',
                                                }}
                                            >
                                                <img
                                                    src={getImageUrl(
                                                        img.file_path
                                                    )}
                                                    alt={
                                                        img.alt_text ||
                                                        `${product.name} product image`
                                                    }
                                                    loading="lazy"
                                                    style={{
                                                        width:
                                                            '100%',
                                                        height:
                                                            '100%',
                                                        objectFit:
                                                            'contain',
                                                    }}
                                                    onError={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.display =
                                                            'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Controls */}
                                            <div
                                                style={{
                                                    padding:
                                                        '12px',
                                                    background:
                                                        'var(--bg-subtle)',
                                                    borderTop:
                                                        '1px solid var(--border)',
                                                }}
                                            >
                                                {/* Primary */}
                                                <div
                                                    style={{
                                                        display:
                                                            'flex',
                                                        gap: '8px',
                                                        marginBottom:
                                                            '8px',
                                                    }}
                                                >
                                                    {!img.is_primary ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSetPrimary(
                                                                    img.id
                                                                )
                                                            }
                                                            disabled={
                                                                isActionLoading ||
                                                                uploading
                                                            }
                                                            className="btn btn-outline"
                                                            style={{
                                                                flex: 1,
                                                                padding:
                                                                    '6px',
                                                                fontSize:
                                                                    '12px',
                                                                cursor:
                                                                    isActionLoading
                                                                        ? 'not-allowed'
                                                                        : 'pointer',
                                                                opacity:
                                                                    isActionLoading
                                                                        ? 0.6
                                                                        : 1,
                                                            }}
                                                        >
                                                            <Star
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            {isActionLoading
                                                                ? 'Updating...'
                                                                : 'Set Primary'}
                                                        </button>
                                                    ) : (
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                padding:
                                                                    '6px',
                                                                textAlign:
                                                                    'center',
                                                                fontSize:
                                                                    '12px',
                                                                color: 'var(--primary)',
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            Primary
                                                            Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Reorder + Delete */}
                                                <div
                                                    style={{
                                                        display:
                                                            'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        alignItems:
                                                            'center',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display:
                                                                'flex',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index ===
                                                                    0 ||
                                                                isActionLoading
                                                            }
                                                            onClick={() =>
                                                                handleMove(
                                                                    index,
                                                                    'left'
                                                                )
                                                            }
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding:
                                                                    '4px',
                                                                cursor:
                                                                    index ===
                                                                        0 ||
                                                                    isActionLoading
                                                                        ? 'not-allowed'
                                                                        : 'pointer',
                                                                opacity:
                                                                    index ===
                                                                        0 ||
                                                                    isActionLoading
                                                                        ? 0.5
                                                                        : 1,
                                                            }}
                                                            title="Move Left"
                                                        >
                                                            <ArrowLeft
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index ===
                                                                    images.length -
                                                                        1 ||
                                                                isActionLoading
                                                            }
                                                            onClick={() =>
                                                                handleMove(
                                                                    index,
                                                                    'right'
                                                                )
                                                            }
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding:
                                                                    '4px',
                                                                cursor:
                                                                    index ===
                                                                        images.length -
                                                                            1 ||
                                                                    isActionLoading
                                                                        ? 'not-allowed'
                                                                        : 'pointer',
                                                                opacity:
                                                                    index ===
                                                                        images.length -
                                                                            1 ||
                                                                    isActionLoading
                                                                        ? 0.5
                                                                        : 1,
                                                            }}
                                                            title="Move Right"
                                                        >
                                                            <ArrowRight
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                img.id
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ||
                                                            uploading
                                                        }
                                                        style={{
                                                            padding:
                                                                '4px',
                                                            background:
                                                                '#fee2e2',
                                                            color: '#dc2626',
                                                            border: '1px solid #fecaca',
                                                            borderRadius:
                                                                '4px',
                                                            cursor:
                                                                isActionLoading
                                                                    ? 'not-allowed'
                                                                    : 'pointer',
                                                            opacity:
                                                                isActionLoading
                                                                    ? 0.5
                                                                    : 1,
                                                        }}
                                                        title="Delete Image"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop:
                            '1px solid var(--border)',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-outline"
                        disabled={uploading}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}