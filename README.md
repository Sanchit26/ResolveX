live link of the proejct    https://gri-jade.vercel.app/complaint


# 🚀 Advanced Grievance Redressal Portal

A cutting-edge, AI-powered grievance redressal portal built with Next.js, Tailwind CSS, and MongoDB. This advanced system incorporates NLP analysis, AI chatbot support, image uploads, and comprehensive analytics to provide a superior user experience.

## 🌟 **Advanced Features**

### 🤖 **AI & NLP Integration**
- **Natural Language Processing**: Automatic sentiment analysis, keyword extraction, and urgency detection
- **Smart Department Routing**: AI suggests the most appropriate department based on complaint content
- **Priority Scoring**: Automatic priority calculation using NLP analysis
- **Intelligent Tagging**: Auto-generates relevant tags for better categorization

### 💬 **AI Chatbot Support**
- **24/7 Automated Support**: Intelligent chatbot powered by OpenAI GPT
- **Context-Aware Responses**: Understands user intent and provides relevant guidance
- **Multi-turn Conversations**: Maintains conversation context for better assistance
- **Fallback Responses**: Works even when AI services are unavailable

### 📸 **Media Upload System**
- **Image Upload**: Support for JPEG, PNG, GIF, WebP with automatic optimization
- **Document Upload**: PDF, DOC, DOCX, TXT files for evidence and documentation
- **Cloud Storage**: Secure cloud storage with Cloudinary integration
- **File Validation**: Automatic file type and size validation

### 📊 **Advanced Analytics Dashboard**
- **Real-time Insights**: Comprehensive analytics and reporting
- **Sentiment Analysis**: Track public sentiment trends
- **Performance Metrics**: Response times, resolution rates, satisfaction scores
- **Trending Keywords**: Identify common issues and concerns
- **Department Performance**: Compare efficiency across departments

### 📧 **Automated Notifications**
- **Email Notifications**: Professional HTML emails for all status updates
- **Multi-stage Alerts**: Confirmation, updates, resolution, and escalation notifications
- **Customizable Templates**: Beautiful, responsive email templates
- **SMTP Integration**: Support for Gmail, Outlook, and custom SMTP servers

### 🔄 **Enhanced Workflow**
- **Escalation System**: Automatic escalation for urgent or complex issues
- **Priority Management**: Four-level priority system (Low, Medium, High, Critical)
- **Response Time Tracking**: Monitor and optimize response times
- **Satisfaction Surveys**: Collect feedback after resolution

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Dropzone** for file uploads
- **Chart.js** for analytics visualization

### **Backend**
- **Next.js API Routes** for serverless functions
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with bcrypt
- **Natural Language Processing** with Natural.js and Compromise
- **OpenAI Integration** for AI chatbot

### **External Services**
- **Cloudinary** for media storage
- **Nodemailer** for email notifications
- **OpenAI GPT** for chatbot responses

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Setup**
Create `.env.local`:
```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/cpgrams

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# OpenAI (for chatbot)
OPENAI_API_KEY=your-openai-api-key

# Cloudinary (for file uploads)
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

### **3. Setup Database**
```bash
# Start MongoDB
mongod

# Create admin user
node scripts/setup-admin.js
```

### **4. Run Development Server**
```bash
npm run dev
```

## � Project Structure Overview

The repository is organized so you can inspect the frontend experience, serverless APIs, and AI utilities independently:

- `app/` – Next.js App Router pages plus the public complaint flows and tracking view.
   - `app/admin/` – Entry point that redirects to the consolidated dashboard at `/admin/dashboard`.
   - `app/api/` – Serverless routes for complaints, analytics, media processing, authentication, and voice services.
- `components/admin/` – Modular dashboard widgets (charts, tables, modals, status badges, header/sidebar, etc.) backed by sample data for instant previews.
- `components/` – Shared UI (chatbot, voice/image complaint form, public forms) used across routes.
- `lib/` – Service layer for NLP, email, image analysis, MongoDB helpers, and utility functions shared by the API.
- `models/` – Mongoose models (`Complaint`, `Admin`) consumed inside API routes.
- `scripts/` – One-off utilities such as `setup-admin.js` for seeding an administrator account.
- `calling agent/` – Experimental voice agent workspace (Python) kept separate from the core Next.js app.

Use this map as a starting point when wiring new data sources or extending the admin tooling.

## 🧭 Admin Dashboard Tour

Visit `http://localhost:3000/admin` after running the dev server. The route now redirects to `/admin/dashboard`, which renders a complete operations workspace without requiring an immediate database connection:

