'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../utils/api';
import StatsCards from '../components/StatsCards';
import LeadCard from '../components/LeadCard';
import LeadModal from '../components/LeadModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const STATUS_FILTERS = ['All', 'New', 'Contacted', 'Interested', 'Converted', 'Lost'];

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // API Data States
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Loading / Error states
  const [isLeadsLoading, setIsLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Control States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState(null);

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Redirect on unauthorized access
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on query modify
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch leads function
  const fetchLeads = useCallback(async (pageToFetch = 1) => {
    setIsLeadsLoading(true);
    setLeadsError('');
    try {
      const statusParam = selectedStatus === 'All' ? '' : selectedStatus;
      const endpoint = `/leads?page=${pageToFetch}&limit=10&status=${statusParam}&q=${debouncedSearch}`;
      
      const response = await apiFetch(endpoint, {}, logout);
      
      if (response.success) {
        setLeads(response.data.leads || []);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        setStats(response.data.stats || null);
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        setLeadsError(err.message || 'Failed to fetch leads from server.');
      }
    } finally {
      setIsLeadsLoading(false);
    }
  }, [debouncedSearch, selectedStatus, logout]);

  // Initial and reactive fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads(currentPage);
    }
  }, [isAuthenticated, currentPage, selectedStatus, debouncedSearch, fetchLeads]);

  // Pagination Handlers
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setCurrentPage(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setCurrentPage(pagination.page + 1);
    }
  };

  // Add/Edit Save Handler
  const handleSaveLead = async (leadData, leadId = null) => {
    try {
      if (leadId) {
        // Edit Action
        const response = await apiFetch(`/leads/${leadId}`, {
          method: 'PATCH',
          body: JSON.stringify(leadData)
        }, logout);

        if (response.success) {
          triggerToast('Lead updated successfully!');
          fetchLeads(currentPage);
        }
      } else {
        // Add Action
        const response = await apiFetch('/leads', {
          method: 'POST',
          body: JSON.stringify(leadData)
        }, logout);

        if (response.success) {
          triggerToast('Lead created successfully!');
          setCurrentPage(1); // Go back to first page
          fetchLeads(1);
        }
      }
    } catch (err) {
      throw err; // Form controller will catch it to display details
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!selectedLeadForDelete) return;

    try {
      const response = await apiFetch(`/leads/${selectedLeadForDelete._id}`, {
        method: 'DELETE'
      }, logout);

      if (response.success) {
        triggerToast('Lead profile deleted successfully.');
        // If we deleted the last item on the page, move page back
        if (leads.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchLeads(currentPage);
        }
      }
    } catch (err) {
      if (err.statusCode !== 401) {
        triggerToast(err.message || 'Failed to delete lead.', 'error');
      }
    }
  };

  // UI Open Triggers
  const openAddModal = () => {
    setSelectedLeadForEdit(null);
    setIsLeadModalOpen(true);
  };

  const openEditModal = (lead) => {
    setSelectedLeadForEdit(lead);
    setIsLeadModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLeadForDelete(lead);
    setIsDeleteModalOpen(true);
  };

  // Status Filter Select
  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset page on filter modify
  };

  // Keyboard Shortcut listener for Ctrl+K/Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('leads-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (authLoading) {
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

  // Helper to get count of leads per status dynamically for filter chips
  const getStatusCount = (status) => {
    if (!stats) return 0;
    if (status === 'All') return stats.total || 0;
    return stats[status] || 0;
  };

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

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
            Sales Pipeline Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time pipeline monitoring and lead communication records.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 border border-transparent rounded-xl text-sm font-bold text-white shadow-md hover:shadow-orange-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Lead
        </button>
      </div>

      {/* Statistics Section */}
      <StatsCards stats={stats} />

      {/* Search and Filters Controller */}
      <div className="bg-white/60 dark:bg-[#0c111e]/40 border border-gray-200/30 dark:border-gray-800/40 rounded-2xl p-6 backdrop-blur-md shadow-xs space-y-5">
        
        {/* Top Controls: Search Bar */}
        <div className="max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="leads-search-input"
            type="text"
            placeholder="Search by lead name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-16 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-450 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-[10px] font-bold text-gray-400 dark:text-gray-500 select-none">
                Ctrl K
              </kbd>
            </div>
          )}
        </div>

        {/* Bottom Controls: Filter Chips */}
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 select-none">
            Filter Status Pipeline
          </span>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => {
              const isActive = selectedStatus === status;
              const count = getStatusCount(status);
              return (
                <button
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10'
                      : 'bg-white/60 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200/30 dark:border-gray-800/40 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span>{status}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Leads List Grid */}
      {isLeadsLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : leadsError ? (
        <div className="p-6 text-center border border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 rounded-2xl">
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">{leadsError}</p>
          <button
            onClick={() => fetchLeads(currentPage)}
            className="mt-3 text-xs font-semibold text-red-600 dark:text-red-450 hover:text-red-800 dark:hover:text-red-300 underline cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      ) : leads.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-[#121c2f] border border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Leads Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchQuery || selectedStatus !== 'All' 
              ? "We couldn't find any leads matching the current filter/search inputs." 
              : "Get started by adding your first customer lead profile into the database."}
          </p>
          {(searchQuery || selectedStatus !== 'All') ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
              }}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 border border-transparent rounded-xl text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Add Lead Profile
            </button>
          )}
        </div>
      ) : (
        /* Grid Render */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing page <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.page}</span> of <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.totalPages}</span> ({pagination.total} leads)
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        lead={selectedLeadForEdit}
        onSave={handleSaveLead}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        leadName={selectedLeadForDelete?.name || ''}
        onDeleteConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Dashboard;
