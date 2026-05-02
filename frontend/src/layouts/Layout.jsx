import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchExpenses } from '../features/expense/expenseSlice';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const Layout = () => {
  const dispatch = useDispatch();

  // Fetch expenses ONCE when the app shell loads — never re-fetch on page navigation
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-lg md:p-xl">
          <div className="max-w-screen-2xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

