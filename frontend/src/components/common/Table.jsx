import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';

const Table = ({ columns, data, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLoader key={i} height={40} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage || "No data available"} />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
