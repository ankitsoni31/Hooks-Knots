import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    items: number[];
    toggleItem: (productId: number) => void;
    hasItem: (productId: number) => boolean;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (productId) => {
                const currentItems = get().items;
                if (currentItems.includes(productId)) {
                    set({ items: currentItems.filter(id => id !== productId) });
                } else {
                    set({ items: [...currentItems, productId] });
                }
            },
            hasItem: (productId) => get().items.includes(productId),
        }),
        { name: 'hk-wishlist' }
    )
);
