import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubscriptions, addSubscription as addSubApi, removeSubscriptionApi } from '../../services/subscriptionService';

export const fetchSubscriptions = createAsyncThunk('subscription/fetch', async (_, thunkAPI) => {
  try {
    const response = await getSubscriptions();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
  }
});

export const addSubscription = createAsyncThunk('subscription/add', async (data, thunkAPI) => {
  try {
    const response = await addSubApi(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add');
  }
});

export const removeSubscription = createAsyncThunk('subscription/remove', async (id, thunkAPI) => {
  try {
    await removeSubscriptionApi(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => { state.loading = true; })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeSubscription.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s._id !== action.payload);
      });
  },
});

export default subscriptionSlice.reducer;
