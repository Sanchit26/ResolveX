# OpenAI API Key Configuration - Chatbot Setup

**Date**: October 18, 2025  
**Status**: ✅ CONFIGURED AND READY

---

## 🔑 API Key Details

- **API Key Name**: `complaint` (OpenAI dashboard)
- **Environment Variable**: `OPENAI_API_KEY`
- **Location**: `/Users/syedasif/COMPLAINT-RAISE-SYSTEM-main/.env`
- **Usage**: AI Chatbot + Image Analysis

---

## ✅ Configuration Verified

### 1. Environment File (`.env`)
```env
OPENAI_API_KEY=(API)
```
✅ Key updated successfully

### 2. Chatbot Service (`lib/chatbot-service.ts`)
```typescript
private constructor() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your-openai-api-key' && apiKey.startsWith('sk-')) {
    this.openai = new OpenAI({ apiKey });
  }
}
```
✅ Service reads environment variable correctly
✅ Validates key format (starts with 'sk-')
✅ Falls back to intelligent responses if key invalid

### 3. Chatbot API Endpoint (`app/api/chatbot/route.ts`)
```typescript
const chatbotService = ChatbotService.getInstance();
const response = await chatbotService.processMessage(sessionId, enhancedMessage);
```
✅ API endpoint configured
✅ Uses OpenAI GPT-3.5-turbo model
✅ MongoDB context integration active

### 4. Frontend Component (`components/AIChatbot.tsx`)
```typescript
const response = await fetch('/api/chatbot', {
  method: 'POST',
  body: JSON.stringify({ message: text.trim(), sessionId }),
});
```
✅ Chatbot widget functional
✅ Session management enabled
✅ Error handling implemented

---

## 🚀 How It Works

### Chatbot Flow:
```
User opens chatbot widget
    ↓
User types message → POST /api/chatbot
    ↓
ChatbotService validates OPENAI_API_KEY
    ↓
If valid → OpenAI GPT-3.5-turbo processes message
    ↓
If invalid → Intelligent fallback responses
    ↓
Response enriched with MongoDB context:
  • Total complaints count
  • Status distribution
  • Recent complaints
    ↓
Response sent back to user in chat UI
```

---

## 🎯 Features Enabled

### 1. **AI-Powered Conversations**
- Uses OpenAI GPT-3.5-turbo
- Context-aware responses
- Natural language understanding
- Multi-turn conversation memory

### 2. **MongoDB Integration**
- Real-time complaint statistics
- Tracking ID lookup
- Status information
- Department routing help

### 3. **Smart Features**
- Automatic tracking ID detection (pattern: `GR[A-Z0-9]+`)
- Complaint statistics queries
- Department information
- Filing guidance
- Response time estimates

### 4. **Fallback System**
- Works even if OpenAI API is down
- Pre-programmed responses for common queries
- Graceful error handling

---

## 🧪 Testing the Chatbot

### Test Commands to Try:

1. **General Greeting**
   ```
   Hello
   ```
   Expected: Welcome message with capabilities

2. **Track Complaint**
   ```
   Track GR518582ZTBEMB
   ```
   Expected: Complaint status from database

3. **Statistics Query**
   ```
   How many complaints are there?
   ```
   Expected: Total, pending, in-progress, resolved counts

4. **Filing Help**
   ```
   How do I file a complaint?
   ```
   Expected: Step-by-step filing instructions

5. **Department Info**
   ```
   What departments are available?
   ```
   Expected: List of all departments

6. **General Question**
   ```
   What is the average resolution time?
   ```
   Expected: AI-generated response about timelines

---

## 📍 Where the Chatbot Appears

### Dashboard Pages:
- ✅ Public homepage (`/`)
- ✅ Complaint form (`/complaint`)
- ✅ Tracking page (`/track/[trackingId]`)
- ✅ Admin dashboard (`/admin/dashboard`)

### Widget Position:
- Bottom-right corner (fixed position)
- Click to expand/collapse
- Persistent across page navigation

---

## 🔧 Configuration Details

### OpenAI Settings:
```typescript
{
  model: 'gpt-3.5-turbo',
  max_tokens: 500,
  temperature: 0.7
}
```

