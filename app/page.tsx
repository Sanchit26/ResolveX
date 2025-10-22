'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/track/${trackingId.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <Image src="/resolvex-logo.svg" alt="ResolveX" width={32} height={32} priority className="h-8 w-8" />
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                <span className="text-blue-600">Resolve</span>
                <span className="text-black">X</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">ResolveX</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, transparent, and AI-powered issue resolution. File a complaint or track your case in seconds.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* File Complaint Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-xl bg-blue-50 mb-5">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">File Complaint</h3>
              <p className="text-gray-600 mb-6">Create a new ticket via AI or manual mode. Get an instant tracking ID.</p>
              <Link href="/complaint" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700">
                File Complaint
              </Link>
            </div>
          </div>

          {/* Track Order Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-xl bg-gray-100 mb-5">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Order</h3>
              <p className="text-gray-600 mb-6">Enter your tracking ID to view live status and updates.</p>
              <form onSubmit={handleTrackComplaint} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter Tracking ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="submit" className="w-full inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-white font-medium hover:bg-gray-900">
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* About Us */}
        <section className="max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">About Us</h3>
            <p className="text-gray-600 leading-relaxed">
              ResolveX is a unified platform built for speed and clarity. With AI-driven assistance, smart routing, and transparent tracking, we help organizations resolve issues faster while keeping users informed at every step.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} ResolveX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}



