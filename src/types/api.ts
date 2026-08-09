export interface ApiProductImage {
    id: number;
    product_id: number;
    file_path: string;
    alt_text: string | null;
    is_primary: boolean;
    display_order: number;
}

export interface ApiProduct {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string | number; // Decimal comes back as string from mysql in some drivers, so we handle both
    discount_price: string | number | null;
    stock: number;
    sku: string | null;
    status: string;
    featured: boolean | number; // tinyint comes back as 0/1 sometimes
    images?: ApiProductImage[];
    
    // joined fields
    category_name?: string;
    category_slug?: string;
}

export interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    product_count?: number; // joined
}

export interface ApiPaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
