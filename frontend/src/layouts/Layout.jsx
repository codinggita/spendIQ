import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SpendIQ</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => (isActive ? 'active' : '')}>
            Expenses
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => (isActive ? 'active' : '')}>
            Budget
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => (isActive ? 'active' : '')}>
            AI Assistant
          </NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => (isActive ? 'active' : '')}>
            Subscriptions
          </NavLink>
          <NavLink to="/credit-card" className={({ isActive }) => (isActive ? 'active' : '')}>
            Credit Card
          </NavLink>
          <NavLink to="/add-expense" className={({ isActive }) => (isActive ? 'active' : '')}>
            Add Expense
          </NavLink>
          <NavLink to="/receipt-scanner" className={({ isActive }) => (isActive ? 'active' : '')}>
            Receipt Scanner
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="navbar">
          <div className="navbar-title">Dashboard</div>
          <div className="navbar-profile">User Profile</div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
