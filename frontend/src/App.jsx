import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './hooks/useTheme';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  // Initialize theme on load
  useTheme();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
