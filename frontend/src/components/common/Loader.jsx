import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
    : "flex items-center justify-center p-8 w-full";

  return (
    <div className={containerClass}>
      <CircularProgress sx={{ color: '#4F46E5' }} />
    </div>
  );
};

export default Loader;
