import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Phone, 
  CalendarClock, 
  Edit2, 
  Trash2, 
  Grid, 
  List, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Clock,
  AlertTriangle,
  Users
} from 'lucide-react';
import type { Customer, FollowUpStatus } from '../types/index.ts';
import { db } from '../db/dexie.ts';
import { syncEngine } from '../services/syncEngine.ts';
import { exportCustomersToCSV } from '../services/exportImport.ts';
import { WhatsAppGlyph } from './WhatsAppGlyph.tsx';
import { DueBadge } from './DueBadge.tsx';
import { StatusBadge } from './StatusBadge.tsx';
import { StatusDropdown } from './StatusDropdown.tsx';
import { 
  formatPhone, 
  cleanPhoneForLink, 
  formatDate, 
  formatPatientDisplayId,
  getDueUrgency 
} from '../utils/formatters.ts';
import { TableRowSkeleton, CardSkeleton } from './SkeletonLoader.tsx';

interface PatientsViewProps {
  customers: Customer[];
  isLoading?: boolean;
  onOpenNewPatient: () => void;
  onSelectPatient: (patient: Customer) => void;
  onEditPatient: (patient: Customer) => void;
  onDeletePatient: (patientId: string) => void;
  onSendWhatsApp: (patient: Customer) => void;
  onScheduleFollowUp: (patient: Customer) => void;
  onUpdatePatientStatus?: (patient: Customer, newStatus: FollowUpStatus) => Promise<void> | void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  customers,
  isLoading = false,
  onOpenNewPatient,
  onSelectPatient,
  onEditPatient,
  onDeletePatient,
  onSendWhatsApp,
  onScheduleFollowUp,
  onUpdatePatientStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'overdue' | 'due-today'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Sorting: 'name' or 'nextFollowUp'
  const [sortField, setSortField] = useState<'name' | 'nextFollowUp' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination at 25
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Active action menu row ID and coordinates
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const activePatient = useMemo(
    () => customers.find((c) => c.id === activeMenuId) || null,
    [customers, activeMenuId]
  );

  const handleStatusChange = async (patient: Customer, newStatus: FollowUpStatus) => {
    if (patient.followUpStatus === newStatus) return;

    if (onUpdatePatientStatus) {
      await onUpdatePatientStatus(patient, newStatus);
    } else {
      const now = new Date().toISOString();
      const updated: Customer = {
        ...patient,
        followUpStatus: newStatus,
        updatedAt: now,
        syncStatus: 'pending',
      };
      await db.customers.put(updated);
      await syncEngine.queueChange('customer', updated.id, 'UPDATE', updated);
    }

    if (newStatus === 'scheduled' && !patient.nextFollowUp) {
      onScheduleFollowUp(patient);
    }
  };