- **Sample dataset** lives in `components/admin/sampleData.ts`, allowing you to demo charts, analytics, and complaint records instantly. Replace this with live API calls once your backend is ready.
- **Dashboard view** combines summary tiles, weekly trend charts, and the complaint table. Filtering works via status buttons or the global search field.
- **Complaint details modal** surfaces the full history timeline and supports inline status updates so you can rehearse team workflows.
- **Analytics tab** visualizes category, priority, and status breakdowns using Chart.js, powered by the same sample dataset.
- **Settings tab** includes notification toggles, signature controls, and SLA goals to showcase configuration screens.

When connecting to production data, point the dashboard state to your `/api/complaints` endpoints (or another data provider) and remove `SAMPLE_COMPLAINTS` once real records are flowing.

## �📋 **API Endpoints**

### **Complaints**
- `POST /api/complaints` - Create complaint with NLP analysis
- `GET /api/complaints` - List complaints with advanced filtering
- `PATCH /api/complaints/:id` - Update complaint with notifications
- `GET /api/complaints/track` - Track complaint by ID

### **AI Services**
- `POST /api/chatbot` - AI chatbot conversation
- `GET /api/chatbot` - Get chat history

### **File Upload**
- `POST /api/upload` - Upload images and documents

### **Analytics**
- `GET /api/analytics` - Comprehensive analytics and reports

### **Authentication**
- `POST /api/auth/login` - Admin authentication

## 🎯 **Advanced Features Usage**

### **NLP Analysis**
The system automatically analyzes each complaint:
- **Sentiment**: Positive, negative, or neutral
- **Keywords**: Extracts important terms
- **Urgency**: Scores urgency from 1-10
- **Complexity**: Assesses technical complexity
- **Priority**: Calculates priority level
- **Department Suggestion**: Recommends appropriate department

### **AI Chatbot**
Users can interact with the chatbot for:
- Filing complaints guidance
- Status tracking help
- Department information
- General support queries

### **File Upload**
Support for multiple file types:
- **Images**: JPEG, PNG, GIF, WebP (max 10MB)
- **Documents**: PDF, DOC, DOCX, TXT (max 10MB)
- Automatic optimization and cloud storage

### **Analytics Dashboard**
Comprehensive insights including:
- Complaint trends over time
- Department performance metrics
- Sentiment analysis trends
- Response time analytics
- Resolution rate tracking
- Keyword frequency analysis

## 🔧 **Customization**

### **Adding New Departments**
Edit `lib/utils.ts`:
```typescript
export const departments = [
  'Education',
  'Healthcare',
  'Transportation',
  // Add your departments
];
```

### **Customizing NLP Analysis**
Modify `lib/nlp-service.ts`:
```typescript
// Add custom urgency words
private analyzeUrgency(text: string): number {
  const urgencyWords = {
    'your-custom-word': 8,
    // Add more words
  };
}
```

### **Email Templates**
Customize email templates in `lib/email-service.ts`:
```typescript
private generateCustomEmail(notification: ComplaintNotification): string {
  // Your custom HTML template
}
```

## 📊 **Analytics & Reporting**

### **Key Metrics**
- **Total Complaints**: Overall complaint volume
- **Resolution Rate**: Percentage of resolved complaints
- **Average Response Time**: Time to first response
- **Satisfaction Score**: Average user satisfaction
- **Department Performance**: Efficiency by department
- **Sentiment Trends**: Public sentiment over time

### **Reports Available**
- Daily complaint trends
- Department-wise analysis
- Priority distribution
- Sentiment analysis
- Keyword frequency
- Response time metrics

## 🔒 **Security Features**

