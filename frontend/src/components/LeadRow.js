'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Status badge styling helper
const getStatusStyles = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50 shadow-xs shadow-blue-100/30';
    case 'Contacted':
      return 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50 shadow-xs shadow-amber-100/30';
    case 'Interested':
      return 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/50 shadow-xs shadow-indigo-100/30';
    case 'Converted':
      return 'bg-green-50/80 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/50 shadow-xs shadow-green-100/30';
    case 'Lost':
      return 'bg-red-50/80 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/50 shadow-xs shadow-red-100/30';
    default:
      return 'bg-gray-50/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700';
  }
};

// Helper for status dot indicator color
const getStatusDotColor = (status) => {
  switch (status) {
    case 'New': return 'bg-blue-500 shadow-blue-500/50';
    case 'Contacted': return 'bg-amber-500 shadow-amber-500/50';
    case 'Interested': return 'bg-indigo-500 shadow-indigo-500/50';
    case 'Converted': return 'bg-emerald-500 shadow-emerald-500/50';
    case 'Lost': return 'bg-rose-500 shadow-rose-500/50';
    default: return 'bg-gray-400 shadow-gray-400/50';
  }
};

const LeadRow = ({ lead, onEdit, onDelete }) => {
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

  // Format phone number to (XXX) XXX-XXXX
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
    <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/35 transition-colors group">
      {/* Lead Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${getStatusDotColor(status)} shadow-[0_0_8px_currentColor] flex-shrink-0`} />
          <div className="flex flex-col">
            <Link 
              href={`/leads/${_id}`} 
              className="font-bold text-gray-900 dark:text-gray-100 text-sm hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {name}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              <a href={`tel:${phone}`} className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                {formatPhone(phone)}
              </a>
              <button
                onClick={handleCopyPhone}
                className="p-0.5 rounded text-gray-305 dark:text-gray-600 hover:text-gray-650 dark:hover:text-gray-405 cursor-pointer"
                title="Copy phone"
              >
                {copied ? (
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border select-none ${getStatusStyles(status)}`}>
          {status}
        </span>
      </td>

      {/* Last Communication */}
      <td className="px-6 py-4">
        <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 max-w-[280px]">
          {lastNote ? (
            lastNote.text
          ) : (
            <span className="text-gray-400 dark:text-gray-600 italic font-normal">No notes logged yet.</span>
          )}
        </div>
      </td>

      {/* Date Added */}
      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-400 dark:text-gray-500">
        {formatDate(createdAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/leads/${_id}`}
            className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-xs hover:shadow-orange-500/10 cursor-pointer"
          >
            View
          </Link>
          <button
            onClick={() => onEdit(lead)}
            className="text-gray-700 dark:text-gray-300 border border-gray-200/40 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-900 bg-transparent px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(lead)}
            className="text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-955/20 bg-transparent px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeadRow;
