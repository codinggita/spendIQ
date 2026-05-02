/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_EXPENSES } from '../utils/constants';

// ─── LocalStorage helpers ────────────────────────────────────────────────────
const LS_KEY = 'spendiq_local_expenses';

function readLocalExpenses() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  // First time: seed with current-week mock data so graphs look populated
  const seeded = MOCK_EXPENSES.map(e => ({ ...e }));
  writeLocalExpenses(seeded);
  return seeded;
}

function writeLocalExpenses(expenses) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(expenses));
  } catch (_) { /* ignore */ }
}

// ─── Fetch Expenses ──────────────────────────────────────────────────────────
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

    if (expenses.length > 0) {
      // Backend has real data — sync to localStorage and use it
      writeLocalExpenses(expenses);
      return { data: expenses };
    } else {
      // Backend returned empty (DB empty or not seeded) — use localStorage
      console.info('Backend returned 0 expenses — loading from localStorage instead.');
      return { data: readLocalExpenses() };
    }
  } catch (error) {
    console.warn('Backend unavailable — loading from localStorage:', error.message);
    return { data: readLocalExpenses() };
  }
};

// ─── Add Expense ─────────────────────────────────────────────────────────────
export const addExpense = async (data) => {
  try {
    const response = await axiosInstance.post('/expenses', data);
    if (response.data?.data?.expense) {
      const exp = response.data.data.expense;
      const normalized = {
        ...exp,
        id: exp._id,
        category: exp.category?.name || exp.category,
        notes: exp.description || exp.notes
      };
      // Keep localStorage in sync with backend
      const local = readLocalExpenses();
      local.unshift(normalized);
      writeLocalExpenses(local);
      response.data.data.expense = normalized;
    }
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable — saving expense to localStorage:', error.message);
    const localExpense = {
      ...data,
      id: Date.now().toString(),
      _id: Date.now().toString(),
      date: data.date || new Date().toISOString(),
      source: 'local'
    };
    const local = readLocalExpenses();
    local.unshift(localExpense);
    writeLocalExpenses(local);
    return { success: true, data: { expense: localExpense } };
  }
};

// Alias used by ReceiptScanner and any component that prefers explicit naming
export const addExpenseApi = addExpense;

// ─── Parse SMS ───────────────────────────────────────────────────────────────
export const parseManualSMS = async (data) => {
  try {
    const response = await axiosInstance.post('/sms/parse', {
      smsText: data.message,
      autoSave: true
    });
    if (response.data?.data?.expense) {
      const exp = response.data.data.expense;
      const normalized = {
        ...exp,
        id: exp._id,
        category: exp.category?.name || exp.category,
        notes: exp.description || exp.notes
      };
      // Keep localStorage in sync with backend
      const local = readLocalExpenses();
      local.unshift(normalized);
      writeLocalExpenses(local);
      response.data.data.expense = normalized;
    }
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable — parsing SMS locally:', error.message);
    // Basic local SMS parsing
    const amountMatch = data.message.match(/(?:(?:RS|INR|MRP)\.?\s*|Rs\.?|₹)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
    const merchantMatch = data.message.match(/(?:at|from|to)\s+([A-Za-z][A-Za-z\s]{2,30}?)(?:\s|$|\.)/i);
    const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown Merchant';

    const localExpense = {
      amount,
      merchant,
      category: 'Other',
      source: 'sms-local',
      notes: data.message.substring(0, 100),
      id: Date.now().toString(),
      _id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const local = readLocalExpenses();
    local.unshift(localExpense);
    writeLocalExpenses(local);
    return { success: true, data: { parsed: localExpense, expense: localExpense } };
  }
};

// ─── Delete Expense ───────────────────────────────────────────────────────────
export const deleteExpense = async (id) => {
  try {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    // Also remove from localStorage
    const local = readLocalExpenses();
    writeLocalExpenses(local.filter(e => e.id !== id && e._id !== id));
    return response.data;
  } catch (error) {
    // Delete locally even if backend is down
    const local = readLocalExpenses();
    writeLocalExpenses(local.filter(e => e.id !== id && e._id !== id));
    return { success: true };
  }
};
