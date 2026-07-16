'use client';

import React from 'react';

const LeadCardSkeleton = () => {
  return (
    <div className="min-w-[280px] sm:min-w-[330px] lg:min-w-[360px] flex-shrink-0 bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-5 lg:p-6 shadow-xs relative overflow-hidden animate-pulse flex flex-col justify-between min-h-[260px] select-none">
      {/* Top Border Accent placeholder */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200/30 dark:bg-gray-800/30" />
      
      <div>
        {/* Header: status indicator pulse and name */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 w-3/4">
            <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 bg-gray-200 dark:bg-gray-850 rounded w-2/3" />
          </div>
          <div className="w-14 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>

        {/* Contact details placeholder */}
        <div className="mt-4 flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-850 rounded-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-850 rounded w-1/2" />
        </div>

        {/* Notes display box placeholder */}
        <div className="mt-4 bg-gray-100/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800/50 rounded-xl p-4 min-h-[90px] flex flex-col justify-center gap-2.5">
          <div className="h-2 bg-gray-200 dark:bg-gray-850 rounded w-5/6" />
          <div className="h-2 bg-gray-200 dark:bg-gray-850 rounded w-2/3" />
        </div>
      </div>

      {/* Footer controls placeholder */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-1/4" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-14 sm:w-16" />
          <div className="h-8 bg-gray-200 dark:bg-gray-850 rounded-xl w-14 sm:w-16" />
          <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded-xl w-14 sm:w-16" />
        </div>
      </div>
    </div>
  );
};

export default LeadCardSkeleton;
