/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_EXPENSES } from '../utils/constants';

// Fetch expenses from API, fallback to mock data if backend is down
export const getExpenses = async () => {
  try {
    const response = await axiosInstance.get('/expenses');
    let expenses = response.data?.data?.expenses || [];
    // Normalize data for frontend UI
    expenses = expenses.map(exp => ({
      ...exp,
      id: exp._id,
      category: exp.category?.name || exp.category,
      notes: exp.description || exp.notes
    }));
    return { data: expenses };
  } catch (error) {
    console.warn('Backend unavailable, using mock data:', error.message);
    return { data: MOCK_EXPENSES };
  }
};

// Add expense manually via standard route
export const addExpense = async (data) => {
  const response = await axiosInstance.post('/expenses', data);
  if (response.data?.data?.expense) {
    const exp = response.data.data.expense;
    response.data.data.expense = {
      ...exp,
      id: exp._id,
      category: exp.category?.name || exp.category,
      notes: exp.description || exp.notes
    };
  }
  return response.data;
};

// Alias used by ReceiptScanner and any component that prefers explicit naming
export const addExpenseApi = addExpense;

// Parse raw SMS string and add expense via SMS route
export const parseManualSMS = async (data) => {
  const response = await axiosInstance.post('/sms/parse', {
    smsText: data.message,
    autoSave: true
  });
  if (response.data?.data?.expense) {
    const exp = response.data.data.expense;
    response.data.data.expense = {
      ...exp,
      id: exp._id,
      category: exp.category?.name || exp.category,
      notes: exp.description || exp.notes
    };
  }
  return response.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    return { success: true };
  }
};

