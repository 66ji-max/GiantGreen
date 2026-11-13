import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut,
  Search,
  Download,
  RefreshCw,
  Mail,
  MessageSquare,
  Building2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import {
  INQUIRY_STATUSES,
  type InquiryRecord,
  type InquiryStats,
  type InquiryStatus,
} from '../types/inquiry';
import { cn } from '../lib/utils';

const STATUS_BADGE_STYLES: Record<InquiryStatus, string> = {
  New: 'bg-accent-orange/15 text-accent-orange border-accent-orange/30',
  Contacted: 'bg-champagne/20 text-espresso-brown border-champagne/50',
  'In Progress': 'bg-amber-100 text-amber-900 border-amber-300',
  Completed: 'bg-eco-green/15 text-eco-green border-eco-green/30',
  Spam: 'bg-charcoal/10 text-charcoal/60 border-charcoal/20',
};

function escapeCsvCell(value: string | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Neutralize CSV formula injection (=, +, -, @)
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    spamCount: 0,
    demoCount: 0,
    contactCount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'demo' | 'contact'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected record for detail drawer
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [editStatus, setEditStatus] = useState<InquiryStatus>('New');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);

  // Verify admin authentication on mount
  useEffect(() => {
    let active = true;

    async function verifyAuth() {
      if (!supabase) {
        if (active) navigate('/admin/login', { replace: true });
        return;
      }

      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.access_token) {
        if (active) navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          await supabase.auth.signOut();
          if (active) navigate('/admin/login', { replace: true });
          return;
        }
        const body = await res.json();
        if (active) {
          setAdminEmail(body.user?.email || session.user.email || '');
          setAccessToken(session.access_token);
          setIsCheckingAuth(false);
        }
      } catch {
        if (active) navigate('/admin/login', { replace: true });
      }
    }

    verifyAuth();

    const { data: authListener } = supabase
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            navigate('/admin/login', { replace: true });
          } else if (session.access_token) {
            setAccessToken(session.access_token);
          }
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const fetchInquiries = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setFetchError(null);

    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        if (supabase) await supabase.auth.signOut();
        navigate('/admin/login', { replace: true });
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || 'Failed to load inquiries.');
      }

      setInquiries(data.inquiries || []);
      if (data.stats) setStats(data.stats);
    } catch (err: any) {
      setFetchError(err.message || 'Unable to fetch inquiries.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, typeFilter, statusFilter, searchQuery, dateFrom, dateTo, navigate]);

  useEffect(() => {
    if (!isCheckingAuth && accessToken) {
      fetchInquiries();
    }
  }, [isCheckingAuth, accessToken, fetchInquiries]);

  const openDetail = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setEditStatus(inquiry.status);
    setEditNotes(inquiry.admin_notes || '');
    setSaveFeedback(null);
  };

  const handleSaveUpdate = async () => {
    if (!selectedInquiry || !accessToken || isSaving) return;
    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: editStatus,
          admin_notes: editNotes,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.inquiry) {
        throw new Error(body?.error || 'Failed to save changes.');
      }

      const updated: InquiryRecord = body.inquiry;
      setSelectedInquiry(updated);
      setSaveFeedback({ type: 'success', text: 'Changes saved to database.' });
      await fetchInquiries();
    } catch (err: any) {
      setSaveFeedback({ type: 'error', text: err.message || 'Could not update inquiry.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetryEmail = async () => {
    if (!selectedInquiry || !accessToken || isRetryingEmail) return;
    setIsRetryingEmail(true);
    setSaveFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/retry-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || 'Email retry request failed.');
      }

      if (body?.inquiry) {
        setSelectedInquiry(body.inquiry);
      }

      if (body?.success) {
        setSaveFeedback({
          type: 'success',
          text: 'Notification email sent successfully to giantgreenecotech@ggetapp.com.',
        });
      } else {
        setSaveFeedback({
          type: 'error',
          text: body?.error || `Email status: ${body?.emailStatus || 'failed'}.`,
        });
      }
      await fetchInquiries();
    } catch (err: any) {
      setSaveFeedback({ type: 'error', text: err.message || 'Failed to retry email.' });
    } finally {
      setIsRetryingEmail(false);
    }
  };

  const handleExportCsv = () => {
    if (inquiries.length === 0) return;
    const headers = [
      'Reference ID',
      'Type',
      'Status',
      'Full Name',
      'Email',
      'Phone',
      'Hotel / Property',
      'Job Title',
      'Country',
      'Hotel Group',
      'Room Count',
      'Preferred Meeting',
      'Message',
      'Privacy Consent',
      'Consent At',
      'Email Notification Status',
      'Admin Notes',
      'Created At',
      'Updated At',
    ];

    const rows = inquiries.map((r) => [
      escapeCsvCell(r.reference_id),
      escapeCsvCell(r.inquiry_type),
      escapeCsvCell(r.status),
      escapeCsvCell(r.full_name),
      escapeCsvCell(r.email),
      escapeCsvCell(r.phone),
      escapeCsvCell(r.company_or_hotel),
      escapeCsvCell(r.job_title),
      escapeCsvCell(r.country),
      escapeCsvCell(r.hotel_group),
      escapeCsvCell(r.room_count),
      escapeCsvCell(r.preferred_meeting_method),
      escapeCsvCell(r.message),
      escapeCsvCell(r.privacy_consent),
      escapeCsvCell(r.privacy_consent_at),
      escapeCsvCell(r.email_notification_status),
      escapeCsvCell(r.admin_notes),
      escapeCsvCell(r.created_at),
      escapeCsvCell(r.updated_at),
    ]);

    const csvContent = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.join(','))].join(
      '\n'
    );
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `giantgreen-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login', { replace: true });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center text-charcoal">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-soft-sand border-t-charcoal rounded-full animate-spin" />
          <p className="text-sm text-charcoal/70 font-medium">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory text-charcoal flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-charcoal text-warm-ivory px-6 md:px-10 py-4 border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl font-semibold tracking-wide text-white">
                GiantGreen
              </span>
              <span className="text-xs px-2.5 py-0.5 bg-champagne/20 text-champagne rounded-full border border-champagne/30 font-medium">
                Admin Portal
              </span>
            </div>
            <p className="text-xs text-soft-sand/75 mt-0.5">
              Signed in as <span className="text-warm-ivory font-medium">{adminEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-soft-sand hover:text-white px-3 py-2 border border-white/15 rounded-full transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* KPI Stats Cards */}
        <section aria-label="Inquiry summary statistics">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 border border-soft-sand/40 rounded-sm shadow-xs">
              <p className="text-xs text-charcoal/60 uppercase tracking-wider font-semibold">Total</p>
              <p className="text-3xl font-serif text-espresso-brown mt-1">{stats.total}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">
                {stats.demoCount} Demo &middot; {stats.contactCount} Contact
              </p>
            </div>
            <div className="bg-white p-5 border border-accent-orange/30 rounded-sm shadow-xs">
              <p className="text-xs text-accent-orange uppercase tracking-wider font-semibold">New</p>
              <p className="text-3xl font-serif text-espresso-brown mt-1">{stats.newCount}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">Awaiting review</p>
            </div>
            <div className="bg-white p-5 border border-soft-sand/40 rounded-sm shadow-xs">
              <p className="text-xs text-warm-bronze uppercase tracking-wider font-semibold">Contacted</p>
              <p className="text-3xl font-serif text-espresso-brown mt-1">{stats.contactedCount}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">Initial outreach sent</p>
            </div>
            <div className="bg-white p-5 border border-soft-sand/40 rounded-sm shadow-xs">
              <p className="text-xs text-amber-800 uppercase tracking-wider font-semibold">In Progress</p>
              <p className="text-3xl font-serif text-espresso-brown mt-1">{stats.inProgressCount}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">Active pilot / call</p>
            </div>
            <div className="bg-white p-5 border border-eco-green/30 rounded-sm shadow-xs">
              <p className="text-xs text-eco-green uppercase tracking-wider font-semibold">Completed</p>
              <p className="text-3xl font-serif text-espresso-brown mt-1">{stats.completedCount}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">Closed / fulfilled</p>
            </div>
            <div className="bg-white p-5 border border-soft-sand/40 rounded-sm shadow-xs">
              <p className="text-xs text-charcoal/50 uppercase tracking-wider font-semibold">Spam</p>
              <p className="text-3xl font-serif text-charcoal/70 mt-1">{stats.spamCount}</p>
              <p className="text-[11px] text-charcoal/50 mt-1">Filtered / invalid</p>
            </div>
          </div>
        </section>

        {/* Filter & Toolbar */}
        <section className="bg-white p-5 border border-soft-sand/40 rounded-sm shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, hotel property, or reference ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-soft-sand/60 bg-warm-ivory/20 focus:bg-white focus:outline-none focus:border-charcoal rounded-sm text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={fetchInquiries}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-soft-sand text-charcoal hover:bg-warm-ivory/50 rounded-sm text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportCsv}
                disabled={inquiries.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-charcoal text-warm-ivory hover:bg-espresso-brown rounded-sm text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({inquiries.length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-soft-sand/20 items-end">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 mb-1">
                Inquiry Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full p-2 border border-soft-sand/60 bg-warm-ivory/20 rounded-sm text-xs focus:outline-none focus:border-charcoal"
              >
                <option value="all">All Types</option>
                <option value="demo">Demo Kit Requests</option>
                <option value="contact">Contact Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-soft-sand/60 bg-warm-ivory/20 rounded-sm text-xs focus:outline-none focus:border-charcoal"
              >
                <option value="all">All Statuses</option>
                {INQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-2 border border-soft-sand/60 bg-warm-ivory/20 rounded-sm text-xs focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full p-2 border border-soft-sand/60 bg-warm-ivory/20 rounded-sm text-xs focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <button
                onClick={resetFilters}
                className="w-full py-2 px-3 border border-soft-sand/60 text-charcoal/70 hover:text-charcoal hover:bg-warm-ivory/40 rounded-sm text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {fetchError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Inquiries List */}
        <section className="bg-white border border-soft-sand/40 rounded-sm shadow-xs overflow-hidden">
          {isLoading && inquiries.length === 0 ? (
            <div className="p-16 text-center text-charcoal/60 text-sm">
              Loading inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <p className="font-serif text-2xl text-espresso-brown">No matching inquiries found</p>
              <p className="text-sm text-charcoal/60">
                Adjust your filters or wait for new Contact and Demo Kit submissions.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-warm-ivory/60 border-b border-soft-sand/40 text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
                      <th className="py-3.5 px-4">Reference ID</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Hotel / Property</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Email Alert</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-sand/30 text-sm">
                    {inquiries.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => openDetail(item)}
                        className="hover:bg-warm-ivory/30 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-espresso-brown whitespace-nowrap">
                          {item.reference_id}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                              item.inquiry_type === 'demo'
                                ? 'bg-espresso-brown text-warm-ivory border-espresso-brown'
                                : 'bg-warm-ivory text-charcoal border-soft-sand'
                            )}
                          >
                            {item.inquiry_type === 'demo' ? 'Demo Kit' : 'Contact'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-charcoal">{item.full_name}</p>
                          <p className="text-xs text-charcoal/60">{item.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.company_or_hotel ? (
                            <>
                              <p className="text-charcoal font-medium">{item.company_or_hotel}</p>
                              <p className="text-xs text-charcoal/60">{item.country || '—'}</p>
                            </>
                          ) : (
                            <span className="text-xs text-charcoal/40">General Inquiry</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                              STATUS_BADGE_STYLES[item.status]
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.email_notification_status === 'sent' && (
                            <span className="inline-flex items-center gap-1 text-xs text-eco-green font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Sent
                            </span>
                          )}
                          {item.email_notification_status === 'failed' && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Failed
                            </span>
                          )}
                          {(item.email_notification_status === 'unconfigured' ||
                            item.email_notification_status === 'pending') && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {item.email_notification_status === 'unconfigured'
                                ? 'Unconfigured'
                                : 'Pending'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-charcoal/65 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString()}{' '}
                          <span className="text-charcoal/45">
                            {new Date(item.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(item);
                            }}
                            className="text-xs font-semibold text-warm-bronze hover:text-espresso-brown underline cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-soft-sand/40">
                {inquiries.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className="p-4 space-y-2.5 active:bg-warm-ivory/40 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-espresso-brown">
                        {item.reference_id}
                      </span>
                      <span
                        className={cn(
                          'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                          STATUS_BADGE_STYLES[item.status]
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{item.full_name}</p>
                      <p className="text-xs text-charcoal/65">{item.email}</p>
                      {item.company_or_hotel && (
                        <p className="text-xs text-warm-bronze mt-0.5 font-medium">
                          {item.company_or_hotel} {item.country ? `(${item.country})` : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-charcoal/55 pt-1">
                      <span>{item.inquiry_type === 'demo' ? 'Demo Kit Request' : 'Contact Inquiry'}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Detail Slide-over Drawer */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex justify-end"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="w-full max-w-xl bg-warm-ivory h-full overflow-y-auto shadow-2xl border-l border-soft-sand flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-white px-6 py-5 border-b border-soft-sand/40 flex items-start justify-between sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-espresso-brown bg-warm-ivory px-2 py-0.5 rounded border border-soft-sand/60">
                    {selectedInquiry.reference_id}
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                      STATUS_BADGE_STYLES[selectedInquiry.status]
                    )}
                  >
                    {selectedInquiry.status}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-charcoal">{selectedInquiry.full_name}</h2>
                <p className="text-xs text-charcoal/60">
                  {selectedInquiry.inquiry_type === 'demo' ? 'Demo Kit Evaluation Request' : 'General Contact Inquiry'}{' '}
                  &middot; Submitted {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close detail panel"
                className="p-2 text-charcoal/60 hover:text-charcoal rounded-full hover:bg-warm-ivory transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Quick Customer Outreach */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: GiantGreen EcoTech Inquiry (${selectedInquiry.reference_id})`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal text-white rounded-full text-xs font-semibold hover:bg-espresso-brown transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply by Email</span>
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-eco-green text-white rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                )}
              </div>

              {/* Customer & Property Details */}
              <div className="bg-white p-5 border border-soft-sand/40 rounded-sm space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-bronze flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Submitted Profile &amp; Property Details</span>
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Email</dt>
                    <dd className="text-charcoal break-all">{selectedInquiry.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Phone / WhatsApp</dt>
                    <dd className="text-charcoal">{selectedInquiry.phone || 'Not provided'}</dd>
                  </div>
                  {selectedInquiry.inquiry_type === 'demo' && (
                    <>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Hotel / Property</dt>
                        <dd className="text-charcoal font-medium">
                          {selectedInquiry.company_or_hotel || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Job Title</dt>
                        <dd className="text-charcoal">{selectedInquiry.job_title || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Country</dt>
                        <dd className="text-charcoal">{selectedInquiry.country || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Hotel Group</dt>
                        <dd className="text-charcoal">{selectedInquiry.hotel_group || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Room Count</dt>
                        <dd className="text-charcoal">{selectedInquiry.room_count || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Preferred Meeting</dt>
                        <dd className="text-charcoal">{selectedInquiry.preferred_meeting_method || '—'}</dd>
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] uppercase text-charcoal/50 font-semibold">Privacy Consent</dt>
                    <dd className="text-xs text-charcoal/80">
                      {selectedInquiry.privacy_consent ? 'Consented' : 'No'}{' '}
                      {selectedInquiry.privacy_consent_at &&
                        `on ${new Date(selectedInquiry.privacy_consent_at).toLocaleString()}`}
                    </dd>
                  </div>
                </dl>

                <div className="pt-3 border-t border-soft-sand/30">
                  <p className="text-[11px] uppercase text-charcoal/50 font-semibold mb-1">Message / Notes</p>
                  <p className="text-sm text-charcoal/85 whitespace-pre-wrap leading-relaxed bg-warm-ivory/30 p-3 rounded-sm border border-soft-sand/30">
                    {selectedInquiry.message || 'No message provided.'}
                  </p>
                </div>
              </div>

              {/* Email Notification Audit & Retry */}
              <div className="bg-white p-5 border border-soft-sand/40 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-bronze">
                    Internal Email Notification
                  </h3>
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                      selectedInquiry.email_notification_status === 'sent'
                        ? 'bg-eco-green/15 text-eco-green border-eco-green/30'
                        : selectedInquiry.email_notification_status === 'failed'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    )}
                  >
                    {selectedInquiry.email_notification_status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Target mailbox: <strong>giantgreenecotech@ggetapp.com</strong>
                  {selectedInquiry.email_sent_at &&
                    ` • Sent at ${new Date(selectedInquiry.email_sent_at).toLocaleString()}`}
                </p>
                {selectedInquiry.email_notification_error && (
                  <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-sm border border-red-200 font-mono break-all">
                    {selectedInquiry.email_notification_error}
                  </p>
                )}
                {selectedInquiry.email_notification_status !== 'sent' && (
                  <button
                    onClick={handleRetryEmail}
                    disabled={isRetryingEmail}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRetryingEmail ? 'Sending Email...' : 'Retry Email Notification'}</span>
                  </button>
                )}
              </div>

              {/* Admin Workflow Update */}
              <div className="bg-white p-5 border border-soft-sand/40 rounded-sm space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-bronze">
                  Status &amp; Internal Follow-Up Notes
                </h3>

                {saveFeedback && (
                  <div
                    className={cn(
                      'p-3 rounded-sm text-xs flex items-start gap-2 border',
                      saveFeedback.type === 'success'
                        ? 'bg-eco-green/10 border-eco-green/30 text-eco-green'
                        : 'bg-red-50 border-red-200 text-red-700'
                    )}
                  >
                    {saveFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{saveFeedback.text}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-charcoal/80 mb-1.5">
                    Processing Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                    className="w-full p-2.5 border border-soft-sand/70 bg-warm-ivory/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
                  >
                    {INQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/80 mb-1.5">
                    Internal Admin Notes (Never visible to customers)
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Record follow-up calls, Demo Kit courier tracking numbers, or pilot feedback..."
                    className="w-full p-3 border border-soft-sand/70 bg-warm-ivory/20 focus:bg-white rounded-sm text-sm focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-charcoal/50">
                    Updated: {new Date(selectedInquiry.updated_at).toLocaleString()}
                  </span>
                  <button
                    onClick={handleSaveUpdate}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-charcoal text-white rounded-full text-xs font-semibold hover:bg-espresso-brown transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
