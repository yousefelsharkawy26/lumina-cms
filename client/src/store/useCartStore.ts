import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockCount: number;
  categoryId?: string;
  category?: { name: string; id?: string };
  similarProducts?: Product[];
  createdAt?: string | Date;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  setIsCartOpen: (isOpen: boolean) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'lumina-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export { useCartStore, type Product, type CartItem };