'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Status badge styling helper
const getStatusStyles = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50 shadow-xs shadow-blue-100/30 dark:shadow-none';
    case 'Contacted':
      return 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50 shadow-xs shadow-amber-100/30 dark:shadow-none';
    case 'Interested':
      return 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/50 shadow-xs shadow-indigo-100/30 dark:shadow-none';
    case 'Converted':
      return 'bg-green-50/80 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/50 shadow-xs shadow-green-100/30 dark:shadow-none';
    case 'Lost':
      return 'bg-red-50/80 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50 shadow-xs shadow-red-100/30 dark:shadow-none';
    default:
      return 'bg-gray-50/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700';
  }
};

const LeadCard = ({ lead, onEdit, onDelete }) => {
  const { _id, name, phone, status, notes = [], createdAt } = lead;
  const [copied, setCopied] = useState(false);

  // Format creation date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format phone number to (XXX) XXX-XXXX for premium look
  const formatPhone = (phoneStr) => {
    if (phoneStr && phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  // Handle phone copy
  const handleCopyPhone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get last note preview
  const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;

  return (
    <div className="bg-white dark:bg-[#121c2f] border border-gray-100/80 dark:border-gray-700/60 rounded-2xl p-6 shadow-xs hover:shadow-lg dark:hover:shadow-black/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative group overflow-hidden">
      
      {/* Background Accent on Card Hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Name and Status Badge */}
        <div className="flex justify-between items-start gap-3">
          <Link href={`/leads/${_id}`} className="hover:text-orange-500 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {name}
            </h3>
          </Link>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>

        {/* Phone details & Copy */}
        <div className="mt-2.5 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <a href={`tel:${phone}`} className="font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              {formatPhone(phone)}
            </a>
          </div>
          
          {/* Clipboard Trigger */}
          <button
            onClick={handleCopyPhone}
            className="p-1 rounded-md text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            title="Copy phone to clipboard"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            )}
          </button>
        </div>

        {/* Last Note Preview */}
        <div className="mt-4 bg-gray-50/50 dark:bg-gray-800/40 rounded-xl p-3.5 border border-gray-100/60 dark:border-gray-800 relative">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-1.5 select-none">
            Last Communication
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {lastNote ? lastNote.text : <span className="text-gray-450 dark:text-gray-550 italic font-normal">No notes logged yet.</span>}
          </p>
        </div>
      </div>

      {/* Footer Details & Actions */}
      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/60 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {formatDate(createdAt)}
        </span>

        {/* Action Triggers */}
        <div className="flex items-center gap-1">
          <Link
            href={`/leads/${_id}`}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-white dark:hover:text-white hover:bg-orange-500 dark:hover:bg-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1.5 rounded-lg transition-all duration-200"
          >
            View
          </Link>
          <button
            onClick={() => onEdit(lead)}
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(lead)}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 bg-transparent px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
export { getStatusStyles };
