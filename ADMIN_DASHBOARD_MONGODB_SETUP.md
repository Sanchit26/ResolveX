# Admin Dashboard - MongoDB Integration Setup Guide

This guide explains how the admin dashboard connects to MongoDB Atlas and how to set it up properly.

## Architecture Overview

```
┌─────────────────────┐
│  User Dashboard     │
│  (Next.js)          │
│  Submit Complaints  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Next.js API Routes │
│  /api/complaints    │
│  /api/analytics     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  MongoDB Atlas      │
│  Database           │
└──────────┬──────────┘
           │
           ↑
┌──────────┴──────────┐
│  Next.js API Routes │
│  (Read/Update)      │
└──────────┬──────────┘
           │
           ↑
┌──────────┴──────────┐
│  Admin Dashboard    │
│  (Vite + React)     │
│  Manage Complaints  │
└─────────────────────┘
```

## How It Works

### 1. User Submits Complaint
- User fills out the complaint form on the main app
- Form data is sent to `/api/complaints` (POST)
- API route validates data and performs NLP analysis
- Complaint is saved to MongoDB Atlas
- User receives a tracking ID

### 2. Admin Views Complaints
- Admin dashboard sends GET request to `/api/complaints`
- API route queries MongoDB Atlas
- Complaints are transformed to dashboard format
- Dashboard displays all complaints with filters and search

### 3. Admin Updates Complaint
- Admin changes status or forwards to department
- Dashboard sends PATCH request to `/api/complaints/[id]`
- API route updates MongoDB document
- Updated data is reflected in dashboard

## Setup Instructions

### Step 1: Ensure Main App Has MongoDB Connection

1. In the main project root, check `.env.local`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cpgrams?retryWrites=true&w=majority
```

2. Test the connection by running the main app:
```bash
npm run dev
```

3. Submit a test complaint through the user interface to verify data is saving to MongoDB.

### Step 2: Configure Admin Dashboard

1. Navigate to the admin dashboard directory:
```bash
cd "admin dashboard"
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy the example
cp env.example .env
```

4. Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
```

**Important:** If your main app runs on a different port, update accordingly.

### Step 3: Start Both Applications

1. **Terminal 1** - Start the main app (from project root):
```bash
npm run dev
```
This should start on `http://localhost:3000`

2. **Terminal 2** - Start admin dashboard:
```bash
cd "admin dashboard"
npm run dev
```
This should start on `http://localhost:5173`

### Step 4: Verify Connection

1. Open admin dashboard at `http://localhost:5173`
2. You should see a loading spinner followed by:
   - ✅ **Success:** Complaints from MongoDB displayed
   - ⚠️ **Warning:** "API Connection Issue" banner (see troubleshooting)

## API Endpoints

The admin dashboard uses these endpoints from the main app:

### GET /api/complaints
Fetches all complaints with optional filters.

**Query Parameters:**
- `status` - Filter by status (Pending, In Progress, Resolved, Rejected)
- `department` - Filter by department
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)

**Response:**
```json
{
  "complaints": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 50,
    "pages": 1
  }
}
```

### GET /api/complaints/[id]
Fetches a single complaint by MongoDB ObjectId or tracking ID.

**Response:**
```json
{
  "complaint": {
    "_id": "...",
    "trackingId": "CMP-12345",
    "name": "John Doe",
    ...
  }
}
```

### PATCH /api/complaints/[id]
Updates a complaint's status, department, or admin reply.

**Request Body:**
```json
{
  "status": "In Progress",
  "adminReply": "We are looking into this.",
  "department": "Technical Support",
  "notes": "Forwarded to tech team",
  "updatedBy": "Admin User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint updated successfully",
  "complaint": {...}
}
```

### GET /api/analytics
Fetches analytics data for dashboard charts.

**Query Parameters:**
- `period` - Number of days to analyze (default: 30)
- `department` - Filter by department

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalComplaints": 150,
    "statusDistribution": {...},
    "priorityDistribution": [...],
    "departmentDistribution": [...],
    ...
  }
}
```

## Data Transformation

The API returns MongoDB documents which are transformed for the admin dashboard:

### MongoDB Document → Dashboard Complaint

```javascript
// MongoDB Document
{
  _id: "507f1f77bcf86cd799439011",
  trackingId: "CMP-12345",
  name: "John Doe",
  email: "john@example.com",
  department: "Logistics",
  category: "Delivery",
  description: "Package not delivered",
  status: "Pending",
  priority: "High",
  dateFiled: "2023-10-26T10:00:00Z",
  ...
}

