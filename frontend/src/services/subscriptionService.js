import axiosInstance from './axiosInstance';

export const getSubscriptions = async () => {
  const response = await axiosInstance.get('/subscriptions');
  // Backend returns { success: true, data: [...] }
  return { data: response.data.data };
};

export const addSubscription = async (data) => {
  const response = await axiosInstance.post('/subscriptions', data);
  // Backend returns { success: true, data: { ... } }
  return { data: response.data.data };
};

export const removeSubscriptionApi = async (id) => {
  const response = await axiosInstance.delete(`/subscriptions/${id}`);
  return response.data;
};
