# Project Information: Advanced Grievance Redressal System

**Live Demo**: https://gri-jade.vercel.app/complaint

---

## 📋 Project Overview

This is a **full-stack, AI-powered grievance redressal portal** designed to streamline public complaint management for government organizations and service providers. Built with modern web technologies, it combines intelligent automation, real-time analytics, and user-friendly interfaces to transform how citizens file complaints and how administrators manage them.

### Core Purpose
- Enable citizens to **submit, track, and resolve complaints** through a transparent, accessible portal
- Empower administrators with **intelligent tools** for complaint triage, analysis, and resolution
- Leverage **AI and NLP** to automatically categorize, prioritize, and route complaints
- Provide **data-driven insights** through comprehensive analytics and reporting

---

## 🎯 Main Attributes & Key Features

### 1. **Intelligent Complaint Processing**
The system goes beyond basic CRUD operations by incorporating artificial intelligence:

- **Natural Language Processing (NLP)**
  - Automatic sentiment analysis (positive/negative/neutral)
  - Keyword extraction to identify core issues
  - Urgency detection (1-10 scale) based on language patterns
  - Complexity scoring for technical assessments
  - Smart department routing suggestions

- **Priority Scoring Engine**
  - Multi-factor algorithm combining urgency, sentiment, and keywords
  - Automatic priority assignment (Low → Critical)
  - Escalation triggers for time-sensitive issues

- **Auto-tagging System**
  - Generates relevant tags for better categorization
  - Improves searchability and filtering
  - Enables trend analysis across similar complaints

### 2. **AI Chatbot Support**
Powered by OpenAI GPT for 24/7 automated assistance:

- Context-aware conversational interface
- Multi-turn dialogue with conversation memory
- Guided complaint filing assistance
- Status tracking help and department information
- Fallback responses when AI services are offline

### 3. **Media & Document Management**
Comprehensive file handling with cloud integration:

- **Supported Formats**:
  - Images: JPEG, PNG, GIF, WebP (max 10MB)
  - Documents: PDF, DOC, DOCX, TXT (max 10MB)
- **Cloudinary Integration**: Secure cloud storage with CDN delivery
- **Automatic Optimization**: Image compression and format conversion
- **File Validation**: Server-side type and size checks

### 4. **Admin Dashboard (MongoDB-Powered)**
Real-time operations workspace with live data synchronization:

- **Live Data Integration**
  - Fetches complaints from MongoDB via `/api/complaints`
  - Auto-refresh every 60 seconds
  - Loading, error, and empty-state handling
  
- **Complaint Management**
  - Table view with name, email, department, and date filed
  - Status badges (Pending, In Progress, Resolved, Rejected)
  - Optimistic UI updates with server reconciliation
  - Inline status changes via PATCH API
  
- **Analytics Dashboard**
  - Chart.js visualizations for trends and distributions
  - Category, priority, and status breakdowns
  - Weekly complaint trends
  - Department performance metrics
  
- **Settings & Configuration**
  - Notification preferences
  - SLA goal management
  - Admin signature controls

### 5. **Advanced Analytics Engine**
Comprehensive insights and reporting:

- **Metrics Tracked**:
  - Total complaints, resolution rates
  - Average response times
  - User satisfaction scores
  - Department efficiency comparisons
  - Sentiment trends over time
  - Keyword frequency analysis

- **Visualization Types**:
  - Line charts for temporal trends
  - Bar charts for category/priority distribution
  - Pie charts for status breakdowns
  - Real-time KPI cards

### 6. **Automated Notification System**
Professional email workflows using Nodemailer:

- **Notification Triggers**:
  - Complaint submission confirmation
  - Status update alerts
  - Resolution notifications
  - Escalation warnings
  
- **Email Features**:
  - Responsive HTML templates
  - SMTP integration (Gmail, Outlook, custom)
  - Customizable sender information
  - Multi-stage communication workflow

### 7. **Voice & Image Complaint Filing** *(Experimental)*
Alternative input methods for accessibility:

- **Voice Input**: Speech-to-text complaint dictation
- **Image Analysis**: AI-powered image description and analysis
- **Webcam Integration**: Direct photo capture within the app

