import { createSlice } from '@reduxjs/toolkit';
import { MOCK_CARD } from '../../utils/constants';

const initialState = {
  items: [MOCK_CARD],
  loading: false,
  error: null,
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    addCard: (state, action) => {
      state.items.push(action.payload);
    },
    removeCard: (state, action) => {
      state.items = state.items.filter(card => card.id !== action.payload);
    },
    updateCard: (state, action) => {
      const index = state.items.findIndex(card => card.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    }
  },
});

export const { addCard, removeCard, updateCard } = cardSlice.actions;
export default cardSlice.reducer;
