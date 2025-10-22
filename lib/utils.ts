import { IComplaint } from '@/models/Complaint';

export function generateTrackingId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GR${timestamp.slice(-6)}${random}`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-500 text-white';
    case 'In Progress':
      return 'bg-blue-500 text-white';
    case 'Resolved':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Resolved':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export const departments = [
  'Education',
  'Healthcare',
  'Transportation',
  'Municipal Services',
  'Police',
  'Revenue',
  'Agriculture',
  'Environment',
  'Other'
];

export const categories = [
  'Infrastructure',
  'Service Delivery',
  'Corruption',
  'Delay in Services',
  'Quality Issues',
  'Billing Problems',
  'Other'
];
