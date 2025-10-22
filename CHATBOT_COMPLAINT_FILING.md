# Chatbot Complaint Filing - Complete Guide

## ✅ Feature Implemented Successfully!

The chatbot now supports **conversational complaint filing** directly through the chat interface. Users can file complaints by simply chatting with the AI assistant.

---

## 🎯 How It Works

### Conversation Flow

The chatbot uses a state machine to guide users through filing a complaint:

```
IDLE → ASK_NAME → ASK_EMAIL → ASK_DEPARTMENT → ASK_CATEGORY → ASK_DESCRIPTION → CONFIRM → SUBMIT
```

### Steps

1. **Trigger Intent**: User says "I want to file a complaint" or similar phrases
2. **Collect Name**: Bot asks for full name (validates 2-100 characters)
3. **Collect Email**: Bot asks for email (validates format)
4. **Select Department**: Bot shows 8 department options (number or name)
5. **Select Category**: Bot shows 8 category options (number or name)
6. **Provide Description**: User describes complaint (10-2000 characters)
7. **Confirm**: Bot shows summary, user types "CONFIRM" or "CANCEL"
8. **Submit**: Complaint saved to MongoDB, tracking ID generated

---

## 🚀 Testing Instructions

### Step 1: Access the Chatbot
1. Navigate to http://localhost:3001
2. Open the chatbot interface (usually bottom-right corner)

### Step 2: Start Filing a Complaint

Type any of these phrases to start:
- "I want to file a complaint"
- "File a complaint"
- "Submit a complaint"
- "I need to complain"
- "Report an issue"

### Step 3: Follow the Prompts

**Example Conversation:**

```
User: I want to file a complaint

Bot: I'll help you file a complaint. Let's start by collecting some information.

First, what is your full name?

User: John Doe

Bot: Thank you, John Doe! What is your email address?

User: john.doe@example.com

Bot: Great! Now, which department does your complaint relate to?

Available departments:
1. Education
2. Healthcare
3. Transportation
4. Municipal Services
5. Police
6. Revenue
7. Agriculture
8. Environment

You can type the number or the department name.

User: 2

Bot: Department selected: Healthcare

Now, what category best describes your complaint?

Available categories:
1. Infrastructure
2. Service Delay
3. Quality Issue
4. Staff Behavior
5. Corruption
6. Safety Concern
7. Documentation
8. Other

You can type the number or the category name.

User: Service Delay

Bot: Category selected: Service Delay

Finally, please provide a detailed description of your complaint. Be as specific as possible to help us address your issue effectively.

User: I have been waiting for my medical test results for over 3 weeks. The hospital staff keeps saying they will be ready soon but I haven't received them yet. This is causing me anxiety and delaying my treatment.

Bot: Please review your complaint details:

📋 Name: John Doe
📧 Email: john.doe@example.com
🏢 Department: Healthcare
📂 Category: Service Delay
📝 Description: I have been waiting for my medical test results for over 3 weeks...

Type "CONFIRM" to submit your complaint, or "CANCEL" to start over.

User: CONFIRM

Bot: ✅ Complaint Filed Successfully!

Your tracking ID is: GR518762XYZABC

📋 Summary:
• Name: John Doe
• Email: john.doe@example.com
• Department: Healthcare
• Category: Service Delay
• Priority: Medium
• Sentiment: neutral

📧 A confirmation email will be sent to john.doe@example.com

You can track your complaint status anytime using your tracking ID.
The Healthcare department will review your complaint and respond soon.

Is there anything else I can help you with?
```

---

## 🔧 Technical Implementation

### Files Modified

1. **`lib/chatbot-service.ts`**
   - Added `ComplaintFilingState` enum
   - Added `ComplaintData` interface
   - Extended `ChatSession` with complaint state tracking
   - Added validation methods: `validateName()`, `validateEmail()`
   - Added `detectComplaintIntent()` to recognize filing requests
   - Added `handleComplaintFiling()` for state machine logic
   - Added `getComplaintData()` and `resetComplaintState()` helpers

2. **`app/api/chatbot/route.ts`**
   - Integrated complaint submission logic
   - Detects `SUBMIT_COMPLAINT` marker from service
   - Calls MongoDB to save complaint
   - Generates tracking ID using `generateTrackingId()`
   - Performs NLP analysis on description
   - Returns success message with tracking ID

### State Management

Session state is maintained in memory using the existing `Map<sessionId, ChatSession>` structure. Each session tracks:
- `complaintState`: Current step in the filing process
- `complaintData`: Collected information (name, email, department, category, description)

### Validation Rules

| Field | Validation |
|-------|-----------|
| Name | 2-100 characters, required |
| Email | Valid email format (regex), required |
| Department | Must match one of 8 available departments |
| Category | Must match one of 8 available categories |
| Description | 10-2000 characters, required |

### Available Departments

1. Education
2. Healthcare
3. Transportation
4. Municipal Services
5. Police
6. Revenue
7. Agriculture
8. Environment

