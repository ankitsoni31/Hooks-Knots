import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product_id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.product_id === item.product_id);
                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...item, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((i) => i.product_id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map((i) => (i.product_id === productId ? { ...i, quantity } : i)),
                });
            },
            clearCart: () => set({ items: [] }),
            get total() {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
        }),
        { name: 'hk-cart' }
    )
);
