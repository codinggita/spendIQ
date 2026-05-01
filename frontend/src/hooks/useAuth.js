import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    logout: handleLogout,
  };
};
