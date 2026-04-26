import { createSlice } from '@reduxjs/toolkit';
import { MOCK_BUDGETS } from '../../utils/constants';

const initialState = {
  budgets: MOCK_BUDGETS,
  loading: false,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addBudget: (state, action) => {
      state.budgets.push({
        id: Date.now().toString(),
        ...action.payload,
        spent: 0,
      });
    },
    updateBudget: (state, action) => {
      const index = state.budgets.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = { ...state.budgets[index], ...action.payload };
      }
    },
    deleteBudget: (state, action) => {
      state.budgets = state.budgets.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBudget, updateBudget, deleteBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
