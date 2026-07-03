import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get analytics
export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { user } } = getState();
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    const { data } = await axios.get('/api/analytics', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
