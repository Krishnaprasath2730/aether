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
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}
