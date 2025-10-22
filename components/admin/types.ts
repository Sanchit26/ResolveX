export enum ComplaintStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ComplaintHistoryEntry {
  timestamp: string;
  status: ComplaintStatus;
  notes?: string;
  updatedBy?: string;
}

export interface Complaint {
  _id: string;
  trackingId: string;
  name: string;
  email: string;
  department: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  dateFiled: string;
  updatedAt: string;
  reply?: string;
  adminReply?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
  urgency?: number;
  complexity?: number;
  images?: string[];
  documents?: string[];
  viewCount?: number;
  responseTime?: number;
  satisfaction?: number;
  assignedTo?: string;
  estimatedResolution?: string;
  tags?: string[];
  escalationLevel?: number;
  escalationReason?: string;
  escalatedAt?: string;
  history?: ComplaintHistoryEntry[];
}
