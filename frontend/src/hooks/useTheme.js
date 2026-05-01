import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../features/ui/uiSlice';
import { storage } from '../utils/storage';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Sync with HTML class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to localStorage
    storage.set('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    isDark: theme === 'dark',
  };
};
