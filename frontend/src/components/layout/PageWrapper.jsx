import React, { useEffect } from 'react';

const PageWrapper = ({ title, children }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | SpendIQ`;
    }
  }, [title]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* You can also put a page header here if not relying solely on the Navbar title */}
      <div className="mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
