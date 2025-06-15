import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push(product);
        state.totalItems = state.items.length;
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      state.totalItems = state.items.length;
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
    
    moveToCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      state.totalItems = state.items.length;
    }
  }
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  moveToCart 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;