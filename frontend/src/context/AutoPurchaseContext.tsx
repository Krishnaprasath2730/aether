import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import { apiService } from '../services/api.service';
import { toast } from 'react-toastify';

interface AutoPurchaseItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    targetPrice: number;
    currentPrice: number;
    maxPrice: number;
    originalPrice: number; // The price when user set up auto-purchase
    lowestPriceSeen: number;
    status: 'active' | 'purchased' | 'cancelled' | 'insufficient_funds';
    createdAt: Date;
    purchasedAt?: Date;
    deliveryAddress?: string;
}

interface PurchaseHistoryItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    purchasePrice: number;
    targetPrice: number;
    purchasedAt: Date;
    deliveryAddress: string;
    status: 'processing' | 'shipped' | 'delivered';
}

interface PriceChangeLog {
    productId: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
    changedAt: Date;
    changedBy: string;
}

interface AutoPurchaseContextType {
    autoPurchaseItems: AutoPurchaseItem[];
    purchaseHistory: PurchaseHistoryItem[];
    priceChangeLogs: PriceChangeLog[];
    addAutoPurchase: (product: any, targetPrice: number, maxPrice: number, deliveryAddress: string) => void;
    removeAutoPurchase: (id: string) => void;
    updateTargetPrice: (id: string, newTargetPrice: number) => void;
    getAutoPurchaseForProduct: (productId: string) => AutoPurchaseItem | undefined;
    isMonitoring: (productId: string) => boolean;
    getAdminPrice: (productId: string, fallbackPrice: number) => number;
}

const AutoPurchaseContext = createContext<AutoPurchaseContextType | null>(null);

export const useAutoPurchase = () => {
    const ctx = useContext(AutoPurchaseContext);
    if (!ctx) throw new Error('useAutoPurchase must be used inside AutoPurchaseProvider');
    return ctx;
};

const STORAGE_KEY = 'aether_auto_purchases';
const HISTORY_KEY = 'aether_purchase_history';
const PRICE_LOG_KEY = 'aether_price_change_logs';
const ADMIN_PRICES_KEY = 'aether_admin_prices';

