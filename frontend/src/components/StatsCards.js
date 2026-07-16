'use client';

import React, { useRef } from 'react';

const StatsCards = ({ stats }) => {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
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
      textColor: 'text-gray-950 dark:text-white',
      icon: (
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badgeColor: 'bg-gray-100/80',
      darkBadgeColor: 'dark:bg-gray-800/60',
      glowColor: 'group-hover:shadow-gray-500/5',
      subtext: 'Pipeline lifetime leads',
      barColor: 'bg-gray-400 dark:bg-gray-500'
    },
    {
      label: 'New',
      value: currentStats.New,
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      badgeColor: 'bg-blue-50/80',
      darkBadgeColor: 'dark:bg-blue-950/40',
      glowColor: 'group-hover:shadow-blue-500/10',
      subtext: 'Awaiting initial contact',
      barColor: 'bg-blue-500'
    },
    {
      label: 'Contacted',
      value: currentStats.Contacted,
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: (
        <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      badgeColor: 'bg-amber-50/80',
      darkBadgeColor: 'dark:bg-amber-950/40',
      glowColor: 'group-hover:shadow-amber-500/10',
      subtext: 'In discussion phase',
      barColor: 'bg-amber-500'
    },
    {
      label: 'Interested',
      value: currentStats.Interested,
      textColor: 'text-indigo-600 dark:text-indigo-400',
      icon: (
        <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      badgeColor: 'bg-indigo-50/80',
      darkBadgeColor: 'dark:bg-indigo-950/40',
      glowColor: 'group-hover:shadow-indigo-500/10',
      subtext: 'High-intent opportunities',
      barColor: 'bg-indigo-500'
    },
    {
      label: 'Converted',
      value: currentStats.Converted,
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: (
        <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badgeColor: 'bg-emerald-50/80',
      darkBadgeColor: 'dark:bg-emerald-950/40',
      glowColor: 'group-hover:shadow-emerald-500/10',
      subtext: 'Successfully closed deals',
      barColor: 'bg-emerald-500'
    },
    {
      label: 'Lost',
      value: currentStats.Lost,
      textColor: 'text-rose-600 dark:text-rose-450',
      icon: (
        <svg className="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badgeColor: 'bg-rose-50/80',
      darkBadgeColor: 'dark:bg-rose-950/40',
      glowColor: 'group-hover:shadow-rose-500/10',
      subtext: 'Archived / Unconverted',
      barColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="relative group/stats select-none">
      
      {/* Left Arrow Controller */}
      <button
        type="button"
        onClick={() => scrollCarousel('left')}
        className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/90 border border-gray-800/80 text-white items-center justify-center shadow-lg hover:bg-orange-500 hover:border-orange-500 hover:scale-105 active:scale-95 opacity-0 group-hover/stats:opacity-100 transition-all duration-300 cursor-pointer"
        title="Scroll Left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow Controller */}
      <button
        type="button"
        onClick={() => scrollCarousel('right')}
        className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/90 border border-gray-800/80 text-white items-center justify-center shadow-lg hover:bg-orange-500 hover:border-orange-500 hover:scale-105 active:scale-95 opacity-0 group-hover/stats:opacity-100 transition-all duration-300 cursor-pointer"
        title="Scroll Right"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Stats Scroll Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-3 scrollbar-none select-none w-full -mx-3 px-3 lg:mx-0 lg:px-0 scroll-smooth"
      >
        {cards.map((card, index) => {
          // Calculate ratio percentage relative to total leads
          const percentage = currentStats.total > 0 ? Math.round((card.value / currentStats.total) * 100) : 0;
          const isTotalCard = card.label === 'Total Leads';

          return (
            <div
              key={index}
              className={`min-w-[155px] sm:min-w-[200px] lg:min-w-[220px] flex-shrink-0 bg-white/70 dark:bg-[#0c111e]/60 border border-gray-200/30 dark:border-gray-800/40 p-4 sm:p-5 lg:p-6 rounded-2xl shadow-xs hover:border-gray-300 dark:hover:border-gray-700/60 hover:-translate-y-1 hover:shadow-md ${card.glowColor} transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
            >
              {/* Top Border Accent */}
              <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-300 opacity-20 group-hover:opacity-100 ${card.barColor}`} />

              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.badgeColor} ${card.darkBadgeColor} transition-transform duration-300 group-hover:scale-105`}>
                  {card.icon}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${card.textColor}`}>
                    {card.value}
                  </span>
                  {!isTotalCard && card.value > 0 && (
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-550">
                      {percentage}%
                    </span>
                  )}
                </div>

                {/* Subtext description */}
                <span className="block text-[10px] font-medium text-gray-400 dark:text-gray-550 mt-1 select-none leading-tight">
                  {card.subtext}
                </span>

                {/* Metric Ratio Bar */}
                {!isTotalCard && (
                  <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-3 select-none">
                    <div 
                      className={`h-full ${card.barColor} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;
