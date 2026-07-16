'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse select-none">
      {/* Return button skeleton */}
      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-36" />

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Lead Info Sidebar Skeleton */}
        <div className="lg:col-span-1 bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-850 rounded w-3/4" />
            </div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-850 rounded-full" />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4 space-y-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-16" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-16" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-16" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            </div>
          </div>
        </div>

        {/* Right Column: Timeline Log Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Note Input Skeleton */}
          <div className="bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 space-y-3">
            <div className="h-20 bg-gray-200/50 dark:bg-gray-850/30 rounded-xl w-full" />
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
              <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-xl w-28" />
            </div>
          </div>

          {/* Notes Log List Skeleton */}
          <div className="space-y-6 relative pl-6 border-l border-gray-200/50 dark:border-gray-800/50">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="relative space-y-2">
                <div className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-[#090d16] bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center gap-2">
                  <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-16" />
                </div>
                <div className="bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-11/12" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-850 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
