import { createSlice } from '@reduxjs/toolkit';

const MAX_COMPARE = 4;

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('ady_compare');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem('ady_compare', JSON.stringify(items));
  } catch {}
};

const initialState = {
  items: loadFromStorage(),
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((p) => p._id === product._id);
      if (exists) return; // already in list
      if (state.items.length >= MAX_COMPARE) return; // max 4
      state.items.push(product);
      saveToStorage(state.items);
    },
    removeFromCompare: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((p) => p._id !== productId);
      saveToStorage(state.items);
    },
    clearCompare: (state) => {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
