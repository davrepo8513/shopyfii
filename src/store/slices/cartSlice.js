import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      
      // Handle both formats: direct item or { product, size, color, quantity }
      let item, size, color, quantity;
      
      if (payload.product) {
        // Old format: { product, size, color, quantity }
        item = payload.product;
        size = payload.size;
        color = payload.color;
        quantity = payload.quantity || 1;
      } else {
        // New format: direct item with all properties
        item = payload;
        size = payload.size;
        color = payload.color;
        quantity = payload.quantity || 1;
      }
      
      const existingItemIndex = state.items.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === size && cartItem.color === color
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          ...item,
          size,
          color,
          quantity,
          cartItemId: `${item.id}-${size}-${color}-${Date.now()}`
        });
      }

      state.totalQuantity += quantity;
      state.totalAmount += item.price * quantity;
    },

    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      const itemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },

    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      
      if (itemIndex >= 0 && quantity > 0) {
        const item = state.items[itemIndex];
        const quantityDiff = quantity - item.quantity;
        
        item.quantity = quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += item.price * quantityDiff;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    openCart: (state) => {
      state.isOpen = true;
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  openCart
} = cartSlice.actions;

export default cartSlice.reducer;