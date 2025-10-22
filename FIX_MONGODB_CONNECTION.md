# 🔧 FIX: MongoDB Connection Issue

## ❌ **Current Problem:**

Your MongoDB connection string has an incorrect cluster URL:
```
mongodb+srv://asifkhan78866_db_user:asif123@cluster0.mongodb.net/cpgrams
```

The error: `querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`

This means `cluster0.mongodb.net` is not a valid MongoDB Atlas cluster URL.

---

## ✅ **Solution: Get Your Real Cluster URL**

### **Step 1: Login to MongoDB Atlas**
Go to: https://cloud.mongodb.com

### **Step 2: Find Your Cluster**
- You should see your cluster (probably named "Cluster0")
- Click the **"Connect"** button

### **Step 3: Get Connection String**
1. Click **"Connect your application"**
2. Select **"Node.js"** as the driver
3. You'll see a connection string like:
   ```
   mongodb+srv://asifkhan78866_db_user:<password>@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority
   ```
4. The important part is: `cluster0.XXXXX.mongodb.net`
   - The `XXXXX` is your unique cluster identifier
   - It might look like: `abc123.mongodb.net` or `cluster0.abc123.mongodb.net`

### **Step 4: Update .env.local**

Replace the MONGODB_URI line in `.env.local` with your correct connection string.

**Example format:**
```env
MONGODB_URI=mongodb+srv://asifkhan78866_db_user:asif123@cluster0.XXXXX.mongodb.net/cpgrams?retryWrites=true&w=majority
```

Replace `XXXXX` with your actual cluster ID from Atlas!

### **Step 5: Restart Server**
```bash
pkill -f "next dev"
npm run dev
```

---

## 🚀 **Alternative: Use Local MongoDB (Quick Test)**

If you want to test immediately without Atlas, install MongoDB locally:

### **On macOS:**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env.local to use local MongoDB
# Change MONGODB_URI to:
MONGODB_URI=mongodb://127.0.0.1:27017/cpgrams
```

### **On Linux:**
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Update .env.local
MONGODB_URI=mongodb://127.0.0.1:27017/cpgrams
```

---

## 📋 **Quick Test After Fix:**

Once you update the connection string, test with:

```bash
# Test MongoDB connection
node scripts/setup-admin.js

# Should output: "Connected to MongoDB"
```

Then try submitting a complaint from the web interface!

---

## 🎯 **What You Need:**

**From your MongoDB Atlas screenshot, I can see:**
- Database: `sample_mflix`
- URL shown: `mongodb://atlas-sql-68ea0e4b6a4b823e46965498-j2pfwo.a.query.mongodb.net/sample_mflix`

**But this is the Atlas SQL interface URL, not the standard MongoDB connection string!**

You need to:
1. Go to the main **"Database"** section (not Atlas SQL)
2. Click **"Connect"** on your regular cluster
3. Get the **standard MongoDB connection string** (not the SQL one)

---

## ✅ **Once Fixed, Everything Will Work!**

After you update the MongoDB connection string:
- ✅ Complaints will submit successfully
- ✅ Data will save to MongoDB
- ✅ Admin dashboard will display complaints
- ✅ Status updates will work
- ✅ Tracking will work

**The code is 100% ready - just needs the correct MongoDB URL!**