### Available Categories

1. Infrastructure
2. Service Delay
3. Quality Issue
4. Staff Behavior
5. Corruption
6. Safety Concern
7. Documentation
8. Other

---

## 🧪 Test Cases

### Test Case 1: Complete Flow
- **Input**: "I want to file a complaint" → provide all valid data → "CONFIRM"
- **Expected**: Complaint saved to MongoDB, tracking ID returned

### Test Case 2: Invalid Name
- **Input**: "X" (too short)
- **Expected**: "Please provide a valid name (2-100 characters)."

### Test Case 3: Invalid Email
- **Input**: "invalid-email"
- **Expected**: "Please provide a valid email address (e.g., yourname@example.com)."

### Test Case 4: Invalid Department
- **Input**: "InvalidDept"
- **Expected**: "Please select a valid department by typing the number (1-8) or the department name."

### Test Case 5: Cancel Flow
- **Input**: Complete all steps → "CANCEL" at confirmation
- **Expected**: "Complaint filing cancelled. If you need any other assistance, feel free to ask!"

### Test Case 6: Short Description
- **Input**: "Too short" (< 10 characters)
- **Expected**: "Please provide a more detailed description (at least 10 characters)."

---

## 📊 Database Integration

### Complaint Record Created

When submitted, the following is saved to MongoDB:

```javascript
{
  trackingId: "GR518762XYZABC",
  name: "John Doe",
  email: "john.doe@example.com",
  department: "Healthcare",
  category: "Service Delay",
  description: "I have been waiting for my medical test results...",
  status: "Pending",
  priority: "Medium",  // From NLP analysis
  dateFiled: Date,
  updatedAt: Date,
  sentiment: "neutral",  // From NLP analysis
  keywords: [],  // From NLP analysis
  urgency: 5,
  complexity: 5,
  tags: [],
  viewCount: 0,
  escalationLevel: 0
}
```

### Admin Dashboard

The filed complaint will immediately appear in:
- Admin Dashboard (`/admin/dashboard`)
- Tracking page (`/track/[trackingId]`)
- Statistics queries in chatbot

---

## 🎨 User Experience Features

### Natural Language Acceptance
- Department/Category can be entered as numbers (1-8) or full names
- Case-insensitive matching
- Clear error messages for invalid inputs

### Smart Validation
- Email format checking
- Length validation for all fields
- Real-time feedback

### Confirmation Step
- Shows complete summary before submission
- Option to cancel and start over
- No accidental submissions

### Professional Response
- Formatted with emojis for better readability
- Includes tracking ID prominently
- Mentions email confirmation
- Suggests next steps

---

## 🔄 Integration with Existing Features

### Compatible With:
- ✅ NLP analysis (sentiment, urgency, priority)
- ✅ Tracking system (uses same tracking ID format)
- ✅ Admin dashboard (complaints appear immediately)
- ✅ Email notifications (same flow as form submission)
- ✅ MongoDB storage (identical schema)

### Intent Detection:
The chatbot can handle multiple intents simultaneously:
- File complaint (conversational flow)
- Track complaint (query existing by tracking ID)
- Get statistics (complaint counts by status)
- General queries (AI-powered responses)

---

## 🐛 Error Handling

### Graceful Failures:
1. **MongoDB Connection Error**: Falls back to error message, doesn't crash
2. **NLP Service Error**: Uses default values, continues submission
3. **Duplicate Tracking ID**: Retries up to 10 times with new IDs
4. **Invalid Session**: Creates new session automatically

---

## 📱 Benefits

### For Users:
- ✅ Faster complaint filing (no form navigation)
- ✅ Guided step-by-step process
- ✅ Conversational, friendly interface
- ✅ Immediate tracking ID
- ✅ Can ask questions during the process

### For Admins:
- ✅ Same data structure as form submissions
- ✅ Automatic NLP analysis
- ✅ No additional processing needed
- ✅ Integrated with existing dashboard

---

## 🚦 Next Steps

1. ✅ Test the feature with multiple conversation paths
2. ✅ Verify MongoDB storage
3. ✅ Check tracking ID generation
4. ✅ Confirm admin dashboard updates
5. 📧 Test email notification (if configured)

---

## 💡 Tips

### For Testing:
- Open browser console to see API calls
- Check MongoDB Compass/Atlas for new records
- Use different session IDs to test multiple users
- Test "CANCEL" functionality
- Try invalid inputs to verify validation

### For Deployment:
- Environment variables already configured (`.env.local`)
- No additional setup needed
- OpenRouter API key in place
- MongoDB connection string configured

---

## 📞 Support

If you encounter any issues:
1. Check server console for error logs
2. Verify MongoDB connection
3. Ensure OpenRouter API key is valid
4. Clear browser cache/cookies
5. Try a new session ID

---

**Status**: ✅ Fully Implemented and Ready to Test
**Server**: Running on http://localhost:3001
**Chatbot**: Ready for conversational complaint filing!
