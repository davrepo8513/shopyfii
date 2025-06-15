import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    user: userReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});