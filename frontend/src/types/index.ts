// Product Types
export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    sizes: string[];
    colors: string[];
    inStock: boolean;
    // Additional fields for features
    isRefurbished?: boolean;
    condition?: 'refurbished' | 'open-box';
    originalPrice?: number; // For discounted refurbished items
    stockCount?: number;
    productType?: 'shirt' | 'pant' | 'other';
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

// Scratch Card types
export interface ScratchCard {
    id: string;
    orderAmount: number;
    discountPercentage?: number;
    discountAmount?: number;
    isScratched: boolean;
    isRedeemed: boolean;
    expiresAt: string;
}
