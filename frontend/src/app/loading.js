'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse select-none">
      {/* Header / Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96 max-w-full" />
      </div>

      {/* Stats Cards Row Carousel Skeleton */}
      <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-none w-full -mx-3 px-3 lg:mx-0 lg:px-0">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="min-w-[155px] sm:min-w-[200px] lg:min-w-[220px] flex-shrink-0 bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 p-4 sm:p-5 lg:p-6 rounded-2xl h-[130px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800/40 rounded" />
              <div className="w-full h-1 bg-gray-300 dark:bg-gray-900 rounded-full mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and chip controls skeleton */}
      <div className="bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full sm:max-w-md" />
        <div className="space-y-2.5">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32" />
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-7 bg-gray-200 dark:bg-gray-800 rounded-full w-20 flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Leads Carousel Skeleton */}
      <div className="flex overflow-x-auto gap-5 pb-5 scrollbar-none w-full -mx-3 px-3 lg:mx-0 lg:px-0">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="min-w-[280px] sm:min-w-[330px] lg:min-w-[360px] flex-shrink-0 bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-5 lg:p-6 h-[270px] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 w-3/4">
                  <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                </div>
                <div className="w-14 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
              <div className="mt-4 bg-gray-100/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800/50 rounded-xl p-4 h-[90px]" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="flex gap-2">
                <div className="w-14 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="w-14 h-8 bg-gray-250 dark:bg-gray-900 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
