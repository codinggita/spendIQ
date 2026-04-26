import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import expenseReducer from './features/expense/expenseSlice';
import budgetReducer from './features/budget/budgetSlice';
import subscriptionReducer from './features/subscription/subscriptionSlice';
import uiReducer from './features/ui/uiSlice';
import cardReducer from './features/card/cardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    budget: budgetReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
    card: cardReducer,
  },
});
