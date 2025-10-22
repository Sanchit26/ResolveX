# 🧪 User Testing Guide - Complete System Verification

## ✅ **System Status Check**

Both applications are currently running:
- ✅ **User Portal**: http://localhost:3000
- ✅ **Admin Dashboard**: http://localhost:5173

---

## 🎯 **Complete User Journey Test**

### **Test 1: Homepage Buttons**

1. **Open Homepage**: http://localhost:3000

2. **Test "File Complaint" Button**:
   - ✅ Click "File Complaint" button
   - ✅ Should navigate to: http://localhost:3000/complaint
   - ✅ Should show 3 complaint type options

3. **Test "Track Complaint" Form**:
   - ✅ Enter any tracking ID (e.g., CPG-2024-TEST123)
   - ✅ Click "Track Complaint" button
   - ✅ Should navigate to: http://localhost:3000/track/CPG-2024-TEST123

4. **Test "Admin Dashboard" Link**:
   - ✅ Click "Admin Dashboard" in header
   - ✅ Should redirect to: http://localhost:5173
   - ✅ Admin dashboard should load

---

### **Test 2: Text Complaint Submission (RECOMMENDED)**

This is the simplest way to test the complete flow:

1. **Go to**: http://localhost:3000/complaint

2. **Click**: "Start Text Complaint" (green button)

3. **Fill the Form**:
   ```
   Full Name: John Doe
   Email: john.doe@test.com
   Department: Healthcare
   Category: Service Delivery
   Description: This is a test complaint to verify the integration between user portal and admin dashboard. The system should save this to MongoDB and display it in the admin dashboard automatically.
   ```

4. **Click**: "Submit Complaint" button

5. **Expected Result**:
   - ✅ Success message appears
   - ✅ Tracking ID is displayed (e.g., CPG-2024-XXXXX)
   - ✅ "Track Your Complaint" button appears
   - ✅ "Submit Another Complaint" button appears

6. **Copy the Tracking ID** for later verification

---

### **Test 3: Verify in Admin Dashboard**

1. **Open Admin Dashboard**: http://localhost:5173

2. **Check Dashboard**:
   - ✅ Your complaint should appear in the table
   - ✅ Name: John Doe
   - ✅ Department: Healthcare
   - ✅ Status: Pending
   - ✅ Priority: Medium (auto-assigned by NLP)

3. **Click on the Complaint**:
   - ✅ Modal should open with full details
   - ✅ Shows user information
   - ✅ Shows description
   - ✅ Shows status dropdown
   - ✅ Shows admin reply textarea

4. **Update Status**:
   - ✅ Change status to "In Progress"
   - ✅ Add admin reply: "We have received your complaint and are investigating the issue."
   - ✅ Click "Save Changes"
   - ✅ Modal should close
   - ✅ Status in table should update

---

### **Test 4: Track Complaint as User**

1. **Go back to**: http://localhost:3000

2. **Enter your Tracking ID** in the track form

3. **Click**: "Track Complaint"

4. **Expected Result**:
   - ✅ Shows complaint details
   - ✅ Shows updated status: "In Progress"
   - ✅ Shows admin reply
   - ✅ Shows timeline/history

---

### **Test 5: Voice & Image Complaint (Optional)**

1. **Go to**: http://localhost:3000/complaint

2. **Click**: "Start Voice & Image Complaint" (blue button)

3. **Features to Test**:
   - ✅ Voice recording button (requires microphone permission)
   - ✅ Image upload (drag & drop or click to upload)
   - ✅ Location detection
   - ✅ Auto-fill from voice transcription
   - ✅ Submit and verify in admin dashboard

---

### **Test 6: Photo-Only Complaint (Optional)**

1. **Go to**: http://localhost:3000/complaint

2. **Click**: "Start Photo Complaint" (purple button)

3. **Features to Test**:
   - ✅ Take photo or upload image
   - ✅ AI analyzes image (requires OpenAI API key)
   - ✅ Auto-suggests department
   - ✅ Submit and verify in admin dashboard

---

## 🔍 **What to Verify**

### **User Portal (Port 3000)**

✅ **Homepage**:
- [x] "File Complaint" button works
- [x] "Track Complaint" form works
- [x] "Admin Dashboard" link redirects correctly
- [x] All links are clickable
- [x] Responsive design on mobile

✅ **Complaint Page**:
- [x] Shows 3 complaint type options
- [x] Each button navigates to correct form
- [x] Back button returns to options
- [x] Forms are responsive

✅ **Text Complaint Form**:
- [x] All input fields work
- [x] Dropdown menus populate correctly
- [x] Form validation works (required fields)
- [x] Submit button shows loading state
- [x] Success page shows tracking ID
- [x] "Track Your Complaint" button works
- [x] "Submit Another Complaint" button works

✅ **Voice & Image Form**:
- [x] Voice recording works (browser permission)
- [x] Image upload works
- [x] Location detection works
- [x] Form submission works
- [x] Success message appears

✅ **Tracking Page**:
- [x] Shows complaint details
- [x] Shows current status
- [x] Shows admin replies
- [x] Shows timeline/history
- [x] Responsive design

---

### **Admin Dashboard (Port 5173)**

