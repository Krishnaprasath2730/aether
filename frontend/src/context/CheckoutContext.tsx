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
  shippingMethod: 'standard' | 'express' | 'overnight';
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

interface CheckoutContextType {
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  currentOrder: Order | null;
  createOrder: (items: CartItem[], paymentMethod: string) => Order;
  clearCheckout: () => void;
  orderHistory: Order[];
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
    
    const shippingCosts = {
      standard: subtotal >= 200 ? 0 : 0,
      express: subtotal >= 200 ? 0 : 15,
      overnight: subtotal >= 200 ? 0 : 30
    };
    
    const shippingCost = shippingCosts[shippingInfo.shippingMethod];

    const order: Order = {
      id: generateOrderId(),
      items: [...items],
      shippingInfo,
      paymentMethod,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
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

  const value = useMemo(() => ({
    shippingInfo,
    setShippingInfo,
    currentOrder,
    createOrder,
    clearCheckout,
    orderHistory
  }), [shippingInfo, setShippingInfo, currentOrder, createOrder, clearCheckout, orderHistory]);

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
