import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No data found', icon, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
      <div className="w-16 h-16 mb-4 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{message}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
        Get started by creating a new entry or adjusting your filters.
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
