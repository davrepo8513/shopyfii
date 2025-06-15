import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  addresses: [],
  wishlist: [],
  recentlyViewed: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.addresses = [];
      state.wishlist = [];
    },
    
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    addAddress: (state, action) => {
      state.addresses.push({
        id: Date.now().toString(),
        ...action.payload,
        isDefault: state.addresses.length === 0
      });
    },
    
    updateAddress: (state, action) => {
      const { id, ...addressData } = action.payload;
      const index = state.addresses.findIndex(addr => addr.id === id);
      if (index !== -1) {
        state.addresses[index] = { ...state.addresses[index], ...addressData };
      }
    },
    
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    
    setDefaultAddress: (state, action) => {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === action.payload;
      });
    },
    
    addToWishlist: (state, action) => {
      const productId = action.payload;
      if (!state.wishlist.includes(productId)) {
        state.wishlist.push(productId);
      }
    },
    
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(id => id !== action.payload);
    },
    
    addToRecentlyViewed: (state, action) => {
      const productId = action.payload;
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== productId);
      // Add to beginning
      state.recentlyViewed.unshift(productId);
      // Keep only last 10 items
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      }
    },
    
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    }
  },
});

export const {
  login,
  logout,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  addToWishlist,
  removeFromWishlist,
  addToRecentlyViewed,
  clearRecentlyViewed
} = userSlice.actions;

// Alias for login action
export const loginUser = login;

export default userSlice.reducer;