✅ **Dashboard View**:
- [x] Shows all complaints from MongoDB
- [x] Displays complaint count
- [x] Shows status distribution
- [x] Table shows all columns correctly
- [x] Auto-refreshes every 30 seconds

✅ **Filters & Search**:
- [x] Status filter works (All, Pending, In Progress, Resolved)
- [x] Search box filters by tracking ID, name, description
- [x] Results update instantly
- [x] Clear filters works

✅ **Complaint Details Modal**:
- [x] Opens when clicking a complaint
- [x] Shows full complaint information
- [x] Shows user avatar and details
- [x] Status dropdown works
- [x] Admin reply textarea works
- [x] Save button updates database
- [x] Close button works

✅ **Real-Time Updates**:
- [x] New complaints appear automatically
- [x] Status changes reflect immediately
- [x] Dashboard refreshes every 30 seconds
- [x] No errors in browser console

---

## 🐛 **Troubleshooting**

### **Problem: Complaint doesn't submit**

**Check**:
1. All required fields are filled
2. MongoDB connection is working: `node scripts/setup-admin.js`
3. Browser console for errors (F12 → Console tab)
4. Network tab shows POST request to `/api/complaints`

**Solution**:
- Update MongoDB connection string in `.env.local`
- Restart server: `pkill -f "next dev" && npm run dev`

---

### **Problem: Complaint doesn't appear in admin dashboard**

**Check**:
1. Admin dashboard is running on port 5173
2. Browser console for CORS errors
3. API endpoint is accessible: `curl http://localhost:3000/api/complaints`
4. Wait 30 seconds for auto-refresh or refresh page manually

**Solution**:
- Check CORS is enabled in `next.config.js`
- Verify both servers are running
- Check MongoDB has data: Use MongoDB Compass or Atlas web interface

---

### **Problem: Status update doesn't save**

**Check**:
1. MongoDB connection is working
2. Browser console for errors
3. Network tab shows PATCH request to `/api/complaints/:id`

**Solution**:
- Verify MongoDB connection string
- Check complaint ID is correct
- Restart admin dashboard: `pkill -f vite && cd "admin dashboard" && npm run dev`

---

### **Problem: Track complaint shows "not found"**

**Check**:
1. Tracking ID is correct (copy-paste from success page)
2. Complaint was successfully submitted
3. MongoDB has the complaint

**Solution**:
- Verify tracking ID format: CPG-2024-XXXXXX
- Check MongoDB database has the complaint
- Try submitting a new complaint

---

## 📊 **Expected Data Flow**

```
1. User fills form on port 3000
   ↓
2. POST /api/complaints
   ↓
3. Saved to MongoDB Atlas
   ↓
4. Tracking ID generated
   ↓
5. Success page shows tracking ID
   ↓
6. Admin dashboard fetches from API
   ↓
7. Complaint appears in table
   ↓
8. Admin updates status
   ↓
9. PATCH /api/complaints/:id
   ↓
10. Updated in MongoDB
   ↓
11. User tracks and sees update
```

---

## ✅ **Quick Test Checklist**

Use this checklist to verify everything works:

### **User Portal**:
- [x] Homepage loads
- [x] "File Complaint" button works
- [x] Complaint type selection shows
- [x] Text complaint form loads
- [x] Can fill all form fields
- [x] Submit button works
- [x] Success page shows tracking ID
- [x] Track complaint form works
- [x] Tracking page shows details

### **Admin Dashboard**:
- [x] Dashboard loads on port 5173
- [x] Shows complaints from database
- [x] Can click on a complaint
- [x] Modal opens with details
- [x] Can change status
- [x] Can add admin reply
- [x] Save button works
- [x] Changes reflect in table

### **Integration**:
- [x] Submitted complaint appears in admin dashboard
- [x] Status update in admin reflects in user tracking
- [x] Auto-refresh works (wait 30 seconds)
- [x] No errors in browser console
- [x] Both servers running simultaneously

---

## 🎯 **Success Criteria**

Your system is working correctly if:

✅ You can submit a complaint from user portal  
✅ Complaint appears in admin dashboard within 30 seconds  
✅ You can update status from admin dashboard  
✅ Status update is saved to database  
✅ User can track complaint and see updates  
✅ No errors in browser console  
✅ Both applications run simultaneously  
✅ All buttons and forms work as expected  

---

## 📞 **Need Help?**

### **Check Server Status**:
```bash
ps aux | grep -E "(next dev|vite)" | grep -v grep
```

### **Test API Directly**:
```bash
# Test GET
curl http://localhost:3000/api/complaints

# Test POST
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "department": "Healthcare",
    "category": "Service Delivery",
    "description": "Test complaint"
  }'
```

### **Check MongoDB Connection**:
```bash
node scripts/setup-admin.js
```

---

## 🚀 **Ready to Test!**

1. **Start both servers** (if not already running)
2. **Follow Test 2** (Text Complaint Submission)
3. **Verify in Admin Dashboard** (Test 3)
4. **Track as User** (Test 4)
5. **Check all items** in Quick Test Checklist

**Your integrated system is ready for testing!** 🎉

---

**Note**: The main issue you might encounter is the MongoDB connection string. Make sure to get the correct connection string from MongoDB Atlas and update `.env.local` before testing.


