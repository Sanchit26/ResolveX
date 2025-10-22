# 🚀 Quick Start: Test Chatbot Complaint Filing

## ✅ Ready to Test!

Your chatbot now supports conversational complaint filing. Here's how to test it in **under 2 minutes**.

---

## 📍 Server Status

- **URL**: http://localhost:3001
- **Status**: ✅ Running
- **Feature**: ✅ Chatbot Complaint Filing Implemented

---

## 🎯 Quick Test (2 Minutes)

### Step 1: Open the Chatbot
1. Navigate to **http://localhost:3001**
2. Look for the chatbot icon (usually bottom-right corner)
3. Click to open the chat interface

### Step 2: Start the Conversation
Type exactly:
```
I want to file a complaint
```

### Step 3: Follow These Prompts

**Bot asks for name:**
```
John Doe
```

**Bot asks for email:**
```
john.doe@example.com
```

**Bot shows 8 departments, asks which one:**
```
2
```
*(This selects Healthcare)*

**Bot shows 8 categories, asks which one:**
```
Service Delay
```

**Bot asks for description:**
```
I have been waiting for my medical test results for over 3 weeks. The hospital staff keeps saying they will be ready soon but I haven't received them yet. This is causing me anxiety and delaying my treatment.
```

**Bot shows summary and asks for confirmation:**
```
CONFIRM
```

### Step 4: Get Your Tracking ID ✅

The bot will respond with:
```
✅ Complaint Filed Successfully!

Your tracking ID is: GR518762XYZABC

📋 Summary:
• Name: John Doe
• Email: john.doe@example.com
• Department: Healthcare
• Category: Service Delay
• Priority: Medium
• Sentiment: neutral
...
```

---

## 🔍 Verify in Admin Dashboard

1. Open **http://localhost:3001/admin/dashboard**
2. Look for your new complaint:
   - Name: John Doe
   - Department: Healthcare
   - Category: Service Delay
   - Status: Pending
3. Click to view full details
4. You can update the status (In Progress, Resolved, Rejected)

---

## 🧪 Test Different Scenarios

### Test 1: Use Department Names (not numbers)
```
User: I want to file a complaint
Bot: What is your full name?
User: Jane Smith
Bot: What is your email?
User: jane@example.com
Bot: Which department?
User: Education  ← Type the full name
Bot: Department selected: Education
...
```

### Test 2: Test Validation Errors
```
User: I want to file a complaint
Bot: What is your full name?
User: X  ← Too short!
Bot: Please provide a valid name (2-100 characters).
User: Jane Smith  ← Valid
Bot: What is your email?
User: invalid-email  ← Invalid format!
Bot: Please provide a valid email address (e.g., yourname@example.com).
User: jane@example.com  ← Valid
...
```

### Test 3: Cancel Midway
```
User: I want to file a complaint
→ Fill in name, email, department, category, description
Bot: Review your details... Type CONFIRM or CANCEL
User: CANCEL  ← Cancel it
Bot: Complaint filing cancelled. If you need any other assistance, feel free to ask!
```

---

## 📋 Available Departments

1. Education
2. Healthcare
3. Transportation
4. Municipal Services
5. Police
6. Revenue
7. Agriculture
8. Environment

*(You can type the number OR the name)*

---

## 📂 Available Categories

1. Infrastructure
2. Service Delay
3. Quality Issue
4. Staff Behavior
5. Corruption
6. Safety Concern
7. Documentation
8. Other

*(You can type the number OR the name)*

---

## ✅ What to Check

After filing a complaint:

- [x] Tracking ID is generated (format: GR + 12 characters)
- [x] Complaint appears in admin dashboard
- [x] All fields are correctly saved
- [x] Status is "Pending"
- [x] NLP analysis is performed (sentiment, priority)
- [x] Can update status in admin dashboard
- [x] Can track using tracking ID

---

## 🎯 Validation Rules

| Field | Rule | Example Error |
|-------|------|---------------|
| Name | 2-100 chars | "Please provide a valid name (2-100 characters)" |
| Email | Valid format | "Please provide a valid email address" |
| Department | Must be 1-8 or valid name | "Please select a valid department" |
| Category | Must be 1-8 or valid name | "Please select a valid category" |
| Description | 10-2000 chars | "Please provide a more detailed description" |

---

## 🔗 Other Chatbot Features

You can also test:

### Track a Complaint
```
User: Track GR518762XYZABC
Bot: Shows complaint status, department, priority, etc.
```

### Get Statistics
```
User: How many total complaints?
Bot: Shows total, pending, in progress, resolved counts
```

### General Questions
```
User: How do I file a complaint?
Bot: AI-powered response with guidance
```

---

## 📞 Troubleshooting

### Chatbot not responding?
- Check browser console for errors
- Verify server is running on port 3001
- Check MongoDB connection in server logs

### Tracking ID not generated?
- Check server console for MongoDB errors
- Verify .env.local has MONGODB_URI
- Try again (system retries up to 10 times)

### Admin dashboard not showing complaint?
- Refresh the page (auto-refreshes every 60s)
- Check MongoDB directly using Compass/Atlas
- Verify the complaint was actually saved (check server logs)

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Bot guides you through all steps
- ✅ Validation errors show clear messages
- ✅ Tracking ID is returned after CONFIRM
- ✅ Complaint appears in admin dashboard
- ✅ Can update status in admin panel
- ✅ MongoDB has the new document

---

## 📱 Next Steps

1. **Test all scenarios** (happy path, validation, cancellation)
2. **Verify MongoDB storage** (check admin dashboard)
3. **Test tracking** (use the tracking ID you received)
4. **Try different departments** (all 8 options)
5. **Test edge cases** (very long description, special characters)

---

## 💡 Pro Tips

- Use numbers for faster department/category selection
- Description should be detailed (10+ characters minimum)
- Type "CANCEL" at confirmation to restart
- Each session is isolated (use different browsers for multiple users)
- Check server console for detailed logs

---

**Server**: http://localhost:3001  
**Admin Dashboard**: http://localhost:3001/admin/dashboard  
**Status**: ✅ Ready to Test  
**Feature**: ✅ Fully Functional

---

## 📚 More Information

- Full documentation: `CHATBOT_COMPLAINT_FILING.md`
- Technical summary: `CHATBOT_COMPLAINT_FILING_SUMMARY.md`
- Implementation details: `lib/chatbot-service.ts`

---

**Happy Testing! 🚀**