  const handleToggleMenu = (patientId: string, buttonEl: HTMLElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === patientId) {
      setActiveMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = buttonEl.getBoundingClientRect();
      const menuWidth = 192; // 12rem (w-48)
      const menuHeight = 145; // ~140px

      // Check if dropdown would extend past bottom of viewport
      const wouldOverflowBottom = rect.bottom + menuHeight + 12 > window.innerHeight;
      const top = wouldOverflowBottom
        ? Math.max(12, rect.top - menuHeight - 4)
        : rect.bottom + 4;

      // Align right of menu with right of button, keeping within window boundaries
      const left = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth));

      setActiveMenuId(patientId);
      setMenuPosition({ top, left });
    }
  };

  // Close action menu on click outside, scroll, resize, or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
        setMenuPosition(null);
      }
    };

    const handleScrollOrResize = () => {
      if (activeMenuId) {
        setActiveMenuId(null);
        setMenuPosition(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenuId]);

  // Distinct specialties list
  const categories = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [customers]);

  // Urgency counts for quick filters
  const overdueCount = useMemo(
    () => customers.filter((c) => getDueUrgency(c.nextFollowUp).urgency === 'overdue').length,
    [customers]
  );
  const dueTodayCount = useMemo(
    () => customers.filter((c) => getDueUrgency(c.nextFollowUp).urgency === 'due-today').length,
    [customers]
  );

  // Filtered patients
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const query = searchTerm.toLowerCase().trim();
      const rawQueryDigits = searchTerm.replace(/\D/g, '');
      const phoneDigits = c.phone.replace(/\D/g, '');

      const matchSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        (rawQueryDigits && phoneDigits.includes(rawQueryDigits)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.notes && c.notes.toLowerCase().includes(query));

      const matchStatus = statusFilter === 'all' || c.followUpStatus === statusFilter;
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const urgencyMatch =
        urgencyFilter === 'all' || getDueUrgency(c.nextFollowUp).urgency === urgencyFilter;

      return matchSearch && matchStatus && matchCategory && urgencyMatch;
    });
  }, [customers, searchTerm, statusFilter, categoryFilter, urgencyFilter]);

  // Sorted patients
  const sortedCustomers = useMemo(() => {
    if (!sortField) return filteredCustomers;

    return [...filteredCustomers].sort((a, b) => {
      if (sortField === 'name') {
        const cmp = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'nextFollowUp') {
        const valA = a.nextFollowUp || '9999-99-99';
        const valB = b.nextFollowUp || '9999-99-99';
        const cmp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [filteredCustomers, sortField, sortDirection]);

  // Reset page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, urgencyFilter, sortField, sortDirection]);

  // Paginated patients (25 per page)
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / pageSize));
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(startIndex, startIndex + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  // Toggle sort helper
  const handleSort = (field: 'name' | 'nextFollowUp') => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setUrgencyFilter('all');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    urgencyFilter !== 'all';

  const handleDeleteWithConfirm = (patient: Customer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    if (
      window.confirm(
        `Are you sure you want to delete ${patient.name}'s records? This action cannot be undone.`
      )
    ) {
      onDeletePatient(patient.id);
    }
  };

  // Helper for initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'P').toUpperCase();
  };

  return (
    <div className="space-y-4">
      
      {/* Toolbar: Single row on desktop */}
      <div className="clinical-card p-3 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          
          {/* Search (grows) */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone (+91...), email, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clinical-input w-full pl-10 h-9 text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="clinical-input h-9 text-xs sm:text-sm font-normal py-1"
              aria-label="Filter by follow-up status"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Specialty filter */}
          {categories.length > 0 && (
            <div className="shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="clinical-input h-9 text-xs sm:text-sm font-normal py-1 max-w-[170px]"
                aria-label="Filter by specialty"
              >
                <option value="all">All specialties</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* List/Grid view toggle */}
          <div className="hidden sm:flex items-center bg-[#F8FAFC] p-0.5 rounded-lg border border-[#E2E8F0] shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#0F766E]' : 'text-[#64748B]'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-[#0F766E]' : 'text-[#64748B]'
              }`}
              title="Card grid view"
              aria-label="Card grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Export secondary button with icon + label */}
          <button
            onClick={() => exportCustomersToCSV()}
            className="btn-secondary h-9 px-3 shrink-0 text-xs sm:text-sm"
            title="Download CSV"
            aria-label="Export CSV"
          >
            <Download className="w-4 h-4 text-[#475569]" />
            <span>Export</span>
          </button>

          {/* Primary Add patient */}
          <button
            onClick={onOpenNewPatient}
            className="btn-primary h-9 px-3.5 shrink-0 text-xs sm:text-sm"
            title="Register new patient"
            aria-label="Add patient"
          >
            <Plus className="w-4 h-4" />
            <span>Add patient</span>
          </button>

        </div>

        {/* Sub-toolbar: Results count + Quick Urgency Pills + Active removable filter chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#F1F5F9] text-xs text-[#64748B]">
          
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing <strong className="font-semibold text-[#0F172A] tabular-nums">
                {sortedCustomers.length === 0
                  ? '0'
                  : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                      currentPage * pageSize,
                      sortedCustomers.length
                    )}`}
              </strong> of <span className="tabular-nums font-semibold text-[#0F172A]">{sortedCustomers.length}</span> patients
              {customers.length !== sortedCustomers.length && (
                <span className="ml-1 text-[#64748B]">({customers.length} total)</span>
              )}
            </span>

            {/* Quick Urgency Filter Pills (Butter Yellow & Soft Pink like website) */}
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setUrgencyFilter('all')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                  urgencyFilter === 'all'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                All
              </button>
              {overdueCount > 0 && (
                <button
                  type="button"
                  onClick={() => setUrgencyFilter(urgencyFilter === 'overdue' ? 'all' : 'overdue')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all border ${
                    urgencyFilter === 'overdue'
                      ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-xs'
                      : 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3] hover:bg-[#FFE4E6]'
                  }`}
                  title="Filter overdue follow-ups"
                >
                  Overdue ({overdueCount})
                </button>
              )}
              {dueTodayCount > 0 && (
                <button
                  type="button"
                  onClick={() => setUrgencyFilter(urgencyFilter === 'due-today' ? 'all' : 'due-today')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all border ${
                    urgencyFilter === 'due-today'
                      ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                      : 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047] hover:bg-[#FEF08A]'
                  }`}
                  title="Filter follow-ups due today"
                >
                  Due today ({dueTodayCount})
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              {searchTerm.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-[#B42318] p-0.5"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {urgencyFilter !== 'all' && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${
                    urgencyFilter === 'overdue'
                      ? 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'
                      : 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047]'
                  }`}
                >
                  <span>Urgency: {urgencyFilter === 'due-today' ? 'Due today' : 'Overdue'}</span>
                  <button
                    onClick={() => setUrgencyFilter('all')}
                    className="hover:opacity-70 p-0.5"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs capitalize">
                  <span>Status: {statusFilter}</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="hover:text-[#B42318] p-0.5"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs">
                  <span>Specialty: {categoryFilter}</span>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className="hover:text-[#B42318] p-0.5"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-[#0F766E] hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patients Display: Table or Grid */}
      {isLoading ? (
        <>
          {/* Desktop Table Skeleton */}
          <div className="hidden md:block clinical-card p-0 overflow-hidden bg-white">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
          {/* Mobile Card Skeleton */}
          <div className="md:hidden space-y-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </>
      ) : sortedCustomers.length === 0 ? (
        
        /* Empty / No-Results State */
        <div className="clinical-card p-12 text-center bg-white">
          <Users className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#0F172A]">No patients found</h3>
          <p className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No patients matched your current search filters.'
              : 'Your clinical patient database has no records registered yet.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2.5">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="btn-secondary"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={onOpenNewPatient}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add first patient</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        
        <div className="space-y-4">
          {/* MOBILE STACKED CARDS (<md, touch targets min 44px, tap-to-call) */}
          <div className="md:hidden divide-y divide-[#E2E8F0] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            {paginatedCustomers.map((c) => {
              const { urgency } = getDueUrgency(c.nextFollowUp);
              const isOverdue = urgency === 'overdue';
              const isToday = urgency === 'due-today';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectPatient(c)}
                  className={`p-4 space-y-3 transition-colors cursor-pointer active:bg-slate-50 ${
                    isOverdue
                      ? 'border-l-[3px] border-l-[#E11D48] bg-[#FFF5F7]/20 hover:bg-[#FFF5F7]/70'
                      : isToday
                      ? 'border-l-[3px] border-l-[#D97706] bg-[#FEFCE8]/20 hover:bg-[#FEFCE8]/70'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                {/* Row 1: Name + DueBadge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-medium text-xs shrink-0 select-none">
                      {getInitials(c.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-[#0F172A] truncate block">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] tabular-nums block">
                        Patient ID {formatPatientDisplayId(c.id)}
                      </span>
                    </div>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleFollowUp(c);
                    }}
                    className="shrink-0 pt-0.5 cursor-pointer"
                    title="Schedule / change follow-up"
                  >
                    <DueBadge date={c.nextFollowUp} />
                  </div>
                </div>

                {/* Row 2: Condition / Reason & Status Dropdown */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between text-xs text-[#475569] gap-2"
                >
                  <span className="truncate">{c.category || 'General consultation'}</span>
                  <StatusDropdown
                    size="sm"
                    status={c.followUpStatus}
                    onChange={(newStatus) => handleStatusChange(c, newStatus)}
                  />
                </div>

                {c.notes && (
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {c.notes}
                  </p>
                )}

                {/* Row 3: Action Row (Touch targets min 44px, tap-to-call) */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                  <a
                    href={`tel:${cleanPhoneForLink(c.phone)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 btn-secondary min-h-[44px] justify-center text-xs text-[#0F172A] font-medium"
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone className="w-4 h-4 text-[#475569] mr-1.5" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendWhatsApp(c);
                    }}
                    className="flex-1 btn-secondary min-h-[44px] justify-center text-xs"
                    aria-label={`Send WhatsApp to ${c.name}`}
                  >
                    <WhatsAppGlyph className="w-4 h-4 text-[#25D366] mr-1.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleFollowUp(c);
                    }}
                    className="btn-secondary min-h-[44px] min-w-[44px] px-3 justify-center text-xs"
                    title="Schedule follow-up"
                    aria-label="Schedule follow-up"
                  >
                    <CalendarClock className="w-4 h-4 text-[#0F766E]" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPatient(c);
                    }}
                    className="btn-secondary min-h-[44px] min-w-[44px] px-3 justify-center text-xs"
                    title="Edit patient"
                    aria-label="Edit patient"
                  >
                    <Edit2 className="w-4 h-4 text-[#475569]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

          {/* DESKTOP TABLE VIEW (hidden on mobile, visible on >=md) */}
          <div className="hidden md:block clinical-card p-0 overflow-hidden bg-white">
            <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              
              {/* Sticky Table Header */}
              <thead className="bg-[#F8FAFC] text-[#64748B] text-xs font-medium uppercase tracking-wider border-b border-[#E2E8F0] sticky top-0 z-10 shadow-xs">
                <tr>
                  {/* Patient Name (Sortable) */}
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 font-medium whitespace-nowrap cursor-pointer hover:text-[#0F172A] select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Patient</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#0F766E]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#0F766E]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                      )}
                    </div>
                  </th>

                  {/* Contact */}
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Contact
                  </th>

                  {/* Condition / Specialty: Plain text */}
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Condition
                  </th>

                  {/* Status: StatusBadge */}
                  <th className="py-3 px-4 font-medium whitespace-nowrap">
                    Status
                  </th>

                  {/* Next follow-up (Sortable) */}
                  <th 
                    onClick={() => handleSort('nextFollowUp')}
                    className="py-3 px-4 font-medium whitespace-nowrap cursor-pointer hover:text-[#0F172A] select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Next follow-up</span>
                      {sortField === 'nextFollowUp' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#0F766E]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#0F766E]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                      )}
                    </div>
                  </th>

                  {/* Actions */}
                  <th className="py-3 px-4 font-medium text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body: Row height ~60px, hover state, whole row clickable */}
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {paginatedCustomers.map((c) => {
                  const isMenuOpen = activeMenuId === c.id;
                  const { urgency } = getDueUrgency(c.nextFollowUp);
                  const isOverdue = urgency === 'overdue';
                  const isToday = urgency === 'due-today';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectPatient(c)}
                      className={`transition-colors cursor-pointer group h-[60px] ${
                        isOverdue
                          ? 'border-l-[3px] border-l-[#E11D48] bg-[#FFF5F7]/20 hover:bg-[#FFF5F7]/70'
                          : isToday
                          ? 'border-l-[3px] border-l-[#D97706] bg-[#FEFCE8]/20 hover:bg-[#FEFCE8]/70'
                          : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {/* Column 1: Patient (32px initials avatar + full name on one line + Patient ID muted below + unsynced icon) */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-medium text-xs shrink-0 select-none">
                            {getInitials(c.name)}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-medium text-[#0F172A] group-hover:text-[#0F766E] transition-colors block truncate max-w-[200px]"
                                title={c.name}
                              >
                                {c.name}
                              </span>

                              {/* Unsynced indicator only if not synced */}
                              {c.syncStatus === 'pending' && (
                                <span title="Waiting to sync with cloud">
                                  <Clock className="w-3.5 h-3.5 text-[#B54708] shrink-0" />
                                </span>
                              )}
                              {c.syncStatus === 'error' && (
                                <span title="Sync failed – retry">
                                  <AlertTriangle className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
                                </span>
                              )}
                            </div>

                            <span className="text-xs text-[#64748B] tabular-nums block mt-0.5">
                              <span className="text-[#64748B]">Patient ID </span>{formatPatientDisplayId(c.id)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Contact (formatted phone, email muted below) */}
                      <td className="py-2.5 px-4 text-xs tabular-nums whitespace-nowrap">
                        <div className="font-medium text-[#0F172A]">
                          {formatPhone(c.phone)}
                        </div>
                        <div className="text-[#64748B] truncate max-w-[170px] mt-0.5" title={c.email || ''}>
                          {c.email || '—'}
                        </div>
                      </td>

                      {/* Column 3: Condition (Plain text, not a chip, truncate with tooltip) */}
                      <td className="py-2.5 px-4 text-xs text-[#475569] whitespace-nowrap">
                        <span className="truncate max-w-[170px] block" title={c.category || 'General consultation'}>
                          {c.category || 'General consultation'}
                        </span>
                      </td>

                      {/* Column 4: Status (Interactive StatusDropdown) */}
                      <td 
                        onClick={(e) => e.stopPropagation()} 
                        className="py-2.5 px-4 whitespace-nowrap"
                      >
                        <StatusDropdown
                          status={c.followUpStatus}
                          onChange={(newStatus) => handleStatusChange(c, newStatus)}
                        />
                      </td>

                      {/* Column 5: Next follow-up (formatted date + DueBadge, clickable to schedule) */}
                      <td 
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleFollowUp(c);
                        }}
                        className="py-2.5 px-4 text-xs whitespace-nowrap cursor-pointer group"
                        title={c.nextFollowUp ? `Change follow-up for ${c.name}` : `Schedule follow-up for ${c.name}`}
                      >
                        {c.nextFollowUp ? (
                          <div className="flex items-center gap-2 group-hover:opacity-85 transition-opacity">
                            <span className="tabular-nums text-[#0F172A] font-medium group-hover:underline underline-offset-2">
                              {formatDate(c.nextFollowUp)}
                            </span>
                            <DueBadge date={c.nextFollowUp} />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group-hover:opacity-85 transition-opacity">
                            <DueBadge date={null} />
                            <span className="text-[11px] text-[#0F766E] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <CalendarClock className="w-3 h-3" />
                              <span>Set date</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Column 6: Actions (2 visible icon buttons + "⋯" menu) */}
                      <td 
                        onClick={(e) => e.stopPropagation()} 
                        className="py-2.5 px-4 text-right whitespace-nowrap"
                      >
                        <div className="flex items-center justify-end gap-1.5 relative">
                          
                          {/* Visible Action 1: WhatsApp */}
                          <button
                            onClick={() => onSendWhatsApp(c)}
                            className="btn-icon w-8 h-8"
                            title={`Send WhatsApp to ${c.name}`}
                            aria-label={`Send WhatsApp to ${c.name}`}
                          >
                            <WhatsAppGlyph className="w-3.5 h-3.5 text-[#25D366]" />
                          </button>

                          {/* Visible Action 2: Call */}
                          <a
                            href={`tel:${cleanPhoneForLink(c.phone)}`}
                            className="btn-icon w-8 h-8"
                            title={`Call ${c.name}`}
                            aria-label={`Call ${c.name}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-[#475569]" />
                          </a>

                          {/* Visible Action 3: "⋯" More Menu */}
                          <button
                            onClick={(e) => handleToggleMenu(c.id, e.currentTarget, e)}
                            className={`btn-icon w-8 h-8 transition-colors ${
                              activeMenuId === c.id ? 'bg-[#F0FDFA] text-[#0F766E] border-[#0F766E]/40 shadow-xs' : ''
                            }`}
                            title="More options"
                            aria-label={`More options for ${c.name}`}
                          >
                            <MoreHorizontal className="w-4 h-4 text-[#475569]" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (Paginate at 25) */}
          <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs text-[#475569]">
            <span className="tabular-nums">
              Page <strong className="font-semibold text-[#0F172A]">{currentPage}</strong> of{' '}
              <strong className="font-semibold text-[#0F172A]">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
                title="Next page"
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      ) : (
        
        /* GRID VIEW (Follows same hierarchy) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCustomers.map((c) => {
              const isMenuOpen = activeMenuId === c.id;
              const { urgency } = getDueUrgency(c.nextFollowUp);
              const isOverdue = urgency === 'overdue';
              const isToday = urgency === 'due-today';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectPatient(c)}
                  className={`clinical-card p-5 space-y-3 transition-all cursor-pointer relative bg-white ${
                    isOverdue
                      ? 'border-l-[3px] border-l-[#E11D48] hover:border-[#FDA4AF] shadow-xs'
                      : isToday
                      ? 'border-l-[3px] border-l-[#D97706] hover:border-[#FDE047] shadow-xs'
                      : 'hover:border-[#CBD5E1]'
                  }`}
                >
                  {/* Top: Avatar + Name + ID + More Menu */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-medium text-xs shrink-0 select-none">
                        {getInitials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 
                            className="font-medium text-[#0F172A] text-sm hover:text-[#0F766E] truncate max-w-[160px]"
                            title={c.name}
                          >
                            {c.name}
                          </h4>
                          {c.syncStatus === 'pending' && (
                            <span title="Waiting to sync">
                              <Clock className="w-3 h-3 text-[#B54708]" />
                            </span>
                          )}
                          {c.syncStatus === 'error' && (
                            <span title="Sync failed – retry">
                              <AlertTriangle className="w-3 h-3 text-[#B42318]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                          <span className="text-[#64748B]">Patient ID </span>{formatPatientDisplayId(c.id)}
                        </p>
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleMenu(c.id, e.currentTarget, e)}
                        className={`btn-icon min-h-[44px] min-w-[44px] w-10 h-10 transition-colors ${
                          activeMenuId === c.id ? 'bg-[#F0FDFA] text-[#0F766E] border-[#0F766E]/40 shadow-xs' : ''
                        }`}
                        title="Options"
                        aria-label={`Options for ${c.name}`}
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                      </button>
                    </div>
                  </div>

                  {/* Contact & Plain Text Condition */}
                  <div className="text-xs text-[#475569] space-y-1">
                    <p className="tabular-nums font-medium text-[#0F172A]">
                      {formatPhone(c.phone)}
                    </p>
                    <p className="text-[#64748B] truncate" title={c.category || 'General consultation'}>
                      {c.category || 'General consultation'}
                    </p>
                  </div>

                  {/* Status & Next follow-up */}
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs"
                  >
                    <StatusDropdown
                      size="sm"
                      status={c.followUpStatus}
                      onChange={(newStatus) => handleStatusChange(c, newStatus)}
                    />
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleFollowUp(c);
                      }}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      title="Schedule / change follow-up"
                    >
                      <DueBadge date={c.nextFollowUp} />
                    </div>
                  </div>

                  {/* Action row with min 44px touch targets on mobile */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="pt-2 border-t border-[#F1F5F9] flex items-center justify-end gap-2"
                  >
                    <button
                      onClick={() => onSendWhatsApp(c)}
                      className="btn-icon min-h-[44px] min-w-[44px] w-10 h-10"
                      title="WhatsApp"
                      aria-label={`Send WhatsApp to ${c.name}`}
                    >
                      <WhatsAppGlyph className="w-4 h-4 text-[#25D366]" />
                    </button>
                    <a
                      href={`tel:${cleanPhoneForLink(c.phone)}`}
                      className="btn-icon min-h-[44px] min-w-[44px] w-10 h-10"
                      title="Call"
                      aria-label={`Call ${c.name}`}
                    >
                      <Phone className="w-4 h-4 text-[#475569]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid View Pagination */}
          <div className="p-4 clinical-card bg-white flex items-center justify-between text-xs text-[#475569]">
            <span className="tabular-nums">
              Page <strong className="font-semibold text-[#0F172A]">{currentPage}</strong> of{' '}
              <strong className="font-semibold text-[#0F172A]">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary h-8 px-2.5 text-xs disabled:opacity-40 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Floating Action Menu (Fixed, on top of EVERYTHING, never clipped) */}
      {activePatient && menuPosition && (
        <div
          ref={menuDropdownRef}
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 99999,
          }}
          className="w-48 bg-white border border-[#CBD5E1] rounded-xl shadow-2xl py-1 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setActiveMenuId(null);
              setMenuPosition(null);
              onScheduleFollowUp(activePatient);
            }}
            className="w-full px-3.5 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F0FDFA] hover:text-[#0F766E] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <CalendarClock className="w-4 h-4 text-[#0F766E]" />
            <span>Schedule follow-up</span>
          </button>

          <button
            onClick={() => {
              setActiveMenuId(null);
              setMenuPosition(null);
              onEditPatient(activePatient);
            }}
            className="w-full px-3.5 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-[#475569]" />
            <span>Edit patient</span>
          </button>

          <div className="border-t border-[#F1F5F9] my-1" />

          <button
            onClick={(e) => {
              setActiveMenuId(null);
              setMenuPosition(null);
              handleDeleteWithConfirm(activePatient, e);
            }}
            className="w-full px-3.5 py-2 text-xs font-medium text-[#B42318] hover:bg-[#FEF3F2] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[#B42318]" />
            <span>Delete patient</span>
          </button>
        </div>
      )}

    </div>
  );
};
