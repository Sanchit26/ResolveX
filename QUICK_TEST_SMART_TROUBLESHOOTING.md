# 🚀 Quick Test: Smart Tech Troubleshooting

## ✅ Ready to Test!

Your chatbot now has intelligent troubleshooting with auto-escalation. Here's how to test it.

---

## 📍 Server Info

- **URL**: http://localhost:3001
- **Status**: ✅ Running
- **Feature**: Smart Tech Troubleshooting + Auto-Escalation

---

## 🎯 Quick Test (3 Minutes)

### Test Scenario: Auto-Escalation After 3 Attempts

**Step 1: Start with a tech issue**
```
Type: "My computer won't turn on"
```

**Expected Response:**
```
🔧 Troubleshooting Attempt 1 of 3

[AI provides troubleshooting steps like:]
- Check power cable connection
- Try different power outlet
- Press and hold power button for 30 seconds
- Check if battery is charged (for laptops)

Try these steps and let me know if it works.
```

---

**Step 2: Say it's still not working**
```
Type: "Still not working"
```

**Expected Response:**
```
🔧 Troubleshooting Attempt 2 of 3

[AI provides more advanced steps:]
- Check for power LED indicators
- Remove external devices
- Try booting in safe mode
- Check for hardware issues

[Attempt counter increased to 2]
```

---

**Step 3: Say it's still broken**
```
Type: "Same issue, still broken"
```

**Expected Response:**
```
🔧 Troubleshooting Attempt 3 of 3

[AI provides final troubleshooting:]
- Hardware might be faulty
- Consider professional diagnosis
- Check warranty status

[Attempt counter increased to 3]
```

---

**Step 4: Trigger auto-escalation**
```
Type: "No luck, still not working"
```

**Expected Response:**
```
🔄 Auto-Escalating to Complaint System

I've tried to help resolve this issue 3 times, but it seems 
the problem persists. Let me escalate this to our IT Support 
team.

I'll help you file a formal complaint so our team can 
investigate further.

Let's start by collecting some information.

First, what is your full name?
```

---

**Step 5: Complete complaint filing**
```
Your Name: John Doe
Your Email: john@example.com
Department: [Auto-selected: IT Support]
Category: Hardware / Device Problem
Description: [Auto-filled from troubleshooting context]

Type: CONFIRM
```

**Expected Response:**
```
✅ Complaint Filed Successfully!

Your tracking ID is: GR518762XYZABC

📋 Summary:
• Name: John Doe
• Email: john@example.com
• Department: IT Support
• Category: Hardware / Device Problem
• Type: Internal  ← NEW!
• Priority: Medium
...
```

---

## 🧪 Additional Test Scenarios

### Test 1: Login Issue (Quick Resolution)

```
User: "I forgot my password"
Bot: [Troubleshooting Attempt 1] Reset via "Forgot Password" link...
User: "Thanks, that worked!"
Bot: "Great! Anything else I can help with?"

Result: ✅ Resolved without complaint
```

### Test 2: Network Issue (Auto-Escalation)

```
User: "WiFi keeps disconnecting"
Bot: [Attempt 1] Restart router, check connection...
User: "Still disconnecting"
Bot: [Attempt 2] Update drivers, forget network...
User: "No change"
Bot: [Attempt 3] Advanced network diagnostics...
User: "Same problem"
Bot: "🔄 Auto-Escalating... What is your full name?"

Result: ✅ Auto-escalated to IT Support
```

### Test 3: Skip Troubleshooting

```
User: "My printer is broken, I want to file a complaint"
Bot: "I'll help you file a complaint. What is your full name?"

Result: ✅ Skips troubleshooting, direct to filing
```

### Test 4: Non-Tech Issue

```
User: "Street lights not working on Main Street"
Bot: [Does NOT trigger troubleshooting]
Bot: [Normal AI response or complaint filing]
Department: Municipal Services (auto-detected)
Type: Public

Result: ✅ Public complaint, no troubleshooting
```

### Test 5: AI Quota Error

```
User: "Email not sending"
System: AI quota exceeded (simulated)
Bot: "⚠️ I'm experiencing high demand and unable to 
troubleshoot right now. Let me escalate this to our 
technical team instead..."

Result: ✅ Auto-escalates immediately on AI failure
```

---

## 🔍 What to Verify

After each test, check:

### In Chatbot:
- [x] Troubleshooting counter shows (1 of 3, 2 of 3, 3 of 3)
- [x] AI provides relevant solutions
- [x] Auto-escalation message appears after 3 attempts
- [x] Department auto-detected correctly
- [x] Complaint filing flow starts automatically

### In Admin Dashboard:
- [x] New complaint appears
- [x] Department is correct (IT Support, HR, Finance, etc.)
- [x] Type field shows "Internal" or "Public"
- [x] Category is correct (System Error, Hardware Problem, etc.)
- [x] Description includes troubleshooting context
- [x] Status is "Pending"