// Helper: Get admin-set prices from localStorage
export const getAdminPrices = (): Record<string, number> => {
    try {
        const stored = localStorage.getItem(ADMIN_PRICES_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

// Helper: Set admin price and dispatch event
export const setAdminPrice = (productId: string, newPrice: number, productName: string, oldPrice: number, adminName: string = 'Admin') => {
    const prices = getAdminPrices();
    prices[productId] = newPrice;
    localStorage.setItem(ADMIN_PRICES_KEY, JSON.stringify(prices));

    // Store price change log
    const logs: PriceChangeLog[] = JSON.parse(localStorage.getItem(PRICE_LOG_KEY) || '[]');
    logs.unshift({
        productId,
        productName,
        oldPrice,
        newPrice,
        changedAt: new Date(),
        changedBy: adminName
    });
    // Keep only last 50 logs
    localStorage.setItem(PRICE_LOG_KEY, JSON.stringify(logs.slice(0, 50)));

    // Dispatch custom event so AutoPurchaseContext picks up the change
    window.dispatchEvent(new CustomEvent('price-updated', {
        detail: { productId, newPrice, oldPrice, productName }
    }));
};

export const AutoPurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const { wallet, deduct, refreshWallet } = useWallet();
    const executingRef = useRef<Set<string>>(new Set());

    const [autoPurchaseItems, setAutoPurchaseItems] = useState<AutoPurchaseItem[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return parsed.map((item: AutoPurchaseItem) => ({
                    ...item,
                    lowestPriceSeen: item.lowestPriceSeen ?? item.currentPrice,
                    originalPrice: item.originalPrice ?? item.currentPrice
                }));
            } catch {
                return [];
            }
        }
        return [];
    });

    const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const [priceChangeLogs, setPriceChangeLogs] = useState<PriceChangeLog[]>(() => {
        const stored = localStorage.getItem(PRICE_LOG_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(autoPurchaseItems));
    }, [autoPurchaseItems]);

    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(purchaseHistory));
    }, [purchaseHistory]);

    // Listen for admin price changes via custom event
    useEffect(() => {
        const handlePriceUpdate = (e: Event) => {
            const { productId, newPrice, productName } = (e as CustomEvent).detail;

            // Refresh logs
            const logs = JSON.parse(localStorage.getItem(PRICE_LOG_KEY) || '[]');
            setPriceChangeLogs(logs);

            // Update currentPrice for active auto-purchase items
            setAutoPurchaseItems(items =>
                items.map(item => {
                    if (item.productId !== productId || item.status !== 'active') return item;

                    const lowestPriceSeen = Math.min(item.lowestPriceSeen ?? item.currentPrice, newPrice);

                    return {
                        ...item,
                        currentPrice: newPrice,
                        lowestPriceSeen
                    };
                })
            );

            // Toast notification for the user about price change
            toast.info(
                `📊 Price updated for ${productName}: ₹${newPrice.toLocaleString('en-IN')}`,
                { autoClose: 4000 }
            );
        };

        window.addEventListener('price-updated', handlePriceUpdate);
        return () => window.removeEventListener('price-updated', handlePriceUpdate);
    }, []);

    // Check for auto-purchase triggers when items update
    useEffect(() => {
        autoPurchaseItems.forEach(item => {
            if (item.status !== 'active') return;

            // Check if price hit target and within max
            if (item.currentPrice <= item.targetPrice && item.currentPrice <= item.maxPrice) {
                if (!executingRef.current.has(item.id)) {
                    executingRef.current.add(item.id);
                    executePurchase(item);
                }
            }
        });
    }, [autoPurchaseItems]);

    const executePurchase = async (item: AutoPurchaseItem) => {
        // Check wallet balance
        if (wallet.available < item.currentPrice) {
            setAutoPurchaseItems(items =>
                items.map(i => i.id === item.id ? { ...i, status: 'insufficient_funds' as const } : i)
            );
            toast.error(`⚠️ Auto-purchase failed: Insufficient wallet balance for ${item.productName}`);
            executingRef.current.delete(item.id);
            return;
        }

        // Deduct from wallet
        const success = deduct(item.currentPrice);
        if (!success) {
            toast.error('Failed to process payment');
            executingRef.current.delete(item.id);
            return;
        }

        // Update item status
        const purchasedAt = new Date();
        setAutoPurchaseItems(items =>
            items.map(i => i.id === item.id ? { ...i, status: 'purchased' as const, purchasedAt } : i)
        );

        // Add to purchase history
        const historyItem: PurchaseHistoryItem = {
            id: `hist_${Date.now()}`,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            purchasePrice: item.currentPrice,
            targetPrice: item.targetPrice,
            purchasedAt,
            deliveryAddress: item.deliveryAddress || '',
            status: 'processing'
        };
        setPurchaseHistory(prev => [historyItem, ...prev]);

        // Send email notification
        try {
            if (token) {
                await apiService.sendAutoPurchaseNotification(token, {
                    productName: item.productName,
                    purchasePrice: item.currentPrice,
                    targetPrice: item.targetPrice,
                    deliveryAddress: item.deliveryAddress,
                    userEmail: user?.email
                });
            }
        } catch (error) {
            console.error('Failed to send email notification:', error);
        }

        // Refresh wallet
        refreshWallet();

        toast.success(
            `🎉 SmartAutoPay triggered! Purchased ${item.productName} at ₹${item.currentPrice.toLocaleString('en-IN')}!`,
            { autoClose: 5000 }
        );

        executingRef.current.delete(item.id);
    };

    const getAdminPrice = useCallback((productId: string, fallbackPrice: number): number => {
        const prices = getAdminPrices();
        return prices[productId] ?? fallbackPrice;
    }, []);

    const addAutoPurchase = useCallback((product: any, targetPrice: number, maxPrice: number, deliveryAddress: string) => {
        const currentAdminPrice = getAdminPrice(product.id, product.price);

        const newItem: AutoPurchaseItem = {
            id: `ap_${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            targetPrice,
            maxPrice,
            currentPrice: currentAdminPrice,
            originalPrice: currentAdminPrice,
            lowestPriceSeen: currentAdminPrice,
            status: 'active',
            createdAt: new Date(),
            deliveryAddress
        };

        setAutoPurchaseItems(prev => [...prev, newItem]);

        toast.success(`✅ SmartAutoPay set for ${product.name}. Will auto-purchase when price ≤ ₹${targetPrice.toLocaleString('en-IN')}`);
    }, [getAdminPrice]);

    const removeAutoPurchase = useCallback((id: string) => {
        setAutoPurchaseItems(prev => prev.filter(item => item.id !== id));
        toast.info('SmartAutoPay cancelled');
    }, []);

    const updateTargetPrice = useCallback((id: string, newTargetPrice: number) => {
        setAutoPurchaseItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, targetPrice: newTargetPrice }
                    : item
            )
        );
        toast.success(`Target price updated to ₹${newTargetPrice.toLocaleString('en-IN')}`);
    }, []);

    const getAutoPurchaseForProduct = useCallback((productId: string) => {
        return autoPurchaseItems.find(item => item.productId === productId && item.status === 'active');
    }, [autoPurchaseItems]);

    const isMonitoring = useCallback((productId: string) => {
        return autoPurchaseItems.some(item => item.productId === productId && item.status === 'active');
    }, [autoPurchaseItems]);

    return (
        <AutoPurchaseContext.Provider value={{
            autoPurchaseItems,
            purchaseHistory,
            priceChangeLogs,
            addAutoPurchase,
            removeAutoPurchase,
            updateTargetPrice,
            getAutoPurchaseForProduct,
            isMonitoring,
            getAdminPrice
        }}>
            {children}
        </AutoPurchaseContext.Provider>
    );
};
