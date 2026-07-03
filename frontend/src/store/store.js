import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import adminReducer from './adminSlice';
import orderReducer from './orderSlice';
import compareReducer from './compareSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    admin: adminReducer,
    orders: orderReducer,
    compare: compareReducer,
  },
});

