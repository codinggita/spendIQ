export const isAuthenticated = () => {
  // Check if authToken exists in localStorage
  return !!localStorage.getItem('authToken');
};