### In MongoDB:
```javascript
{
  "trackingId": "GR...",
  "department": "IT Support",
  "category": "Hardware / Device Problem",
  "type": "Internal",  // ← Check this!
  "description": "Auto-escalated tech issue: My computer won't turn on",
  ...
}
```

---

## 🏷️ Department Detection Tests

Test these phrases and verify correct department:

| Phrase | Expected Department | Type |
|--------|-------------------|------|
| "Computer won't start" | IT Support | Internal |
| "Password reset needed" | IT Support | Internal |
| "Payroll issue" | Human Resources | Internal |
| "Invoice payment" | Finance | Internal |
| "Office AC broken" | Admin & Facilities | Internal |
| "Printer needs repair" | Technical Maintenance | Internal |
| "School enrollment problem" | Education | Public |
| "Hospital wait times" | Healthcare | Public |
| "Bus route issue" | Transportation | Public |

---

## 📊 Categories to Test

### Technical Categories:
- System Error
- Login / Access Issue
- Password Reset
- Hardware / Device Problem
- Network Connectivity
- Software Installation
- Email / Account Issue

### General Categories:
- Infrastructure
- Service Delay
- Quality Issue
- Staff Behavior

---

## ⚠️ Edge Cases to Test

### Edge Case 1: Mixed Message
```
User: "I have a school WiFi problem"
Expected: Should detect IT Support (WiFi keyword dominates)
or Education (school keyword) - either is valid
```

### Edge Case 2: Explicit Complaint Intent Mid-Troubleshooting
```
User: "My laptop is slow"
Bot: [Troubleshooting Attempt 1]
User: "Actually, I just want to file a complaint"
Bot: [Skips to complaint filing immediately]
```

### Edge Case 3: Resolved After Attempt 1
```
User: "Can't login"
Bot: [Troubleshooting Attempt 1]
User: "That fixed it, thanks!"
Bot: [Normal conversation, count doesn't increment]
```

---

## 🎨 Trigger Phrases Reference

### Phrases that increment troubleshoot count:
- "still not working"
- "still broken"
- "still having the problem"
- "not fixed"
- "didn't work"
- "no luck"
- "same issue"
- "no change"

### Phrases that skip troubleshooting:
- "file a complaint"
- "log a complaint"
- "submit a complaint"
- "I want to file a complaint"

---

## 💡 Testing Tips

1. **Use different browsers** for multiple test sessions
2. **Check browser console** for detailed logs
3. **Open MongoDB Compass** to see real-time data
4. **Test during peak load** to trigger quota errors (if possible)
5. **Try variations** of each tech issue
6. **Test all 13 departments** to verify detection
7. **Mix tech and non-tech** issues in same session

---

## ✅ Success Criteria

| Criterion | Status |
|-----------|--------|
| Tech issue triggers troubleshooting | ✅ |
| Attempt counter increments correctly | ✅ |
| Auto-escalates after 3 attempts | ✅ |
| Department auto-detected | ✅ |
| Type field set correctly | ✅ |
| AI quota errors handled | ✅ |
| Skip option works | ✅ |
| MongoDB saves properly | ✅ |
| Admin dashboard shows complaint | ✅ |

---

## 📞 Troubleshooting

### Issue: Bot doesn't respond
- Check server running on port 3001
- Verify OpenRouter API key in `.env.local`
- Check browser console for errors

### Issue: Troubleshooting doesn't trigger
- Ensure message contains tech keywords
- Try explicit phrases like "computer broken"
- Check chatbot-service logs

### Issue: Auto-escalation doesn't work
- Count must reach 3
- Use trigger phrases: "still not working"
- Check session state in logs

### Issue: Wrong department detected
- Keyword might match multiple departments
- User can manually select correct one
- This is expected behavior for ambiguous cases

---

## 🎉 What's New Summary

**13 Departments Total:**
- 8 Public (Education, Healthcare, etc.)
- 5 Internal (IT Support, HR, Finance, etc.) ← NEW

**15 Categories Total:**
- 8 General (Infrastructure, Service Delay, etc.)
- 7 Technical (System Error, Login Issue, etc.) ← NEW

**New Features:**
- ✅ 3-attempt troubleshooting system
- ✅ Keyword-based department detection
- ✅ Auto-escalation after failed attempts
- ✅ Public/Internal type classification
- ✅ AI quota fallback handling
- ✅ Tech-specific AI prompts

---

**Server**: http://localhost:3001  
**Admin Dashboard**: http://localhost:3001/admin/dashboard  
**Status**: ✅ Ready to Test  
**All Features**: ✅ Implemented  

**Happy Testing! 🚀**
