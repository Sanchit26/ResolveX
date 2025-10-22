
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import DashboardPage from '@/components/admin/DashboardPage';
import AnalyticsPage from '@/components/admin/AnalyticsPage';
import SettingsPage from '@/components/admin/SettingsPage';
import AdminPage from '@/components/admin/AdminPage';
import ComplaintDetailsModal from '@/components/admin/ComplaintDetailsModal';
import {
  Complaint,
  ComplaintHistoryEntry,
  ComplaintPriority,
  ComplaintStatus,
} from '@/components/admin/types';

type Page = 'Dashboard' | 'Analytics' | 'Settings' | 'Admin';

type ApiComplaint = Record<string, unknown>;

const STATUS_FALLBACK = ComplaintStatus.Pending;

const normalizeStatus = (value: unknown): ComplaintStatus => {
  if (typeof value !== 'string') {
    return STATUS_FALLBACK;
  }

  const normalized = value.trim();
  switch (normalized) {
    case ComplaintStatus.Pending:
      return ComplaintStatus.Pending;
    case ComplaintStatus.InProgress:
    case 'In-Progress':
    case 'In progress':
      return ComplaintStatus.InProgress;
    case ComplaintStatus.Resolved:
      return ComplaintStatus.Resolved;
    case ComplaintStatus.Rejected:
      return ComplaintStatus.Rejected;
    default:
      return STATUS_FALLBACK;
  }
};

const normalizePriority = (value: unknown): ComplaintPriority => {
  const allowed: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  if (typeof value === 'string' && allowed.includes(value as ComplaintPriority)) {
    return value as ComplaintPriority;
  }
  return 'Medium';
};

const toIsoString = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
};

const toOptionalSentiment = (
  value: unknown,
): 'positive' | 'negative' | 'neutral' | undefined => {
  if (value === 'positive' || value === 'negative' || value === 'neutral') {
    return value;
  }
  return undefined;
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (value == null) {
    return [];
  }
  return [String(value)];
};

const toHistoryEntries = (
  rawHistory: unknown,
  fallbackStatus: ComplaintStatus,
  submittedAt: string,
  submittedBy: string,
): ComplaintHistoryEntry[] => {
  if (Array.isArray(rawHistory) && rawHistory.length > 0) {
    return rawHistory.reduce<ComplaintHistoryEntry[]>((acc, entry) => {
      if (!entry || typeof entry !== 'object') {
        return acc;
      }

      const typed = entry as Partial<ComplaintHistoryEntry> & { timestamp?: string; status?: string };
      acc.push({
        timestamp: toIsoString(typed.timestamp ?? submittedAt),
        status: normalizeStatus(typed.status ?? fallbackStatus),
        notes: typed.notes,
        updatedBy: typed.updatedBy,
      });
      return acc;
    }, []);
  }

  return [
    {
      timestamp: submittedAt,
      status: fallbackStatus,
      notes: 'Complaint submitted',
      updatedBy: submittedBy || 'Citizen',
    },
  ];
};

const mapComplaintFromApi = (input: ApiComplaint): Complaint => {
  const status = normalizeStatus(input?.status);
  const dateFiled = toIsoString(input?.dateFiled ?? input?.createdAt);
  const updatedAt = toIsoString(input?.updatedAt ?? dateFiled);

  return {
    _id: String(input?._id ?? ''),
    trackingId: String(input?.trackingId ?? ''),
    name: String(input?.name ?? 'Unknown citizen'),
    email: String(input?.email ?? ''),
    department: String(input?.department ?? 'General'),
    category: String(input?.category ?? 'General'),
    description: String(input?.description ?? ''),
    status,
    priority: normalizePriority(input?.priority),
    dateFiled,
    updatedAt,
    reply: toOptionalString(input?.reply),
    adminReply: toOptionalString(input?.adminReply),
    sentiment: toOptionalSentiment(input?.sentiment),
    keywords: toStringArray(input?.keywords),
    urgency: typeof input?.urgency === 'number' ? input.urgency : undefined,
    complexity: typeof input?.complexity === 'number' ? input.complexity : undefined,
    images: toStringArray(input?.images),
    documents: toStringArray(input?.documents),
    viewCount: typeof input?.viewCount === 'number' ? input.viewCount : undefined,
    responseTime: typeof input?.responseTime === 'number' ? input.responseTime : undefined,
    satisfaction: typeof input?.satisfaction === 'number' ? input.satisfaction : undefined,
    assignedTo: toOptionalString(input?.assignedTo),
    estimatedResolution: input?.estimatedResolution
      ? toIsoString(input.estimatedResolution)
      : undefined,
    tags: toStringArray(input?.tags),
    escalationLevel: typeof input?.escalationLevel === 'number' ? input.escalationLevel : undefined,
    escalationReason: toOptionalString(input?.escalationReason),
    escalatedAt: input?.escalatedAt ? toIsoString(input.escalatedAt) : undefined,
    history: toHistoryEntries(input?.history, status, dateFiled, String(input?.name ?? 'Citizen')),
  };
};

