import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getExpenses } from '../../services/expenseService';

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExpenses();
      return response.data; // array of expenses (real or localStorage)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],   // Start empty — fetchExpenses fills this from backend OR localStorage
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      // Prepend the new expense (use the id already set by the service layer)
      const expense = action.payload;
      state.items.unshift({
        ...expense,
        id: expense.id || expense._id || Date.now().toString(),
      });
    },
    removeExpense: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload && item._id !== action.payload
      );
    },
    setExpenses: (state, action) => {
      state.items = action.payload;
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
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addExpense, removeExpense, setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
