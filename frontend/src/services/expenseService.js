/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_EXPENSES } from '../utils/constants';

// Fetch expenses from API, fallback to mock data if backend is down
export const getExpenses = async () => {
  try {
    const response = await axiosInstance.get('/expenses');
    // response.data is { success: true, data: [...] }
    const data = response.data?.data ?? response.data;
    return { data: Array.isArray(data) ? data : MOCK_EXPENSES };
  } catch (error) {
    console.warn('Backend unavailable, using mock data:', error.message);
    return { data: MOCK_EXPENSES };
  }
};

// Add expense manually via standard route
export const addExpense = async (data) => {
  try {
    const response = await axiosInstance.post('/expenses', data);
    return response.data;
  } catch (error) {
    // Return a mock-successful response so the UI still works
    return { success: true, data: { id: Date.now().toString(), ...data } };
  }
};

// Alias used by ReceiptScanner and any component that prefers explicit naming
export const addExpenseApi = addExpense;

// Parse raw SMS string and add expense via SMS route
export const parseManualSMS = async (data) => {
  const apiKey = import.meta.env.VITE_API_KEY || 'rakshit-raj-yadav-spendiq';
  const response = await axiosInstance.post('/sms/receive', data, {
    headers: { 'x-api-key': apiKey }
  });
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