---

## 🏗️ How the Project Works

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router (React 18 + TypeScript)              │
│  • Public Portal (/complaint, /track)                       │
│  • Admin Dashboard (/admin/dashboard)                       │
│  • AI Chatbot (AIChatbot.tsx)                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   API & MIDDLEWARE LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Serverless Functions)                  │
│  • /api/complaints       → CRUD operations                  │
│  • /api/chatbot         → AI conversation                   │
│  • /api/analytics       → Metrics & reports                 │
│  • /api/upload          → File handling                     │
│  • /api/auth/login      → JWT authentication                │
│  • /api/voice-to-text   → Speech processing                 │
│  • /api/analyze-image   → Image AI analysis                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  lib/ → Business Logic & Utilities                          │
│  • nlp-service.ts        → NLP analysis (Natural, Compromise)│
│  • email-service.ts      → Email notifications (Nodemailer) │
│  • image-analysis-service.ts → Image AI (OpenAI)            │
│  • chatbot-service.ts    → Chatbot logic (OpenAI GPT)       │
│  • upload-service.ts     → Cloudinary integration           │
│  • voice-service.ts      → Speech-to-text processing        │
│  • mongodb.ts            → Database connection helper        │
│  • utils.ts              → Shared utilities                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  MongoDB + Mongoose ODM                                      │
│  • Complaint Model       → Core complaint records           │
│  • Admin Model           → Administrator accounts           │
│  • Indexes               → Optimized queries                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│  • OpenAI GPT API        → Chatbot & image analysis         │
│  • Cloudinary            → Media storage & CDN              │
│  • SMTP Server           → Email delivery                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Workflows

### **1. Citizen Complaint Submission Flow**

```
User opens /complaint page
    ↓
Fills complaint form (name, email, department, category, description)
    ↓
Optional: Attaches images/documents → uploads to Cloudinary
    ↓
Submits form → POST /api/complaints
    ↓
NLP Service analyzes text:
    • Extracts keywords
    • Detects sentiment
    • Calculates urgency score
    • Suggests department
    • Assigns priority
    ↓
MongoDB stores complaint with auto-generated trackingId (e.g., GR4567ABCD)
    ↓
Email Service sends confirmation email to user
    ↓
User receives trackingId for future tracking
```

### **2. Admin Dashboard Management Flow**

```
Admin opens /admin → redirects to /admin/dashboard
    ↓
Dashboard fetches complaints:
    • GET /api/complaints (with optional filters)
    • Returns array of complaint objects from MongoDB
    ↓
Data normalization layer:
    • Maps MongoDB _id, dateFiled, history fields
    • Handles missing/optional fields
    • Adds default history entries
    ↓
UI renders:
    • Summary stats cards (total, resolved, avg response time)
    • Complaint table with filters (status, search)
    • Analytics charts (trends, categories, priorities)
    ↓
Admin selects a complaint:
    • Opens ComplaintDetailsModal
    • Views full details + history timeline
    ↓
Admin updates status (e.g., Pending → In Progress):
    • Optimistic UI update (instant visual feedback)
    • PATCH /api/complaints/:id with new status + notes
    • MongoDB updates record
    • Email notification sent to user
    • Dashboard refreshes to confirm server state
```

### **3. Complaint Tracking Flow**

```
User visits /track or enters trackingId on homepage
    ↓
Submits trackingId → GET /api/complaints/track?trackingId=XXX
    ↓
MongoDB searches for matching complaint
    ↓
If found:
    • Displays current status
    • Shows submission date
    • Displays admin reply (if any)
    • Shows status history timeline
    ↓
If not found:
    • Shows error message with helpful guidance
```

### **4. AI Chatbot Interaction Flow**

```
User opens chatbot widget (AIChatbot.tsx)
    ↓
Types message → POST /api/chatbot
    ↓
Backend sends message to OpenAI GPT with system prompt:
    • Context about grievance portal
    • Available departments
    • Common queries
    ↓
AI generates contextual response
    ↓
Response displayed in chat UI
    ↓
Conversation history maintained in session
```

---

## 📦 Technology Stack Deep Dive