// Transformed to Dashboard Format
{
  id: "CMP-12345",
  subject: "Delivery - Logistics",
  description: "Package not delivered",
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Doe"
  },
  createdAt: "2023-10-26T10:00:00Z",
  status: "Pending",
  category: "Delivery",
  priority: "High",
  department: "Logistics",
  ...
}
```

## Troubleshooting

### Issue: "API Connection Issue" Warning

**Symptoms:**
- Yellow banner appears on dashboard
- Demo data is shown instead of real data

**Solutions:**

1. **Check Main App is Running**
   ```bash
   # In project root
   npm run dev
   ```
   Verify it's running on `http://localhost:3000`

2. **Verify Environment Variable**
   - Check `admin dashboard/.env` exists
   - Ensure `VITE_API_BASE_URL=http://localhost:3000`

3. **Test API Directly**
   ```bash
   curl http://localhost:3000/api/complaints
   ```
   Should return JSON with complaints

4. **Check MongoDB Connection**
   - Look at main app console logs
   - Should see "✓ Connected to MongoDB"
   - If not, check `MONGODB_URI` in main app's `.env.local`

5. **CORS Issues (if apps on different domains)**
   - Main app needs to allow requests from admin dashboard domain
   - Update `next.config.js` with CORS headers (see below)

### Issue: Empty Complaints List

**Symptoms:**
- Dashboard loads successfully
- No complaints shown (no demo data)

**Solutions:**

1. **Verify Data Exists in MongoDB**
   - Submit a test complaint through user interface
   - Check MongoDB Atlas dashboard to confirm data was saved

2. **Check API Response**
   ```bash
   curl http://localhost:3000/api/complaints
   ```
   Should return array with complaint objects

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for network errors or console errors
   - Check the actual API response

### Issue: Cannot Update Complaint Status

**Symptoms:**
- Can view complaints but updates fail
- Error message appears when trying to update

**Solutions:**

1. **Check Browser Network Tab**
   - Open DevTools → Network
   - Try updating a complaint
   - Look for failed PATCH requests
   - Check error response

2. **Verify Complaint ID**
   - Ensure the complaint ID being sent is valid
   - Check console logs for ID mismatch

3. **Test API Directly**
   ```bash
   curl -X PATCH http://localhost:3000/api/complaints/[id] \
     -H "Content-Type: application/json" \
     -d '{"status": "In Progress"}'
   ```

## CORS Configuration (Optional)

If you're running the admin dashboard and main app on different domains in production, you'll need to configure CORS.

Update `next.config.js` in the main app:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://your-admin-dashboard.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## Production Deployment

### Option 1: Deploy Admin Dashboard Separately

1. Build the admin dashboard:
   ```bash
   cd "admin dashboard"
   npm run build
   ```

2. Deploy `dist` folder to:
   - Vercel
   - Netlify
   - Any static hosting

3. Set environment variable in hosting platform:
   ```
   VITE_API_BASE_URL=https://your-main-app.vercel.app
   ```

4. Configure CORS in main app (see above)

### Option 2: Deploy as Subdirectory

1. Build admin dashboard:
   ```bash
   cd "admin dashboard"
   npm run build
   ```

2. Copy `dist` folder to main app's `public/admin`:
   ```bash
   cp -r dist ../public/admin
   ```

3. Access at `https://your-app.com/admin`

4. Set `VITE_API_BASE_URL` to relative path or same domain

## Testing the Integration

### Test 1: View Complaints
1. Submit a complaint through user interface
2. Open admin dashboard
3. Verify the complaint appears in the list

### Test 2: Filter Complaints
1. Use status filter (Pending, In Progress, etc.)
2. Verify filtered results match the selected status

### Test 3: Update Status
1. Click on a complaint to open details modal
2. Change status and add notes
3. Click "Update Status"
4. Verify status updates in the list

### Test 4: Forward Complaint
1. Open a complaint details modal
2. Select a new department
3. Click "Forward"
4. Verify department updates in the list

### Test 5: Search
1. Enter a search term (name, email, tracking ID)
2. Verify only matching complaints are shown

## Summary

✅ **Data Flow:**
- User Dashboard → API → MongoDB (Create)
- Admin Dashboard → API → MongoDB (Read/Update)

✅ **Key Points:**
- Admin dashboard does NOT directly connect to MongoDB
- All data flows through Next.js API routes
- Main app must be running for admin dashboard to work
- Automatic fallback to demo data if API unavailable

✅ **Security:**
- Admin dashboard should be protected with authentication in production
- API routes should validate admin permissions
- Use environment variables for configuration
- Never expose MongoDB credentials in admin dashboard

## Next Steps

1. ✅ Set up MongoDB connection in main app
2. ✅ Configure admin dashboard environment
3. ✅ Start both applications
4. ✅ Test the integration
5. 🔒 Add authentication to admin dashboard
6. 🚀 Deploy to production

For questions or issues, check the browser console and main app logs for detailed error messages.

