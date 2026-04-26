/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_CARD } from '../utils/constants';

export const getCards = async () => {
  // return axiosInstance.get('/cards');
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: [MOCK_CARD] }), 500);
  });
};

export const getCardTransactions = async (cardId) => {
  // return axiosInstance.get(`/cards/${cardId}/transactions`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: MOCK_CARD.transactions }), 500);
  });
};