### **Frontend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with SSR/SSG | 14.2.33 |
| **React** | UI library | 18.x |
| **TypeScript** | Type safety | 5.x |
| **Tailwind CSS** | Utility-first styling | 3.3.x |
| **Framer Motion** | Animations | 10.16.x |
| **Chart.js** | Data visualization | 4.5.x |
| **React Dropzone** | File uploads | 14.2.x |
| **Lucide React** | Icon library | 0.292.x |
| **React Hot Toast** | Notifications | 2.4.x |

### **Backend**
| Technology | Purpose | Details |
|-----------|---------|---------|
| **Next.js API Routes** | Serverless functions | RESTful API endpoints |
| **MongoDB** | NoSQL database | Document storage with flexible schema |
| **Mongoose** | ODM for MongoDB | Schema validation, middleware |
| **JWT** | Authentication | Secure token-based auth |
| **bcryptjs** | Password hashing | Salted password encryption |

### **AI & ML Services**
| Service | Purpose | Implementation |
|---------|---------|----------------|
| **Natural.js** | Basic NLP | Sentiment analysis |
| **Compromise** | Text analysis | Keyword extraction, tagging |
| **OpenAI GPT** | Conversational AI | Chatbot responses, image analysis |
| **Custom NLP Engine** | Urgency detection | Rule-based + keyword matching |

### **External Integrations**
| Service | Purpose | Features |
|---------|---------|----------|
| **Cloudinary** | Media storage | Image optimization, CDN, transformations |
| **Nodemailer** | Email delivery | SMTP integration, HTML templates |
| **SMTP (Gmail/Outlook)** | Email server | Transactional emails |

---

## 📂 Project Structure Explained

```
COMPLAINT-RAISE-SYSTEM-main/
│
├── app/                                  # Next.js App Router
│   ├── api/                             # Backend API routes
│   │   ├── complaints/
│   │   │   ├── route.ts                 # GET (list), POST (create)
│   │   │   ├── [id]/route.ts            # GET, PATCH, DELETE by ID
│   │   │   └── track/route.ts           # GET by trackingId
│   │   ├── chatbot/route.ts             # AI chatbot endpoint
│   │   ├── analytics/route.ts           # Analytics data
│   │   ├── upload/route.ts              # File upload handler
│   │   ├── voice-to-text/route.ts       # Speech processing
│   │   ├── analyze-image/route.ts       # Image AI analysis
│   │   └── auth/login/route.ts          # Admin authentication
│   │
│   ├── admin/                           # Admin dashboard pages
│   │   ├── page.tsx                     # Redirects to /admin/dashboard
│   │   └── dashboard/page.tsx           # Main admin workspace
│   │
│   ├── complaint/page.tsx               # Public complaint form
│   ├── track/[trackingId]/page.tsx      # Complaint tracking page
│   ├── page.tsx                         # Homepage
│   ├── layout.tsx                       # Root layout (global wrapper)
│   └── globals.css                      # Global Tailwind styles
│
├── components/                           # Reusable React components
│   ├── admin/                           # Admin-specific components
│   │   ├── ComplaintTable.tsx           # Complaint list table
│   │   ├── ComplaintDetailsModal.tsx    # Detail view modal
│   │   ├── DashboardStats.tsx           # Summary statistics cards
│   │   ├── ComplaintChart.tsx           # Chart.js visualizations
│   │   ├── AnalyticsPage.tsx            # Analytics dashboard
│   │   ├── StatusBadge.tsx              # Status display component
│   │   ├── Header.tsx                   # Admin header
│   │   ├── Sidebar.tsx                  # Navigation sidebar
│   │   ├── types.ts                     # TypeScript definitions
│   │   └── icons/index.tsx              # Custom icon components
│   │
│   ├── AIChatbot.tsx                    # Chatbot widget
│   └── VoiceImageComplaintForm.tsx      # Alternative input form
│
├── lib/                                  # Service layer & utilities
│   ├── nlp-service.ts                   # NLP analysis engine
│   ├── chatbot-service.ts               # Chatbot logic
│   ├── email-service.ts                 # Email notification system
│   ├── image-analysis-service.ts        # Image AI processing
│   ├── upload-service.ts                # Cloudinary integration
│   ├── voice-service.ts                 # Speech-to-text
│   ├── mongodb.ts                       # MongoDB connection helper
│   └── utils.ts                         # Shared utility functions
│
├── models/                               # Mongoose schemas
│   ├── Complaint.ts                     # Complaint data model
│   └── Admin.ts                         # Admin user model
│
├── scripts/                              # Setup & maintenance scripts
│   └── setup-admin.js                   # Creates default admin account
│
├── calling agent/                        # Python voice agent (experimental)
│   ├── apps/                            # Various agent implementations
│   ├── docs/                            # Agent documentation
│   ├── vocode/                          # Voice processing library
│   └── pyproject.toml                   # Python dependencies
│
├── .env.local                           # Environment variables (gitignored)
├── package.json                         # Node.js dependencies
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.js                   # Tailwind CSS config
├── next.config.js                       # Next.js configuration
├── vercel.json                          # Deployment config
└── README.md                            # Project documentation
```

