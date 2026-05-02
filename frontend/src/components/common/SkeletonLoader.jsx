import React from 'react';

const SkeletonLoader = ({ height = 20, width = '100%', className = '', borderRadius = '8px' }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`}
      style={{ height, width, borderRadius }}
    />
  );
};

export default SkeletonLoader;
