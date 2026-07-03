import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create order
export const createOrder = createAsyncThunk('orders/createOrder', async (order, { getState, rejectWithValue }) => {
  try {
    const { auth: { user } } = getState();
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    const { data } = await axios.post('/api/orders', order, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message);
  }
});

// Fetch my orders
export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { user } } = getState();
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    const { data } = await axios.get('/api/orders/myorders', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message);
  }
});

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { user } } = getState();
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    const { data } = await axios.get('/api/orders', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    myOrders: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
