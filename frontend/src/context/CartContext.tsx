import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Re-export types for convenience
export type { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string, size?: string, color?: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

// Local storage key - will be user-specific
const CART_STORAGE_PREFIX = 'aether_cart';
const API_URL = 'http://localhost:8080/api/user';

// Helper to get user-specific cart key
const getCartStorageKey = (userId: string | null): string => {
  return userId ? `${CART_STORAGE_PREFIX}_user_${userId}` : CART_STORAGE_PREFIX;
};

// Helper to load cart from localStorage
const loadCartFromStorage = (userId: string | null): CartItem[] => {
  try {
    const key = getCartStorageKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save cart to localStorage
const saveCartToStorage = (items: CartItem[], userId: string | null) => {
  try {
    const key = getCartStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

// Helper to clear all cart data from localStorage
// const clearAllCartStorage = () => {
//   try {
//     // Clear old global key
//     localStorage.removeItem(CART_STORAGE_PREFIX);

//     // Clear all user-specific keys
//     const keys = Object.keys(localStorage);
//     keys.forEach(key => {
//       if (key.startsWith(CART_STORAGE_PREFIX)) {
//         localStorage.removeItem(key);
//       }
//     });
//   } catch (error) {
//     console.error('Failed to clear cart storage:', error);
//   }
// };

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, user, setOnLoginCallback, setOnLogoutCallback } = useAuth();
  const userId = user?.id || null;

  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart when user changes
  useEffect(() => {
    if (userId) {
      const storedCart = loadCartFromStorage(userId);
      setItems(storedCart);
    } else {
      setItems([]);
    }
  }, [userId]);

  // Sync cart with backend when items change (only if authenticated)
  useEffect(() => {
    if (userId) {
      saveCartToStorage(items, userId);
    }

    if (isAuthenticated && token) {
      const saveToBackend = async () => {
        try {
          // Map items to match backend schema (id -> productId)
          const backendItems = items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            quantity: item.quantity,
          }));

          await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: backendItems }),
          });
        } catch (error) {
          console.error('Save cart error:', error);
        }
      };

      saveToBackend();
    }
  }, [items, isAuthenticated, token, userId]);

  // Restore cart from backend on login
  useEffect(() => {
    setOnLoginCallback(() => async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            // Map backend items to frontend format (productId -> id)
            const frontendItems = data.items.map((item: any) => ({
              id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              quantity: item.quantity,
              // Add default Product fields
              category: '',
              description: '',
              sizes: [item.selectedSize],
              colors: [item.selectedColor],
              inStock: true,
            }));
            setItems(frontendItems);
          } else {
            // No items in backend, clear local state
            setItems([]);
          }
        }
      } catch (error) {
        console.error('Restore cart error:', error);
      }
    });
  }, [token, setOnLoginCallback]);

  // Clear cart on logout
  useEffect(() => {
    setOnLogoutCallback(() => () => {
      setItems([]);
      // Clear only the current user's cart from localStorage
      if (userId) {
        const key = getCartStorageKey(userId);
        localStorage.removeItem(key);
      }
    });
  }, [setOnLogoutCallback, userId]);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!size || !color) {
      toast.warning('Please select size and color', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (quantity < 1) {
      console.warn('Quantity must be at least 1');
      return;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
  }, [isAuthenticated]);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(
        item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      ));
      return;
    }

    setItems(prev => prev.map(item =>
      item.id === productId && item.selectedSize === size && item.selectedColor === color
        ? { ...item, quantity }
        : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId: string, size?: string, color?: string) => {
    if (size && color) {
      return items.some(item => item.id === productId && item.selectedSize === size && item.selectedColor === color);
    }
    return items.some(item => item.id === productId);
  }, [items]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isInCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
