import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../layouts/Layout';
import Loader from '../components/Loader';

// Lazy load pages for performance
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Expenses = lazy(() => import('../pages/Expenses'));
const Budget = lazy(() => import('../pages/Budget'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Subscriptions = lazy(() => import('../pages/Subscriptions'));
const CreditCard = lazy(() => import('../pages/CreditCard'));
const AddExpense = lazy(() => import('../pages/AddExpense'));
const ReceiptScanner = lazy(() => import('../pages/ReceiptScanner'));
const Settings = lazy(() => import('../pages/Settings'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Layout Wrapper for Dashboard features */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/credit-card" element={<CreditCard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/receipt-scanner" element={<ReceiptScanner />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all route redirecting to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