- **JWT Authentication**: Secure admin sessions
- **Password Hashing**: bcrypt with salt rounds
- **File Validation**: Strict file type and size checks
- **Input Sanitization**: Protection against XSS attacks
- **Rate Limiting**: API rate limiting for abuse prevention
- **Environment Variables**: Secure configuration management

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
vercel --prod
```

### **Environment Variables for Production**
Set these in your deployment platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong random string
- `OPENAI_API_KEY` - OpenAI API key
- `CLOUDINARY_*` - Cloudinary credentials
- `SMTP_*` - Email server credentials

## 📈 **Performance Optimization**

- **Image Optimization**: Automatic compression and format conversion
- **Database Indexing**: Optimized queries for large datasets
- **Caching**: Redis integration for improved performance
- **CDN**: Cloudinary CDN for media delivery
- **Lazy Loading**: Efficient component loading

## 🔮 **Future Enhancements**

- [ ] **SMS Notifications**: Text message alerts
- [ ] **Mobile App**: React Native mobile application
- [ ] **Voice Integration**: Voice-to-text complaint filing
- [ ] **Machine Learning**: Predictive analytics for issue prevention
- [ ] **Blockchain**: Immutable complaint records
- [ ] **Multi-language**: Internationalization support
- [ ] **API Rate Limiting**: Advanced rate limiting
- [ ] **Real-time Chat**: Live chat with human agents

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, AI/ML, and modern web technologies**

## Features

### 🏠 Public Portal
- **Complaint Submission**: Easy-to-use form for citizens to submit grievances
- **Complaint Tracking**: Real-time status tracking using unique tracking IDs
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

### 🔐 Admin Dashboard
- **Secure Authentication**: JWT-based admin login system
- **Complaint Management**: View, filter, and manage all complaints
- **Status Updates**: Change complaint status (Pending/In Progress/Resolved)
- **Official Replies**: Add administrative responses to complaints
- **Advanced Filtering**: Filter by department, category, and status

### 🗄️ Backend Features
- **RESTful API**: Complete API endpoints for all operations
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **Auto-generated IDs**: Unique tracking IDs for each complaint
- **Data Validation**: Comprehensive input validation and error handling

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Deployment**: Ready for Vercel/Netlify

## Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grievance-redressal-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Start MongoDB locally: `mongod`
   - Or use MongoDB Atlas (cloud service)
   - Create database: `cpgrams`

4. **Environment Variables** (optional)
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/cpgrams
   JWT_SECRET=your-secret-key-here
   ```

5. **Set up admin user**
   ```bash
   node scripts/setup-admin.js
   ```
   This creates default admin credentials:
   - Username: `admin`
   - Password: `admin123`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Citizens

1. **Submit a Complaint**
   - Visit the homepage
   - Click "File Complaint"
   - Fill out the form with your details
   - Submit and receive a tracking ID

2. **Track Your Complaint**
   - Use the tracking ID from your submission
   - Enter it on the homepage or tracking page
   - View current status and any official replies

### For Administrators

1. **Access Dashboard**
   - Go to `/admin` and login with credentials
   - View complaint statistics and manage grievances

2. **Manage Complaints**
   - Filter complaints by various criteria
   - Update status and add official replies
   - Monitor complaint resolution progress

## API Endpoints

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - List complaints (with filters)
- `GET /api/complaints/:id` - Get specific complaint
- `PATCH /api/complaints/:id` - Update complaint status/reply

### Tracking
- `GET /api/complaints/track?trackingId=XXX` - Track complaint by ID

### Authentication
- `POST /api/auth/login` - Admin login

## Database Schema

### Complaint Model
```typescript
{
  trackingId: string,      // Auto-generated unique ID
  name: string,            // Complainant name
  email: string,           // Complainant email
  department: string,      // Department concerned
  category: string,        // Complaint category
  description: string,     // Detailed description
  status: string,          // Pending/In Progress/Resolved
  dateFiled: Date,         // Submission date
  adminReply?: string,     // Official response
  updatedAt: Date          // Last update timestamp
}
```

### Admin Model
```typescript
{
  username: string,        // Admin username
  password: string,        // Hashed password
  email: string,          // Admin email
  createdAt: Date         // Account creation date
}
```

## Project Structure

```
grievance-redressal-portal/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── complaint/         # Complaint form
│   ├── track/             # Tracking pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── lib/                   # Utility functions
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # Helper functions
├── models/                # Database models
│   ├── Complaint.ts       # Complaint schema
│   └── Admin.ts           # Admin schema
├── scripts/               # Setup scripts
│   └── setup-admin.js     # Admin user creation
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## Customization

### Adding New Departments
Edit `lib/utils.ts`:
```typescript
export const departments = [
  'Education',
  'Healthcare',
  'Transportation',
  // Add your departments here
];
```

### Adding New Categories
Edit `lib/utils.ts`:
```typescript
export const categories = [
  'Infrastructure',
  'Service Delivery',
  // Add your categories here
];
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `app/globals.css` for custom CSS classes

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **Docker**: Create Dockerfile for containerized deployment
- **Self-hosted**: Use `npm run build` and `npm start`

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure admin sessions
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Built-in Next.js security
- **Environment Variables**: Secure configuration management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Email notifications
- [ ] File attachments
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Escalation system

---

**Built with ❤️ using Next.js, Tailwind CSS, and MongoDB**
#   R e s o l v e X  
 