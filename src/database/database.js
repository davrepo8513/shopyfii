// In-memory database simulation for React web app
import { v4 as uuidv4 } from 'uuid';

// In-memory data storage
let products = [];
let orders = [];

// Initialize sample data
const initializeData = () => {
  if (products.length === 0) {
    products = [
      {
        id: uuidv4(),
        name: 'Nike Air Max 270',
        brand: 'Nike',
        price: 8999,
        originalPrice: 12999,
        discount: 31,
        rating: 4.5,
        reviews: 1250,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
        ],
        category: 'Running',
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Blue'],
        description: 'The Nike Air Max 270 delivers visible cushioning under every step with its large Max Air unit in the heel.',
        material: 'Synthetic leather and mesh',
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        price: 15999,
        originalPrice: 18999,
        discount: 16,
        rating: 4.7,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop'
        ],
        category: 'Running',
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        colors: ['Black', 'White', 'Grey'],
        description: 'Experience incredible energy return with Adidas Ultraboost 22 featuring responsive BOOST midsole.',
        material: 'Primeknit upper with BOOST midsole',
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Puma RS-X3',
        brand: 'Puma',
        price: 6999,
        originalPrice: 9999,
        discount: 30,
        rating: 4.2,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop'
        ],
        category: 'Lifestyle',
        sizes: ['6', '7', '8', '9', '10'],
        colors: ['White', 'Black', 'Red'],
        description: 'Bold and futuristic design meets comfort in Puma RS-X3 with chunky silhouette.',
        material: 'Synthetic and mesh upper',
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Converse Chuck Taylor',
        brand: 'Converse',
        price: 3999,
        originalPrice: 4999,
        discount: 20,
        rating: 4.3,
        reviews: 2100,
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop'
        ],
        category: 'Casual',
        sizes: ['5', '6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Red', 'Blue'],
        description: 'Classic canvas sneakers that never go out of style with iconic Chuck Taylor design.',
        material: 'Canvas upper with rubber sole',
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Reebok Classic Leather',
        brand: 'Reebok',
        price: 4999,
        originalPrice: 6999,
        discount: 29,
        rating: 4.1,
        reviews: 445,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop'
        ],
        category: 'Lifestyle',
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['White', 'Black'],
        description: 'Timeless style meets modern comfort in Reebok Classic Leather with premium materials.',
        material: 'Leather upper with EVA midsole',
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'New Balance 990v5',
        brand: 'New Balance',
        price: 13999,
        originalPrice: 16999,
        discount: 18,
        rating: 4.6,
        reviews: 678,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
        ],
        category: 'Running',
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Grey', 'Navy'],
        description: 'Premium running shoes with superior comfort and durability featuring ENCAP midsole technology.',
        material: 'Suede and mesh upper with ENCAP midsole',
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Vans Old Skool',
        brand: 'Vans',
        price: 3499,
        originalPrice: 4499,
        discount: 22,
        rating: 4.4,
        reviews: 1890,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=400&h=400&fit=crop'
        ],
        category: 'Skateboarding',
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Checkered'],
        description: 'The iconic side stripe and durable construction of Vans Old Skool for skateboarding and lifestyle.',
        material: 'Canvas and suede upper with waffle outsole',
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Jordan Air Jordan 1',
        brand: 'Jordan',
        price: 11999,
        originalPrice: 14999,
        discount: 20,
        rating: 4.8,
        reviews: 3456,
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'
        ],
        category: 'Basketball',
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: ['Black/Red', 'White/Black', 'Royal Blue'],
        description: 'The legendary basketball shoe that started it all with iconic design and premium materials.',
        material: 'Leather upper with Air-Sole unit',
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString()
      }
    ];
  }
};



// Database operations
export const dbOperations = {
  // Get all products
  getAllProducts: () => {
    initializeData();
    return [...products].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  // Get product by ID
  getProductById: (id) => {
    initializeData();
    return products.find(product => product.id === id) || null;
  },

  // Search products
  searchProducts: (query) => {
    initializeData();
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  },

  // Get products by category
  getProductsByCategory: (category) => {
    initializeData();
    return products
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => b.rating - a.rating);
  },

  // Get featured products
  getFeaturedProducts: () => {
    initializeData();
    return products
      .filter(product => product.featured)
      .sort((a, b) => b.rating - a.rating);
  },

  // Create order
  createOrder: (orderData) => {
    const orderId = uuidv4();
    const order = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    return orderId;
  },

  // Get order by ID
  getOrderById: (id) => {
    return orders.find(order => order.id === id) || null;
  }
};

// Initialize data on module load
initializeData();