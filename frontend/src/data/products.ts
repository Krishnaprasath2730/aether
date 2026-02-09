import type { Product } from '../types';

export const products: Product[] = [
    {
        id: '1',
        name: 'Oversized Struct Blazer',
        price: 249.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop',
        description: 'A modern take on the classic blazer. This oversized piece features structured shoulders and a relaxed fit, perfect for elevating any outfit from casual to sophisticated.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Cream', 'Navy'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '2',
        name: 'Technical Cargo Pant',
        price: 189.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
        description: 'Engineered for both style and function. These cargo pants feature water-resistant fabric, multiple utility pockets, and a tapered fit for a modern silhouette.',
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Olive', 'Stone'],
        inStock: true,
        productType: 'pant'
    },
    {
        id: '3',
        name: 'Minimalist Wool Coat',
        price: 399.00,
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1887&auto=format&fit=crop',
        description: 'Timeless elegance meets contemporary design. Crafted from premium Italian wool, this coat features clean lines and a versatile silhouette that transcends seasons.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Camel', 'Black', 'Grey'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '4',
        name: 'Essential Knit Sweater',
        price: 129.00,
        category: 'Unisex',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
        description: 'The perfect everyday essential. Made from ultra-soft organic cotton blend, this relaxed-fit sweater offers exceptional comfort without compromising on style.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Oatmeal', 'Charcoal', 'Forest Green'],
        inStock: true,
        productType: 'shirt'
    },
    {
        id: '5',
        name: 'Tailored Linen Shirt',
        price: 149.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop',
        description: 'Effortless sophistication for warm days. This premium linen shirt features a relaxed yet refined cut with mother-of-pearl buttons and French seams.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Light Blue', 'Sand'],
        inStock: true,
        productType: 'shirt'
    },
    {
        id: '6',
        name: 'Silk Midi Dress',
        price: 329.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop',
        description: 'Flowing elegance in pure silk. This midi dress drapes beautifully with a flattering bias cut and features a subtle cowl neckline for understated glamour.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Champagne', 'Blush', 'Emerald'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '7',
        name: 'Premium Leather Sneakers',
        price: 279.00,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
        description: 'Handcrafted from Italian calfskin leather with a minimalist design. Features cushioned insoles and durable rubber outsoles for all-day comfort.',
        sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
        colors: ['White', 'Black', 'Tan'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '8',
        name: 'Cashmere Blend Scarf',
        price: 159.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1887&auto=format&fit=crop',
        description: 'Luxuriously soft cashmere blend scarf with a generous oversized dimension. Perfect for layering in colder months or as a sophisticated accent piece.',
        sizes: ['One Size'],
        colors: ['Burgundy', 'Navy', 'Grey', 'Camel'],
        inStock: true,
        stockCount: 5,
        productType: 'other'
    },
    {
        id: '9',
        name: 'Structured Tote Bag',
        price: 349.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1938&auto=format&fit=crop',
        description: 'A refined everyday companion. This structured tote is crafted from vegetable-tanned leather with a suede-lined interior and multiple organization pockets.',
        sizes: ['One Size'],
        colors: ['Black', 'Cognac', 'Taupe'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '10',
        name: 'Relaxed Denim Jacket',
        price: 219.00,
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1887&auto=format&fit=crop',
        description: 'A wardrobe staple reimagined. Premium Japanese selvedge denim with a relaxed fit, classic hardware, and a lightly washed finish for effortless cool.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Light Wash', 'Medium Wash', 'Dark Indigo'],
        inStock: true,
        productType: 'other'
    },
    {
        id: '11',
        name: 'Cropped Wide-Leg Trousers',
        price: 175.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop',
        description: 'Statement trousers with a flattering wide-leg silhouette. High-waisted with a cropped length, perfect for showcasing your favorite footwear.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Ivory', 'Terracotta'],
        inStock: true,
        productType: 'pant'
    },
    {
        id: '12',
        name: 'Merino Wool Beanie',
        price: 65.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1887&auto=format&fit=crop',
        description: 'Premium merino wool beanie that offers warmth without the itch. Ribbed construction with a slightly slouchy fit for contemporary style.',
        sizes: ['One Size'],
        colors: ['Black', 'Cream', 'Navy', 'Rust'],
        inStock: true,
        stockCount: 8,
        productType: 'other'
    },
    // Refurbished Products
    {
        id: '13',
        name: 'Oversized Struct Blazer (Open-Box)',
        price: 179.00,
        originalPrice: 249.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop',
        description: 'Open-box item in perfect condition. A modern take on the classic blazer with structured shoulders and relaxed fit. Inspected and verified by our quality team.',
        sizes: ['M', 'L'],
        colors: ['Black', 'Navy'],
        inStock: true,
        isRefurbished: true,
        condition: 'open-box',
        productType: 'other'
    },
    {
        id: '14',
        name: 'Technical Cargo Pant (Refurbished)',
        price: 119.00,
        originalPrice: 189.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
        description: 'Professionally refurbished. Minor signs of previous use, fully functional. Water-resistant fabric with utility pockets. Verified quality.',
        sizes: ['30', '32', '34'],
        colors: ['Black', 'Olive'],
        inStock: true,
        isRefurbished: true,
        condition: 'refurbished',
        productType: 'pant'
    },
    {
        id: '15',
        name: 'Premium Leather Sneakers (Open-Box)',
        price: 199.00,
        originalPrice: 279.00,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
        description: 'Open-box item, tried on but never worn outdoors. Italian calfskin leather with cushioned insoles. Includes original packaging.',
        sizes: ['40', '42', '43'],
        colors: ['White', 'Black'],
        inStock: true,
        isRefurbished: true,
        condition: 'open-box',
        productType: 'other'
    },
    {
        id: '16',
        name: 'Essential Oxford Shirt',
        price: 119.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070&auto=format&fit=crop',
        description: 'Classic oxford shirt crafted from premium cotton. Features a button-down collar and tailored fit for versatile styling.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Light Blue', 'Navy'],
        inStock: true,
        productType: 'shirt'
    }
];

export const categories = ['All', 'Men', 'Women', 'Unisex', 'Outerwear', 'Footwear', 'Accessories', 'Hub'];

export const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
};

// Get refurbished products only
export const getRefurbishedProducts = (): Product[] => {
    return products.filter(p => p.isRefurbished);
};

// Get products by type for combo detection
export const getProductsByType = (type: 'shirt' | 'pant' | 'other'): Product[] => {
    return products.filter(p => p.productType === type);
};

