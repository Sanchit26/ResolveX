'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, getStatusBadge } from '@/lib/utils';



interface Complaint {
  _id: string;
  trackingId: string;
  name: string;
  email: string;
  department: string;
  category: string;
  description: string;
  status: string;
  dateFiled: string;
  reply?: string;
  adminReply?: string;
  updatedAt: string;
}

export default function TrackComplaintPage({ params }: { params: { trackingId: string } }) {
  const trackingId = params?.trackingId ?? '';
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackingId) {
      setError('Invalid tracking ID');
      setLoading(false);
      return;
    }

    const fetchComplaint = async () => {
      try {
        const response = await fetch(`/api/complaints/track?trackingId=${trackingId}`);
        const data = await response.json();

        if (response.ok) {
          setComplaint(data.complaint);
        } else {
          setError(data.error || 'Failed to fetch complaint');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [trackingId]);

  if (!trackingId) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-danger-50 to-red-50 text-danger-600">Invalid tracking ID</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-danger-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-danger-100 mb-6">
              <svg className="h-8 w-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complaint Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {error || 'The complaint with this tracking ID could not be found.'}
            </p>
            <div className="space-y-4">
              <Link href="/" className="btn-primary inline-block">
                Back to Home
              </Link>
              <br />
              <Link href="/complaint" className="btn-secondary inline-block">
                File New Complaint
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-primary-600">
                Complaint Tracking
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card">
          {/* Tracking ID Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complaint Details
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600 mb-1">Tracking ID:</p>
              <p className="text-xl font-mono font-bold text-primary-600">
                {complaint.trackingId}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-8">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(complaint.status)}`}>
              Status: {complaint.status}
            </span>
          </div>

          {/* Complaint Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complainant Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{complaint.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{complaint.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-900">{complaint.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-900">{complaint.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date Filed</label>
                  <p className="text-gray-900">{formatDate(new Date(complaint.dateFiled))}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">{formatDate(new Date(complaint.updatedAt))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>

          {/* Admin Reply */}
          {complaint.adminReply && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Reply</h3>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{complaint.adminReply}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/" className="btn-secondary text-center">
              Back to Home
            </Link>
            <Link href="/complaint" className="btn-primary text-center">
              File New Complaint
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

