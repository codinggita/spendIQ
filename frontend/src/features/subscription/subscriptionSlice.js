import { createSlice } from '@reduxjs/toolkit';
import { MOCK_SUBSCRIPTIONS } from '../../utils/constants';

const initialState = {
  subscriptions: MOCK_SUBSCRIPTIONS,
  loading: false,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    addSubscription: (state, action) => {
      state.subscriptions.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    removeSubscription: (state, action) => {
      state.subscriptions = state.subscriptions.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSubscription, removeSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