export default function AdminDashboardUnified() {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | 'All'>('All');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchComplaints = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await fetch('/api/complaints?limit=250', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const rawComplaints = Array.isArray(payload?.complaints) ? payload.complaints : [];
      const mapped = rawComplaints.map((item: ApiComplaint) => mapComplaintFromApi(item));

      setComplaints(mapped);
      setSelectedComplaint((current) => {
        if (!current) {
          return null;
        }
        return mapped.find((complaint: Complaint) => complaint._id === current._id) ?? null;
      });
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      const message = err instanceof Error ? err.message : 'Unable to load complaints.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(() => fetchComplaints(false), 30_000);
    return () => clearInterval(interval);
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return complaints.filter((complaint) => {
      const matchesFilter =
        activeFilter === 'All' ? true : complaint.status === activeFilter;
      const matchesSearch = !lowerSearch
        ? true
        : [
            complaint.name,
            complaint.email,
            complaint.trackingId,
            complaint.category,
            complaint.department,
            complaint.description,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(lowerSearch));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, complaints, searchTerm]);

  const handleSelectComplaint = useCallback((complaint: Complaint) => {
    setSelectedComplaint(complaint);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedComplaint(null);
  }, []);

  const handleUpdateStatus = useCallback(
    async (
      complaintId: string,
      trackingId: string,
      newStatus: ComplaintStatus,
      notes: string,
    ) => {
      const timestamp = new Date().toISOString();
      const historyEntry: ComplaintHistoryEntry = {
        timestamp,
        status: newStatus,
        notes,
        updatedBy: 'Admin',
      };

      setComplaints((previous) =>
        previous.map((complaint) => {
          if (complaint._id !== complaintId && complaint.trackingId !== trackingId) {
            return complaint;
          }

          const nextHistory = [...(complaint.history ?? []), historyEntry];

          return {
            ...complaint,
            status: newStatus,
            updatedAt: timestamp,
            history: nextHistory,
          };
        }),
      );

      setSelectedComplaint((current) => {
        if (!current || (current._id !== complaintId && current.trackingId !== trackingId)) {
          return current;
        }

        const nextHistory = [...(current.history ?? []), historyEntry];

        return {
          ...current,
          status: newStatus,
          updatedAt: timestamp,
          history: nextHistory,
        };
      });

      try {
        const response = await fetch(`/api/complaints/${complaintId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, notes, updatedBy: 'Admin' }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const updatedFromApi = payload?.complaint ? mapComplaintFromApi(payload.complaint) : null;

        if (updatedFromApi) {
          setComplaints((previous) =>
            previous.map((complaint) => {
              if (complaint._id !== complaintId) {
                return complaint;
              }

              return {
                ...updatedFromApi,
                history: complaint.history,
              };
            }),
          );

          setSelectedComplaint((current) => {
            if (!current || current._id !== complaintId) {
              return current;
            }

            return {
              ...updatedFromApi,
              history: current.history,
            };
          });
        } else {
          fetchComplaints(false);
        }
      } catch (err) {
        console.error('Failed to persist status update:', err);
        setError((previous) => previous ?? 'Failed to update complaint status. Please try again.');
        fetchComplaints(false);
      }
    },
    [fetchComplaints],
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-6 shadow-sm">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {lastUpdated && <span>Last updated {new Date(lastUpdated).toLocaleString()}</span>}
            <button
              type="button"
              onClick={() => fetchComplaints(false)}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-gray-600 shadow-sm transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing…' : 'Refresh data'}
            </button>
          </div>
        </div>
        <main className="flex-1 space-y-8 bg-gray-50 p-6 lg:p-10">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Something went wrong.</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => fetchComplaints()}
                className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading && complaints.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              Loading complaints from MongoDB…
            </div>
          ) : (
            <>
              {activePage === 'Dashboard' && (
                <DashboardPage
                  complaints={complaints}
                  filteredComplaints={filteredComplaints}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  onSelectComplaint={handleSelectComplaint}
                />
              )}
              {activePage === 'Analytics' && <AnalyticsPage complaints={complaints} />}
              {activePage === 'Settings' && <SettingsPage />}
              {activePage === 'Admin' && <AdminPage />}
            </>
          )}
        </main>
      </div>
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

