import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getExpenses } from '../../services/expenseService';
import { MOCK_EXPENSES } from '../../utils/constants';

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExpenses();
      return response.data; // This is the array of expenses
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: MOCK_EXPENSES, // Start with mock data, replaced by real data once fetched
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      // Simulate adding an expense
      state.items.unshift({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    removeExpense: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setExpenses: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        // Guard: only update if we received a valid array
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.items = action.payload;
        }
        // Otherwise keep existing items (mock data or previous fetch)
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addExpense, removeExpense, setExpenses, setLoading, setError } = expenseSlice.actions;
export default expenseSlice.reducer;
