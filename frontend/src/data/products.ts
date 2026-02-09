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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
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
        inStock: true
    }
];

export const categories = ['All', 'Men', 'Women', 'Unisex', 'Outerwear', 'Footwear', 'Accessories'];

export const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
};
