import axiosInstance from './axiosInstance';

export const loginUser = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  // The backend returns { success, message, data: { user, token } }
  return response.data.data;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

