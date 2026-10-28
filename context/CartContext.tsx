"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartProduct = {
  id: number;
  name: string;
  type: "fragrance" | "sunglasses";
  category: string;
  price: number;
  image: string;
  description: string;
  size?: string | null;
};

export type CartItem = CartProduct & {
  size?: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "dammys-essence-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore the saved cart when the component mounts.
  useEffect(() => {
    let cancelled = false;

    const restoreCart = async () => {
      try {
        const savedCart = localStorage.getItem(STORAGE_KEY);

        if (!savedCart) return;

        const parsed: unknown = JSON.parse(savedCart);

        if (!Array.isArray(parsed)) return;

        const validItems: CartItem[] = parsed.filter(
          (item): item is CartItem =>
            item !== null &&
            typeof item === "object" &&
            typeof item.id === "number" &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            (item.type === "fragrance" || item.type === "sunglasses") &&
            typeof item.category === "string" &&
            typeof item.image === "string" &&
            typeof item.description === "string",
        );

        // Merge duplicate product IDs in the saved cart.
        const uniqueItems = validItems.reduce<CartItem[]>((result, item) => {
          const existing = result.find((entry) => entry.id === item.id);

          if (existing) {
            existing.quantity += item.quantity;
          } else {
            result.push({ ...item });
          }

          return result;
        }, []);

        if (!cancelled) {
          setItems(uniqueItems);
        }
      } catch (error) {
        console.error("Unable to restore the saved cart:", error);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void restoreCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save cart changes only after the initial restore.
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to save the cart:", error);
    }
  }, [items, hydrated]);

  // Add a product or increase its quantity if it is already in the cart.
  const addToCart = useCallback((product: CartProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((current) =>
      current.filter((item) => item.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}