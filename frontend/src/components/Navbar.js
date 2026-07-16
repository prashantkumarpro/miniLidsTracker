'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  // Extract first letter of email for avatar display
  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

  return (
    <nav className="bg-white/70 dark:bg-[#070b14]/70 border-b border-gray-205/30 dark:border-gray-850/40 sticky top-0 z-50 backdrop-blur-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 group-hover:shadow-orange-500/20 transition-all duration-300">
                F
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors">
                Faster<span className="text-orange-500 font-extrabold">Q</span>
              </span>
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            
            {/* User Profile Block */}
            <div className="flex items-center gap-3 bg-gray-150/40 dark:bg-gray-900/40 border border-gray-200/30 dark:border-gray-800/40 rounded-full pl-3 pr-2 py-1 select-none transition-all hover:bg-gray-150/60 dark:hover:bg-gray-900/60">
              <div className="hidden sm:flex flex-col text-left mr-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider leading-none">Representative</span>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 leading-none">{user?.email}</span>
              </div>
              
              {/* User Initials Badge */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600/10 to-orange-500/15 dark:from-orange-500/10 dark:to-orange-500/5 border border-orange-200/60 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                {userInitials}
              </div>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={logout}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