---

## 🔧 Core Components Breakdown

### **1. Models (Data Layer)**

#### **Complaint Schema** (`models/Complaint.ts`)
```typescript
{
  trackingId: string,          // Unique ID (e.g., GR123456ABC)
  name: string,                // Complainant name
  email: string,               // Contact email
  phone?: string,              // Optional phone number
  department: string,          // Target department
  category: string,            // Complaint category
  description: string,         // Detailed complaint text
  status: enum,                // Pending | In Progress | Resolved | Rejected
  priority: enum,              // Low | Medium | High | Critical
  dateFiled: Date,             // Submission timestamp
  updatedAt: Date,             // Last modification
  
  // NLP Analysis Results
  nlpAnalysis?: {
    sentiment: string,         // positive/negative/neutral
    keywords: string[],        // Extracted keywords
    urgency: number,           // 1-10 scale
    suggestedDepartment: string,
    priority: string
  },
  
  // Media & Documents
  imageUrl?: string,           // Cloudinary URL
  documentUrl?: string,        // Document URL
  
  // Admin Interaction
  adminReply?: string,         // Official response
  history?: [{                 // Status change log
    status: string,
    notes: string,
    timestamp: Date,
    updatedBy: string
  }]
}
```

#### **Admin Schema** (`models/Admin.ts`)
```typescript
{
  username: string,            // Login username
  password: string,            // bcrypt hashed password
  email: string,               // Admin email
  role: string,                // Admin role (future expansion)
  createdAt: Date              // Account creation timestamp
}
```

---

### **2. API Endpoints (Backend Layer)**

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/complaints` | POST | Create complaint | `{ name, email, department, category, description, imageUrl?, documentUrl? }` | `{ success, trackingId, complaint }` |
| `/api/complaints` | GET | List complaints | Query: `status`, `department`, `limit`, `skip` | `{ complaints: [], total, page }` |
| `/api/complaints/[id]` | GET | Get single complaint | - | `{ complaint }` |
| `/api/complaints/[id]` | PATCH | Update complaint | `{ status?, adminReply?, history? }` | `{ success, complaint }` |
| `/api/complaints/track` | GET | Track by ID | Query: `trackingId` | `{ complaint }` |
| `/api/chatbot` | POST | AI chat | `{ message, history? }` | `{ reply, context }` |
| `/api/analytics` | GET | Get analytics | Query: `startDate`, `endDate` | `{ metrics, trends, charts }` |
| `/api/upload` | POST | Upload file | FormData with file | `{ url, publicId }` |
| `/api/auth/login` | POST | Admin login | `{ username, password }` | `{ success, token, admin }` |

---

### **3. Service Layer Functions**

#### **NLP Service** (`lib/nlp-service.ts`)
- `analyzeComplaint(text)` → Returns sentiment, keywords, urgency, priority
- `extractKeywords(text)` → Identifies important terms
- `calculateUrgency(text)` → Scores urgency 1-10
- `suggestDepartment(text)` → Recommends department routing

#### **Email Service** (`lib/email-service.ts`)
- `sendComplaintConfirmation(complaint)` → Sends submission email
- `sendStatusUpdate(complaint)` → Notifies status changes
- `sendResolutionNotification(complaint)` → Resolution email
- `sendEscalationAlert(complaint)` → High-priority alerts

#### **Chatbot Service** (`lib/chatbot-service.ts`)
- `generateResponse(message, context)` → OpenAI GPT integration
- `handleComplaintQuery(query)` → Context-aware complaint help
- `getQuickReplies()` → Suggested quick responses

---

## 🔐 Security & Best Practices

### **Authentication**
- JWT tokens with expiration (7 days default)
- bcrypt password hashing with 10 salt rounds
- Secure cookie storage for admin sessions
- Protected API routes with middleware

### **Input Validation**
- Server-side validation for all inputs
- MongoDB injection prevention via Mongoose
- File type and size restrictions
- XSS protection through sanitization

### **Environment Security**
- Sensitive credentials in `.env.local` (gitignored)
- API keys never exposed to client
- CORS configuration for production domains
- Rate limiting for API endpoints (recommended)

---

## 🚀 Deployment Configuration

### **Environment Variables Required**

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/cpgrams

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# OpenAI (for chatbot & image analysis)
OPENAI_API_KEY=sk-...

# Cloudinary (for media storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Grievance Portal <noreply@grievance-portal.com>
```

