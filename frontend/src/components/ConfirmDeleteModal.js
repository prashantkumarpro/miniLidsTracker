'use client';

import React, { useState } from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, leadName, onDeleteConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeleteConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={!isDeleting ? onClose : null}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm mx-auto my-6 p-4 z-10">
        <div className="relative flex flex-col w-full bg-white dark:bg-[#121c2f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl outline-none focus:outline-none overflow-hidden">
          
          {/* Main Warning Icon & Body */}
          <div className="p-6 text-center">
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/30 mb-4">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Content text */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Lead Profile?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete lead <span className="font-semibold text-gray-700 dark:text-gray-200">"{leadName}"</span>? This action is permanent and cannot be undone.
            </p>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 justify-center">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-1/2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="w-1/2 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 border border-transparent rounded-xl text-sm font-medium text-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Lead'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
