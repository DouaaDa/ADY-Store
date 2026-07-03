import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const wishlistFromStorage = localStorage.getItem('wishlist')
  ? JSON.parse(localStorage.getItem('wishlist'))
  : [];

// Toggle wishlist item on server (if authenticated)
export const toggleWishlistServer = createAsyncThunk(
  'wishlist/toggle',
  async ({ productId, token }, thunkAPI) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`/api/auth/wishlist/${productId}`, {}, config);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: wishlistFromStorage,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((x) => x._id === product._id);
      if (exists) {
        state.items = state.items.filter((x) => x._id !== product._id);
        toast.info('Retiré des favoris');
      } else {
        state.items = [...state.items, product];
        toast.success('Ajouté aux favoris ❤️');
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
