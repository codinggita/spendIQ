/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_BUDGETS } from '../utils/constants';

export const getBudgets = async () => {
  // return axiosInstance.get('/budgets');
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: MOCK_BUDGETS }), 500);
  });
};

export const updateBudget = async (id, data) => {
  // return axiosInstance.put(`/budgets/${id}`, data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { id, ...data } }), 500);
  });
};
