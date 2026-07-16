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
    <nav className="bg-white border-b border-gray-100/80 sticky top-0 z-50 shadow-xs backdrop-blur-md bg-white/95 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                L
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight group-hover:text-orange-600 transition-colors">
                Mini Leads <span className="text-orange-500 font-medium">Tracker</span>
              </span>
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            
            {/* User Profile Block */}
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-full pl-3 pr-2 py-1 select-none">
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-gray-400 dark:text-gray-550 font-semibold uppercase tracking-wider leading-none">Representative</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 leading-none">{user?.email}</span>
              </div>
              
              {/* User Initials Badge */}
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-900/50 flex items-center justify-center text-orange-700 dark:text-orange-300 font-bold text-sm">
                {userInitials}
              </div>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={logout}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
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
