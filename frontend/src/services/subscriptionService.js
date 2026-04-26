/* eslint-disable no-unused-vars */
import axiosInstance from './axiosInstance';
import { MOCK_SUBSCRIPTIONS } from '../utils/constants';

export const getSubscriptions = async () => {
  // return axiosInstance.get('/subscriptions');
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: MOCK_SUBSCRIPTIONS }), 500);
  });
};

export const addSubscription = async (data) => {
  // return axiosInstance.post('/subscriptions', data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { id: Date.now().toString(), ...data } }), 500);
  });
};
