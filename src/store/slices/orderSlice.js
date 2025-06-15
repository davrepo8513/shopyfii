import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dbOperations } from '../../database/database';

// Async thunk for creating order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData) => {
    const orderId = dbOperations.createOrder(orderData);
    return { orderId, ...orderData };
  }
);

// Async thunk for fetching order
export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId) => {
    return dbOperations.getOrderById(orderId);
  }
);

const initialState = {
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null,
  paymentStatus: 'idle', // idle, processing, success, failed
  paymentMethod: null,
  shippingAddress: null,
  billingAddress: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    
    setBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
    
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentStatus = 'idle';
      state.paymentMethod = null;
      state.shippingAddress = null;
      state.billingAddress = null;
    },
    
    addToOrderHistory: (state, action) => {
      state.orderHistory.unshift(action.payload);
    },
    
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
      }
      
      const orderIndex = state.orderHistory.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orderHistory[orderIndex].status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'processing';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.paymentStatus = 'success';
        state.orderHistory.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.paymentStatus = 'failed';
      })
      
      // Fetch order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPaymentMethod,
  setShippingAddress,
  setBillingAddress,
  setPaymentStatus,
  resetPaymentStatus,
  clearCurrentOrder,
  addToOrderHistory,
  updateOrderStatus
} = orderSlice.actions;

export default orderSlice.reducer;