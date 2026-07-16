'use client';

import React, { useState, useEffect } from 'react';
import { LEAD_STATUSES } from '../context/AuthContext'; // Or import from constant

const LEAD_STATUS_VALUES = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

const LeadModal = ({ isOpen, onClose, lead = null, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');
  
  // Validation / Loading States
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Reset or populate fields when modal opens/leads changes
  useEffect(() => {
    if (lead) {
      setName(lead.name || '');
      setPhone(lead.phone || '');
      setStatus(lead.status || 'New');
    } else {
      setName('');
      setPhone('');
      setStatus('New');
    }
    setErrors({});
    setServerError('');
  }, [lead, isOpen]);

  if (!isOpen) return null;

  // Validate form inputs
  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (name.trim().length < 2 || name.trim().length > 60) {
      tempErrors.name = 'Name must be between 2 and 60 characters';
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      tempErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!LEAD_STATUS_VALUES.includes(status)) {
      tempErrors.status = 'Invalid status selected';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const leadData = { name: name.trim(), phone: phone.trim(), status };
      await onSave(leadData, lead?._id);
      onClose();
    } catch (err) {
      // Map API validation errors if returned from backend
      if (err.errors && Array.isArray(err.errors)) {
        const formErrors = {};
        err.errors.forEach(eVal => {
          formErrors[eVal.field] = eVal.message;
        });
        setErrors(formErrors);
      }
      setServerError(err.message || 'Failed to save lead. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={!isLoading ? onClose : null}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-auto my-6 p-4 z-10">
        <div className="relative flex flex-col w-full bg-white dark:bg-[#121c2f] border border-gray-100 dark:border-gray-850 rounded-2xl shadow-xl outline-none focus:outline-none overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {lead ? 'Edit Lead Details' : 'Add New Lead'}
            </h3>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {/* Server-side / General Errors */}
              {serverError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-xs text-red-700 dark:text-red-400">
                  {serverError}
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="modal-name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="modal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="modal-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={isLoading}
                  placeholder="e.g. 9876543210 (10 digits)"
                  className={`w-full px-3.5 py-2 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.phone 
                      ? 'border-red-300 dark:border-red-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Status Dropdown */}
              <div>
                <label htmlFor="modal-status" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Lead Status
                </label>
                <select
                  id="modal-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-all appearance-none ${
                    errors.status 
                      ? 'border-red-300 dark:border-red-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                >
                  {LEAD_STATUS_VALUES.map((statusVal) => (
                    <option key={statusVal} value={statusVal} className="dark:bg-gray-900 dark:text-white">
                      {statusVal}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.status}</p>
                )}
              </div>

            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 border border-transparent rounded-xl text-sm font-medium text-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  lead ? 'Save Changes' : 'Create Lead'
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LeadModal;
