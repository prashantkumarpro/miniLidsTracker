'use client';

import React from 'react';

const StatsCards = ({ stats }) => {
  const defaultStats = {
    total: 0,
    New: 0,
    Contacted: 0,
    Interested: 0,
    Converted: 0,
    Lost: 0
  };

  const currentStats = { ...defaultStats, ...stats };

  const cards = [
    {
      label: 'Total Leads',
      value: currentStats.total,
      borderColor: 'border-l-gray-400 dark:border-l-gray-500 focus-within:ring-gray-400',
      textColor: 'text-gray-900 dark:text-white',
      icon: (
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badgeColor: 'bg-gray-100',
      darkBadgeColor: 'dark:bg-gray-800/80'
    },
    {
      label: 'New',
      value: currentStats.New,
      borderColor: 'border-l-blue-500 focus-within:ring-blue-500',
      textColor: 'text-blue-700 dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      badgeColor: 'bg-blue-50',
      darkBadgeColor: 'dark:bg-blue-950/40'
    },
    {
      label: 'Contacted',
      value: currentStats.Contacted,
      borderColor: 'border-l-amber-500 focus-within:ring-amber-500',
      textColor: 'text-amber-700 dark:text-amber-400',
      icon: (
        <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      badgeColor: 'bg-amber-50',
      darkBadgeColor: 'dark:bg-amber-950/40'
    },
    {
      label: 'Interested',
      value: currentStats.Interested,
      borderColor: 'border-l-indigo-500 focus-within:ring-indigo-500',
      textColor: 'text-indigo-700 dark:text-indigo-400',
      icon: (
        <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      badgeColor: 'bg-indigo-50',
      darkBadgeColor: 'dark:bg-indigo-950/40'
    },
    {
      label: 'Converted',
      value: currentStats.Converted,
      borderColor: 'border-l-green-500 focus-within:ring-green-500',
      textColor: 'text-green-700 dark:text-green-400',
      icon: (
        <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badgeColor: 'bg-green-50',
      darkBadgeColor: 'dark:bg-green-950/40'
    },
    {
      label: 'Lost',
      value: currentStats.Lost,
      borderColor: 'border-l-red-500 focus-within:ring-red-500',
      textColor: 'text-red-700 dark:text-red-400',
      icon: (
        <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badgeColor: 'bg-red-50',
      darkBadgeColor: 'dark:bg-red-950/40'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-[#121c2f] p-5 border border-gray-100 dark:border-gray-700/60 border-l-4 ${card.borderColor} rounded-xl shadow-xs hover:shadow-md dark:hover:shadow-black/50 hover:-translate-y-0.5 transition-all duration-250 flex flex-col justify-between`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`p-1.5 rounded-lg ${card.badgeColor} ${card.darkBadgeColor}`}>
              {card.icon}
            </div>
          </div>
          <span className={`text-3xl font-extrabold mt-3 tracking-tight ${card.textColor}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