### **Deployment Targets**
- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Static export support
- **Docker**: Containerized deployment
- **Self-hosted**: PM2 or systemd service

---

## 📊 Performance Characteristics

### **Scalability**
- Serverless API routes → Auto-scaling
- MongoDB indexes on `trackingId`, `status`, `dateFiled`
- Cloudinary CDN for media delivery
- Optimistic UI updates for perceived speed

### **Optimization**
- Next.js automatic code splitting
- Image optimization with next/image
- Lazy loading for non-critical components
- Database query optimization with projections

---

## 🔄 Recent Updates (MongoDB Integration)

### **What Changed**
1. **Admin Dashboard**: Now pulls live data from MongoDB instead of sample data
2. **Real-time Sync**: Auto-refresh every 60 seconds
3. **Status Updates**: PATCH API with optimistic UI + server reconciliation
4. **Data Normalization**: Handles missing fields gracefully with defaults
5. **History Tracking**: Displays status change timeline with fallbacks

### **Migration Notes**
- Old sample data (`sampleData.ts`) deprecated
- All components updated to use MongoDB schema fields
- Type definitions expanded in `components/admin/types.ts`
- Admin dashboard path standardized to `/admin/dashboard`

---

## 📚 Quick Reference

### **Default Admin Credentials**
```
Username: admin
Password: admin123
```
*(Change immediately after first login)*

### **Tracking ID Format**
```
GR + 6-digit timestamp + 6-char random alphanumeric
Example: GR456789ABCD12
```

### **Supported Departments**
Education, Healthcare, Transportation, Municipal Services, Police, Revenue, Agriculture, Environment, Other

### **Supported Categories**
Infrastructure, Service Delivery, Corruption, Delay in Services, Quality Issues, Billing Problems, Other

### **Status States**
- **Pending**: Newly submitted, awaiting review
- **In Progress**: Under investigation/processing
- **Resolved**: Issue addressed and closed
- **Rejected**: Invalid or out-of-scope complaint

### **Priority Levels**
- **Low**: Minor issues, low urgency
- **Medium**: Standard priority
- **High**: Requires prompt attention
- **Critical**: Urgent, high-impact issues

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Setup admin user
node scripts/setup-admin.js

# Export static site (if applicable)
npm run export
```

---

## 📈 Future Roadmap

- [ ] Real-time notifications via WebSockets
- [ ] SMS integration for mobile alerts
- [ ] Multi-language support (i18n)
- [ ] Advanced machine learning for predictive analytics
- [ ] Mobile app (React Native)
- [ ] Blockchain for immutable audit trails
- [ ] Voice call integration for direct support
- [ ] API rate limiting middleware
- [ ] Redis caching for performance
- [ ] Elasticsearch for advanced search

---

**Last Updated**: October 18, 2025  
**Version**: 2.0 (MongoDB Integration Complete)  
**Maintained By**: Development Team  
**License**: MIT
