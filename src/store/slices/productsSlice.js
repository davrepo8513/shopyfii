import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dbOperations } from '../../database/database';

// Async thunks for database operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return dbOperations.getAllProducts();
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query) => {
    return dbOperations.searchProducts(query);
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category) => {
    return dbOperations.getProductsByCategory(category);
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    return dbOperations.getFeaturedProducts();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId) => {
    return dbOperations.getProductById(productId);
  }
);

const initialState = {
  items: [],
  featuredProducts: [],
  filteredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
  priceRange: [0, 20000],
  selectedBrands: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      // Apply sorting to current filtered products
      const sortedProducts = [...state.filteredProducts];
      switch (action.payload) {
        case 'price-low':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'featured':
        default:
          sortedProducts.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
          break;
      }
      state.filteredProducts = sortedProducts;
    },
    
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    
    setSelectedBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },
    
    applyFilters: (state) => {
      let filtered = [...state.items];
      
      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }
      
      // Filter by price range
      filtered = filtered.filter(product =>
        product.price >= state.priceRange[0] && product.price <= state.priceRange[1]
      );
      
      // Filter by brands
      if (state.selectedBrands.length > 0) {
        filtered = filtered.filter(product =>
          state.selectedBrands.includes(product.brand)
        );
      }
      
      // Apply sorting
      switch (state.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'featured':
        default:
          filtered.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
          break;
      }
      
      state.filteredProducts = filtered;
    },
    
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.sortBy = 'featured';
      state.priceRange = [0, 20000];
      state.selectedBrands = [];
      state.filteredProducts = [...state.items];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.filteredProducts = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setSelectedBrands,
  applyFilters,
  clearFilters
} = productsSlice.actions;

export default productsSlice.reducer;