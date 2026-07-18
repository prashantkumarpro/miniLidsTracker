'use client';

import React from 'react';

const LeadRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      {/* Lead Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gray-250 dark:bg-gray-800 flex-shrink-0" />
          <div className="flex flex-col gap-2 w-32">
            <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-2.5 bg-gray-200 dark:bg-gray-850 rounded w-2/3" />
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-14 h-5 bg-gray-200 dark:bg-gray-850 rounded-full" />
      </td>

      {/* Last Communication */}
      <td className="px-6 py-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-48" />
      </td>

      {/* Date Added */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-3 bg-gray-250 dark:bg-gray-855 rounded w-16" />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-lg w-12" />
          <div className="h-7 bg-gray-250 dark:bg-gray-850 rounded-lg w-12" />
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-lg w-14" />
        </div>
      </td>
    </tr>
  );
};

export default LeadRowSkeleton;
