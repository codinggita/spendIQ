import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if provided, otherwise render the nested routes (Outlet)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
