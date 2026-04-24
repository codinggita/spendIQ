import api from './api';

// For now, we mock the backend using localStorage since the actual backend is not set up yet.
const MOCK_USERS_KEY = 'mock_users';

export const loginUser = async (data) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
  const user = users.find((u) => u.email === data.email && u.password === data.password);

  if (!user) {
    throw { response: { data: { message: 'Invalid email or password' } } };
  }

  // Generate a mock JWT token
  const mockToken = `mock-jwt-token-${Date.now()}`;
  
  return {
    token: mockToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const registerUser = async (data) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
  const existingUser = users.find((u) => u.email === data.email);

  if (existingUser) {
    throw { response: { data: { message: 'User with this email already exists' } } };
  }

  const newUser = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: data.password, // In a real backend, this would be hashed
  };

  users.push(newUser);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

  return {
    message: 'User registered successfully',
  };
};
