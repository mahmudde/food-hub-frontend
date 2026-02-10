import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  provider_id: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: "food-cart-storage" },
  ),
);
