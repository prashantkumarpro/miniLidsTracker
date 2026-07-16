'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../utils/api';
import { getStatusStyles } from '../../../components/LeadCard';
import dynamic from 'next/dynamic';

const LeadModal = dynamic(() => import('../../../components/LeadModal'), { ssr: false });
const ConfirmDeleteModal = dynamic(() => import('../../../components/ConfirmDeleteModal'), { ssr: false });

const LEAD_STATUS_VALUES = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

const LeadDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Core Data States
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Interaction States
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Modals Controller
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Fetch lead details
  const fetchLeadDetails = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiFetch(`/leads/${id}`, {}, logout);
      if (response.success) {
        setLead(response.data);
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        setError(err.message || 'Failed to retrieve lead details.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, logout]);

  // Auth Guard & Initial Fetch
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchLeadDetails();
    }
  }, [isAuthenticated, id, fetchLeadDetails]);

  // Status Change handler
  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;
    setIsUpdatingStatus(true);
    try {
      const response = await apiFetch(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      }, logout);

      if (response.success) {
        setLead(response.data);
        triggerToast(`Status updated to ${newStatus}!`);
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        triggerToast(err.message || 'Failed to update status', 'error');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Add Note handler
  const handleAddNote = async (e) => {
    e.preventDefault();
    setNoteError('');

    if (!newNoteText.trim()) {
      setNoteError('Note content cannot be empty.');
      return;
    }

    if (newNoteText.trim().length < 2 || newNoteText.trim().length > 500) {
      setNoteError('Note must be between 2 and 500 characters.');
      return;
    }

    setIsSubmittingNote(true);
    try {
      const response = await apiFetch(`/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ text: newNoteText.trim() })
      }, logout);

      if (response.success) {
        setLead(response.data);
        setNewNoteText('');
        triggerToast('Note added successfully!');
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        setNoteError(err.message || 'Failed to add note.');
      }
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Edit Lead callback save
  const handleEditSave = async (leadData) => {
    const response = await apiFetch(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(leadData)
    }, logout);

    if (response.success) {
      setLead(response.data);
      triggerToast('Lead profile updated successfully!');
    }
  };

  // Delete Lead confirmation trigger
  const handleDeleteConfirm = async () => {
    try {
      const response = await apiFetch(`/leads/${id}`, {
        method: 'DELETE'
      }, logout);

      if (response.success) {
        // Redirect to dashboard on delete success
        router.push('/');
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        triggerToast(err.message || 'Failed to delete lead.', 'error');
      }
    }
  };

  // Date Formatting Helper
  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phoneStr) => {
    if (phoneStr && phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (error || !lead) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-red-100 p-8 rounded-2xl text-center max-w-lg mx-auto">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Lead</h3>
          <p className="text-sm text-gray-500 mb-6">{error || 'Lead profile not found.'}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 border border-transparent rounded-xl text-sm font-medium text-white shadow-xs"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl border shadow-lg transition-transform ${
          toast.type === 'error' 
            ? 'bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50' 
            : 'bg-green-50 dark:bg-green-950/80 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50'
        }`}>
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors uppercase tracking-wider gap-1 select-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Title Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-[#0c111e]/50 border border-gray-200/30 dark:border-gray-800/40 p-4 sm:p-6 rounded-2xl backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">{lead.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border select-none ${getStatusStyles(lead.status)}`}>
              {lead.status}
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 select-all">Lead ID: {lead._id}</p>
        </div>
        
        {/* Buttons Panel */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 border border-gray-200/50 dark:border-gray-800/60 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            Delete Lead
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Lead Info Card */}
        <div className="lg:col-span-1 bg-white/70 dark:bg-[#0c111e]/50 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xs space-y-6">
          <h2 className="text-sm font-extrabold text-gray-950 dark:text-white border-b border-gray-100/50 dark:border-gray-800/40 pb-3 uppercase tracking-wider select-none">
            Lead Information
          </h2>

          <div className="space-y-4">
            
            {/* Phone Info */}
            <div>
              <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 select-none">
                Phone Number
              </span>
              <a href={`tel:${lead.phone}`} className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                {formatPhone(lead.phone)}
              </a>
            </div>

            {/* Quick Status Setter */}
            <div>
              <label htmlFor="details-status" className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 select-none">
                Pipeline Status
              </label>
              <div className="relative mt-1">
                <select
                  id="details-status"
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full px-3.5 py-2 border border-gray-200/45 dark:border-gray-800/60 rounded-xl text-sm bg-white dark:bg-gray-900/60 text-gray-800 dark:text-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 appearance-none disabled:opacity-50"
                >
                  {LEAD_STATUS_VALUES.map((statusVal) => (
                    <option key={statusVal} value={statusVal} className="dark:bg-[#0c111e] dark:text-white font-semibold text-sm">
                      {statusVal}
                    </option>
                  ))}
                </select>
                {isUpdatingStatus && (
                  <div className="absolute right-2.5 top-2.5">
                    <svg className="animate-spin h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Date Created */}
            <div>
              <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 select-none">
                Created On
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatFullDate(lead.createdAt)}
              </span>
            </div>

            {/* Date Updated */}
            <div>
              <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 select-none">
                Last Updated
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatFullDate(lead.updatedAt)}
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Notes History Timeline & Add Note Box */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add Note Panel */}
          <div className="bg-white/70 dark:bg-[#0c111e]/50 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xs">
            <h2 className="text-sm font-extrabold text-gray-950 dark:text-white border-b border-gray-100/50 dark:border-gray-800/40 pb-3 mb-4 uppercase tracking-wider select-none">
              Add Interaction Note
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              {noteError && (
                <div className="p-2.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-lg text-xs text-red-700 dark:text-red-400">
                  {noteError}
                </div>
              )}
              
              <textarea
                rows="3"
                value={newNoteText}
                onChange={(e) => {
                  setNewNoteText(e.target.value);
                  if (noteError) setNoteError('');
                }}
                disabled={isSubmittingNote}
                placeholder="Type communication details here (e.g. Call logs, callback scheduling)..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all bg-white dark:bg-gray-900/60 text-gray-950 dark:text-white placeholder:text-gray-405 dark:placeholder:text-gray-550"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold select-none">
                  {newNoteText.trim().length} / 500 characters
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 border border-transparent rounded-xl text-sm font-bold text-white shadow-xs hover:shadow-orange-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingNote ? 'Saving note...' : 'Submit Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Timeline History */}
          <div className="bg-white/70 dark:bg-[#0c111e]/50 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xs">
            <h2 className="text-sm font-extrabold text-gray-950 dark:text-white border-b border-gray-100/50 dark:border-gray-800/40 pb-3 mb-6 uppercase tracking-wider select-none">
              Activity History ({lead.notes.length})
            </h2>

            {lead.notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500 italic font-semibold">No notes recorded for this lead yet.</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {lead.notes.slice().reverse().map((note, index) => {
                    const isLast = index === lead.notes.length - 1;
                    return (
                      <li key={note._id}>
                         <div className="relative pb-8">
                          {/* Vertical Connector Line */}
                          {!isLast && (
                            <span 
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-800/80" 
                              aria-hidden="true" 
                            />
                          )}

                          <div className="relative flex space-x-3">
                            
                            {/* Dot Icon */}
                            <div>
                              <span className="h-10 w-10 rounded-full bg-orange-100/60 dark:bg-orange-950/40 border border-orange-200/50 dark:border-orange-500/10 flex items-center justify-center ring-8 ring-[#fafbfc] dark:ring-[#070b14]">
                                <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </span>
                            </div>

                            {/* Note Content */}
                            <div className="flex-1 min-w-0 bg-white/50 dark:bg-gray-900/35 border border-gray-200/20 dark:border-gray-800/30 rounded-2xl p-4 sm:p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {note.text}
                              </p>
                              <div className="mt-3 text-right">
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                  {formatFullDate(note.createdAt)}
                                </span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={lead}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        leadName={lead.name}
        onDeleteConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default LeadDetailsPage;
