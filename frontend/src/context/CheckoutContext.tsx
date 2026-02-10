import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { CartItem } from '../types';

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface CheckoutContextType {
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  currentOrder: Order | null;
  createOrder: (items: CartItem[], paymentMethod: string) => Order;
  clearCheckout: () => void;
  orderHistory: Order[];
  cancelOrder: (orderId: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const SHIPPING_STORAGE_KEY = 'aether_shipping';
const ORDERS_STORAGE_KEY = 'aether_orders';

const loadShippingFromStorage = (): ShippingInfo | null => {
  try {
    const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadOrdersFromStorage = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ATH-${timestamp}-${randomPart}`;
};

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shippingInfo, setShippingInfoState] = useState<ShippingInfo | null>(() => loadShippingFromStorage());
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => loadOrdersFromStorage());

  const setShippingInfo = useCallback((info: ShippingInfo) => {
    setShippingInfoState(info);
    try {
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(info));
    } catch (error) {
      console.error('Failed to save shipping info:', error);
    }
  }, []);

  const createOrder = useCallback((items: CartItem[], paymentMethod: string): Order => {
    if (!shippingInfo) {
      throw new Error('Shipping info is required to create an order');
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Default to the cost calculated in Shipping step (distance based)
    let finalShippingCost = shippingInfo.shippingCost;

    // Apply Free Shipping Logic
    if (shippingInfo.shippingMethod === 'standard' && subtotal >= 300) {
      finalShippingCost = 0;
    } else if (shippingInfo.shippingMethod === 'express' && subtotal >= 600) {
      finalShippingCost = 0;
    }

    const order: Order = {
      id: generateOrderId(),
      items: [...items],
      shippingInfo: { ...shippingInfo, shippingCost: finalShippingCost },
      paymentMethod,
      subtotal,
      shippingCost: finalShippingCost,
      total: subtotal + finalShippingCost,
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    setCurrentOrder(order);

    const newHistory = [order, ...orderHistory];
    setOrderHistory(newHistory);

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save order:', error);
    }

    return order;
  }, [shippingInfo, orderHistory]);

  const clearCheckout = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrderHistory(prevHistory => {
      const updatedHistory = prevHistory.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const } 
          : order
      );
      
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save order history:', error);
      }
      
      return updatedHistory;
    });

    setCurrentOrder(curr => 
      curr && curr.id === orderId 
        ? { ...curr, status: 'cancelled' as const } 
        : curr
    );
  }, []);

  const value = useMemo(() => ({
    shippingInfo,
    setShippingInfo,
    currentOrder,
    createOrder,
    clearCheckout,
    orderHistory,
    cancelOrder
  }), [shippingInfo, setShippingInfo, currentOrder, createOrder, clearCheckout, orderHistory, cancelOrder]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within CheckoutProvider');
  return context;
};
