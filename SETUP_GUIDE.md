# Complete Setup Guide

## ✅ Current Setup Status

Your Complaint Raise System is now configured with **TWO separate applications**:

### 1. Main Application (Next.js) - Port 3000
- **URL**: http://localhost:3000
- **Purpose**: Public complaint portal
- **Features**:
  - Submit complaints
  - Track complaints
  - Admin login (redirects to external dashboard)

### 2. Admin Dashboard (React + Vite) - Port 5173
- **URL**: http://localhost:5173
- **Purpose**: Admin management interface
- **Features**:
  - View all complaints
  - Manage complaint status
  - Analytics and reporting
  - Settings management

---

## 🚀 How to Run Both Applications

### Terminal 1 - Main Application:
```bash
cd /Users/syedasif/COMPLAINT-RAISE-SYSTEM-main
npm run dev
```
Runs on: http://localhost:3000

### Terminal 2 - Admin Dashboard:
```bash
cd "/Users/syedasif/COMPLAINT-RAISE-SYSTEM-main/admin dashboard"
npm run dev
```
Runs on: http://localhost:5173

---

## 🔄 How the Redirect Works

1. User clicks **"Admin Dashboard"** on the main site (http://localhost:3000)
2. System redirects to: http://localhost:3000/admin
3. The `/admin` page automatically redirects to: http://localhost:5173
4. Admin dashboard loads on the separate Vite app

---

## 🗄️ MongoDB Atlas Configuration

### Current Connection:
```
mongodb+srv://asifkhan78866_db_user:asif123@cluster0.mongodb.net/cpgrams
```

### Important: Update Your Connection String
From your MongoDB Atlas screenshot, you need to replace `cluster0.mongodb.net` with your actual cluster URL:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **"Connect"** on your Cluster0
3. Choose **"Connect your application"**
4. Copy the full connection string (it will look like):
   ```
  mongodb+srv://asifkhan78866_db_user:asif123@cluster0.XXXXX.mongodb.net/cpgrams?retryWrites=true&w=majority
   ```
5. Update `.env.local` file with the correct URL

---

## 🔐 Admin Credentials

```
Username: admin
Password: admin123
```

⚠️ **Important**: Change these credentials in production!

---

## 📦 Production Deployment Options

### Option 1: Deploy Both on Same Host (Recommended for simplicity)
- Keep the current Next.js structure
- Use the built-in `/admin/dashboard` page
- Deploy to Vercel/Netlify

### Option 2: Deploy Separately (Current Setup)

#### Main Application:
- **Platform**: Vercel, Netlify, or any Node.js host
- **URL**: https://yourdomain.com
- **Environment Variables**: Set in platform settings

#### Admin Dashboard:
- **Platform**: Vercel, Netlify, or any static host
- **URL**: https://admin.yourdomain.com
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Update Redirect**: Change `http://localhost:5173` to `https://admin.yourdomain.com`

---

## 🛠️ For Production: Update Admin Redirect

In `/app/admin/page.tsx`, change:
```typescript
window.location.href = 'http://localhost:5173';
```

To:
```typescript
window.location.href = 'https://admin.yourdomain.com';
```

Or use environment variable:
```typescript
window.location.href = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 'http://localhost:5173';
```

---

## 🔧 Troubleshooting

### Can't access admin dashboard?
1. Make sure both servers are running
2. Check ports: `netstat -an | grep LISTEN | grep -E "3000|5173"`
3. Visit http://localhost:5173 directly

### MongoDB connection error?
1. Check your Atlas cluster is running
2. Verify IP whitelist includes your IP or use `0.0.0.0/0` for testing
3. Ensure connection string has correct password and cluster URL

### Admin dashboard shows blank page?
1. Check browser console for errors
2. Ensure all dependencies are installed: `cd "admin dashboard" && npm install`
3. Try rebuilding: `npm run build`

---

## 📝 Quick Start Commands

```bash
# Start Main Application
npm run dev

# Start Admin Dashboard (in new terminal)
cd "admin dashboard" && npm run dev

# Create Admin User (if not exists)
node scripts/setup-admin.js

# Check Running Servers
ps aux | grep -E "(next dev|vite)" | grep -v grep
```

---

## 🌐 Access Points

- **Main Site**: http://localhost:3000
- **File Complaint**: http://localhost:3000/complaint
- **Admin Login** (redirects): http://localhost:3000/admin
- **Admin Dashboard** (direct): http://localhost:5173
- **Track Complaint**: http://localhost:3000/track/[trackingId]

---

**Note**: For production, always use HTTPS and update URLs accordingly!


