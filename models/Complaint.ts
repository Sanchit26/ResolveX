import mongoose from 'mongoose';

export interface IComplaint {
  _id: string;
  trackingId: string;
  name: string;
  email: string;
  department: string;
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type?: 'Public' | 'Internal'; // Public = govt services, Internal = corporate/IT
  dateFiled: Date;
  reply?: string;
  adminReply?: string;
  updatedAt: Date;
  
  // NLP Analysis
  sentiment?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
  urgency?: number; // 1-10 scale
  complexity?: number; // 1-10 scale
  
  // Media
  images?: string[];
  documents?: string[];
  
  // Analytics
  viewCount?: number;
  responseTime?: number; // in hours
  satisfaction?: number; // 1-5 scale
  
  // Routing
  assignedTo?: string;
  estimatedResolution?: Date;
  tags?: string[];
  
  // Escalation
  escalationLevel?: number;
  escalationReason?: string;
  escalatedAt?: Date;
}

const complaintSchema = new mongoose.Schema<IComplaint>({
  trackingId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  type: {
    type: String,
    enum: ['Public', 'Internal'],
    default: 'Public',
  },
  dateFiled: {
    type: Date,
    default: Date.now,
  },
  reply: {
    type: String,
  },
  adminReply: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // NLP Analysis
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
  },
  keywords: [String],
  urgency: {
    type: Number,
    min: 1,
    max: 10,
  },
  complexity: {
    type: Number,
    min: 1,
    max: 10,
  },
  
  // Media
  images: [String],
  documents: [String],
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0,
  },
  responseTime: Number,
  satisfaction: {
    type: Number,
    min: 1,
    max: 5,
  },
  
  // Routing
  assignedTo: String,
  estimatedResolution: Date,
  tags: [String],
  
  // Escalation
  escalationLevel: {
    type: Number,
    default: 0,
  },
  escalationReason: String,
  escalatedAt: Date,
});

// Update the updatedAt field before saving
complaintSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', complaintSchema);