### Session Management:
- Unique session ID per user
- Last 10 messages kept in context
- Session persists during browser session

### MongoDB Context:
- Fetches recent 10 complaints
- Provides real-time statistics
- Enriches AI responses with actual data

---

## 🛡️ Security Notes

### ✅ Implemented:
- API key stored in environment variable (`.env`)
- **NOT** exposed to client-side code
- **NOT** committed to git (`.env` in `.gitignore`)
- Server-side API calls only

### ⚠️ Important:
- Never share the API key publicly
- Rotate key if accidentally exposed
- Monitor OpenAI usage dashboard for unexpected activity
- Set usage limits in OpenAI dashboard

---

## 💰 Cost Considerations

### GPT-3.5-turbo Pricing (as of Oct 2025):
- **Input**: ~$0.0005 per 1K tokens
- **Output**: ~$0.0015 per 1K tokens

### Typical Chat Message:
- User message: ~50 tokens
- System context: ~200 tokens
- AI response: ~150 tokens
- **Total per message**: ~400 tokens ≈ $0.0008

### Monthly Estimates:
- 100 messages/day: ~$2.40/month
- 500 messages/day: ~$12/month
- 1000 messages/day: ~$24/month

---

## 🚨 Troubleshooting

### Issue: "OpenAI API key not configured"
**Solution**: Restart development server after updating `.env`
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Issue: Chatbot returns fallback responses
**Check**:
1. API key starts with `sk-proj-` or `sk-`
2. Key is not placeholder value
3. `.env` file exists in project root
4. Server restarted after `.env` change

### Issue: "Rate limit exceeded"
**Solution**: 
- Check OpenAI dashboard for usage limits
- Implement request throttling
- Cache common responses

### Issue: Slow responses
**Causes**:
- OpenAI API latency (normal)
- MongoDB connection delay
- Network issues

**Mitigation**:
- Show loading indicator (already implemented)
- Consider response streaming for long answers
- Cache frequent queries

---

## 📊 Monitoring

### What to Track:
1. **API Usage** (OpenAI Dashboard)
   - Token consumption
   - Request count
   - Error rate

2. **Chatbot Performance** (Application Logs)
   - Response times
   - Success/failure ratio
   - Common queries

3. **User Engagement**
   - Messages per session
   - Most asked questions
   - Resolution rate

---

## 🔄 Next Steps (Optional Enhancements)

### Recommended Improvements:

1. **Response Caching**
   ```typescript
   // Cache common queries to reduce API calls
   const cache = new Map<string, string>();
   ```

2. **Conversation Analytics**
   ```typescript
   // Track most common queries
   await analytics.logChatQuery(message, sessionId);
   ```

3. **Rate Limiting**
   ```typescript
   // Prevent API abuse
   const rateLimiter = new RateLimiter(10, '1m');
   ```

4. **Streaming Responses**
   ```typescript
   // For longer responses, stream token by token
   const stream = await openai.chat.completions.create({ stream: true });
   ```

5. **User Feedback**
   ```typescript
   // Thumbs up/down on responses
   <FeedbackButtons onRate={handleRate} />
   ```

6. **Multi-language Support**
   ```typescript
   // Detect language and respond accordingly
   const language = detectLanguage(message);
   ```

---

## ✅ Verification Checklist

- [x] OpenAI API key added to `.env`
- [x] Key format validated (starts with `sk-proj-`)
- [x] ChatbotService reads environment variable
- [x] API endpoint configured
- [x] Frontend component integrated
- [x] MongoDB context enabled
- [x] Fallback responses implemented
- [x] Error handling active
- [x] Development server running
- [x] Ready for testing

---

## 🎉 Status: READY TO USE

Your AI chatbot is now fully configured and operational!

**Access**: Visit `http://localhost:3002` (or your active port)  
**Widget**: Look for the chat icon in the bottom-right corner  
**Test**: Try asking questions or tracking a complaint  

---

**Configuration Date**: October 18, 2025  
**Configured By**: AI Assistant  
**Next Review**: Before production deployment
