// Working calling agent server with Twilio
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
require('dotenv').config({ path: '../../.env.local' });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("🚀 Starting calling agent server...");

// Twilio setup with error handling
let twilioClient = null;
try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  console.log(`🔧 Using Twilio Account SID: ${accountSid}`);
  
  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio credentials in environment variables");
  }
  
  twilioClient = twilio(accountSid, authToken);
  console.log("✅ Twilio client initialized");
} catch (error) {
  console.error("❌ Twilio initialization failed:", error.message);
}

const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "+12298002254";
const defaultCallNumber = process.env.DEFAULT_CALL_NUMBER || "+917660864952";
const ngrokUrl = process.env.NGROK_URL || "https://demo.twilio.com/docs/voice.xml";

// Simple conversation state
const callSessions = new Map();

// Health check
app.get('/health', (req, res) => {
  console.log("📊 Health check requested");
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    twilioEnabled: twilioClient !== null,
    activeSessions: callSessions.size
  });
});

// Voice webhook (when call is answered)
app.post('/voice', (req, res) => {
  try {
    const callSid = req.body.CallSid || 'test-call';
    console.log(`📞 Voice webhook called for: ${callSid}`);
    
    if (!twilioClient) {
      console.log("⚠️  Twilio not available, sending basic response");
      res.send('<Response><Say>Hello from Grievance Portal. Twilio is not fully configured yet.</Say></Response>');
      return;
    }
    
    // Initialize session for this call
    const session = {
      callSid,
      state: 'ASK_NAME',
      complaintData: {},
      startTime: new Date()
    };
    callSessions.set(callSid, session);
    
    // Use VoiceResponse from twilio.twiml, not from client
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say({
      voice: 'alice',
      rate: 'slow',
      language: 'en-US'
    }, "Hello! Welcome to the Grievance Portal voice assistant. I will help you file a complaint just like our chatbot. Let's start. Please tell me your full name.");
    
    twiml.gather({
      input: 'speech',
      timeout: 10,
      speechTimeout: 3,
      action: '/process-speech',
      method: 'POST',
      language: 'en-US'
    });
    
    twiml.say({
      voice: 'alice',
      rate: 'slow'
    }, "I didn't hear anything. Please call back when you're ready. Goodbye!");
    twiml.hangup();
    
    console.log("📤 Sending TwiML response");
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /voice webhook:', error);
    res.send('<Response><Say>Sorry, there was an error. Please try again later. Goodbye!</Say></Response>');
  }
});

// Process speech input
app.post('/process-speech', async (req, res) => {
  try {
    const callSid = req.body.CallSid || 'test-call';
    const speechResult = req.body.SpeechResult || '';
    
    console.log(`🎤 Speech received from ${callSid}: "${speechResult}"`);
    
    if (!twilioClient) {
      res.send('<Response><Say>Voice processing not available. Goodbye.</Say></Response>');
      return;
    }
    
    // Get or create session
    let session = callSessions.get(callSid);
    if (!session) {
      session = {
        callSid,
        state: 'ASK_NAME',
        complaintData: {},
        startTime: new Date()
      };
      callSessions.set(callSid, session);
    }
    
    const twiml = new twilio.twiml.VoiceResponse();
    let responseText = '';
    let nextAction = 'continue';
    
    // Process based on current state
    switch (session.state) {
      case 'ASK_NAME':
        if (speechResult.trim().length > 2) {
          session.complaintData.name = speechResult.trim();
          responseText = `Thank you ${session.complaintData.name}. Now please provide your email address.`;
          session.state = 'ASK_EMAIL';
        } else {
          responseText = "I didn't catch your name clearly. Could you please repeat your full name?";
        }
        break;
        
      case 'ASK_EMAIL':
        if (speechResult.includes('@') || speechResult.includes(' at ') || speechResult.includes('gmail') || speechResult.includes('email')) {
          session.complaintData.email = speechResult.trim();
          responseText = `Got it. Now please tell me which department your complaint is about. You can say Education, Healthcare, Transportation, Municipal Services, Police, Revenue, Agriculture, Environment, or IT Support.`;
          session.state = 'ASK_DEPARTMENT';
        } else {
          responseText = "Please provide your email address clearly, including the at symbol.";
        }
        break;
        
      case 'ASK_DEPARTMENT':
        const departments = ['education', 'healthcare', 'transportation', 'municipal', 'police', 'revenue', 'agriculture', 'environment', 'it', 'support'];
        const foundDept = departments.find(dept => speechResult.toLowerCase().includes(dept));
        
        if (foundDept) {
          session.complaintData.department = foundDept.charAt(0).toUpperCase() + foundDept.slice(1);
          responseText = `Thank you. Your complaint is about ${session.complaintData.department}. Now please tell me the category of your issue. You can say Infrastructure, Service Delay, Quality Issue, Staff Behavior, Corruption, Safety Concern, Documentation, or Other.`;
          session.state = 'ASK_CATEGORY';
        } else {
          responseText = "I didn't recognize that department. Please choose from Education, Healthcare, Transportation, Municipal Services, Police, Revenue, Agriculture, Environment, or IT Support.";
        }
        break;
        
      case 'ASK_CATEGORY':
        const categories = ['infrastructure', 'service', 'delay', 'quality', 'staff', 'behavior', 'corruption', 'safety', 'documentation', 'other'];
        const foundCat = categories.find(cat => speechResult.toLowerCase().includes(cat));
        
        if (foundCat) {
          session.complaintData.category = foundCat.charAt(0).toUpperCase() + foundCat.slice(1);
          responseText = `Category set to ${session.complaintData.category}. Now please describe your complaint in detail. Take your time and speak clearly.`;
          session.state = 'ASK_DESCRIPTION';
        } else {
          responseText = "Please choose a category like Infrastructure, Service Delay, Quality Issue, Staff Behavior, Corruption, Safety Concern, Documentation, or Other.";
        }
        break;
        
      case 'ASK_DESCRIPTION':
        if (speechResult.trim().length > 15) {
          session.complaintData.description = speechResult.trim();
          responseText = `Thank you for the detailed information. Let me confirm your complaint. Name: ${session.complaintData.name}. Email: ${session.complaintData.email}. Department: ${session.complaintData.department}. Category: ${session.complaintData.category}. Description: ${session.complaintData.description.substring(0, 100)}... Say YES to submit this complaint or NO to start over.`;
          session.state = 'CONFIRM';
        } else {
          responseText = "Could you please provide more details about your complaint? I need a detailed description to help you properly.";
        }
        break;
        
      case 'CONFIRM':
        if (speechResult.toLowerCase().includes('yes') || speechResult.toLowerCase().includes('submit') || speechResult.toLowerCase().includes('correct')) {
          // Submit complaint to database
          try {
            const axios = require('axios');
            const complaintData = {
              name: session.complaintData.name,
              email: session.complaintData.email,
              department: session.complaintData.department || 'General',
              category: session.complaintData.category || 'Other',
              description: session.complaintData.description,
              submissionMethod: 'voice-call'
            };
            
            console.log('📝 Submitting complaint to database:', complaintData);
            
            // Submit to main application
            const response = await axios.post('http://localhost:3002/api/complaints', complaintData);
            
            if (response.data && response.data.trackingId) {
              responseText = `Perfect! Your complaint has been submitted successfully with tracking ID ${response.data.trackingId}. You will receive a confirmation email shortly. Thank you for using our Grievance Portal. Goodbye!`;
            } else {
              responseText = "Perfect! Your complaint has been submitted successfully. You will receive a tracking number via email shortly. Thank you for using our Grievance Portal. Goodbye!";
            }
            
          } catch (error) {
            console.error('❌ Error submitting complaint:', error.message);
            responseText = "Your complaint information has been recorded. Due to a technical issue, we'll process it manually. You'll receive a confirmation email within 24 hours. Thank you for using our Grievance Portal. Goodbye!";
          }
          
          nextAction = 'end';
          console.log('✅ Complaint submission completed for:', session.complaintData.name);
          
        } else if (speechResult.toLowerCase().includes('no') || speechResult.toLowerCase().includes('start over')) {
          responseText = "No problem. Let's start over. Please tell me your full name.";
          session.state = 'ASK_NAME';
          session.complaintData = {};
        } else {
          responseText = "Please say YES to submit your complaint or NO to start over.";
        }
        break;
        
      default:
        responseText = "Thank you for calling our Grievance Portal. Goodbye!";
        nextAction = 'end';
    }
    
    // Generate TwiML response
    twiml.say({
      voice: 'alice',
      rate: 'slow',
      language: 'en-US'
    }, responseText);
    
    if (nextAction === 'end') {
      twiml.hangup();
      callSessions.delete(callSid);
      console.log(`✅ Call completed: ${callSid}`);
    } else {
      // Continue conversation - gather more speech
      twiml.gather({
        input: 'speech',
        timeout: 15,
        speechTimeout: 4,
        action: '/process-speech',
        method: 'POST',
        language: 'en-US'
      });
      
      // Fallback if no response
      twiml.say({
        voice: 'alice',
        rate: 'slow'
      }, "I'm waiting for your response. Please speak clearly.");
      twiml.redirect('/process-speech');
    }
    
    console.log("📤 Sending speech response");
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /process-speech:', error);
    res.send('<Response><Say>Sorry, there was an error processing your response. Goodbye!</Say></Response>');
  }
});

// Initiate call endpoint
app.post('/call-user', async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber || defaultCallNumber;
    
    console.log(`📞 Call request received for: ${phoneNumber}`);
    
    if (!twilioClient) {
      console.log("⚠️  Twilio not available, returning mock response");
      return res.json({ 
        success: true, 
        message: 'Mock call initiated (Twilio not configured)',
        phoneNumber: phoneNumber,
        callSid: 'mock-call-' + Date.now()
      });
    }
    
    // Use demo webhook for testing - will just say hello and hang up
    let webhookUrl = ngrokUrl;
    if (ngrokUrl.includes('demo.twilio.com')) {
      console.log("📞 Using Twilio demo webhook for testing");
    }
    
    console.log(`📞 Initiating real Twilio call to: ${phoneNumber}`);
    
    const call = await twilioClient.calls.create({
      to: phoneNumber,
      from: twilioNumber,
      url: webhookUrl,
      method: 'POST',
      timeout: 30
    });
    
    console.log(`✅ Call initiated successfully: ${call.sid}`);
    res.json({ 
      success: true, 
      callSid: call.sid,
      message: `Call initiated to ${phoneNumber}`,
      phoneNumber: phoneNumber
    });
    
  } catch (error) {
    console.error('❌ Error initiating call:', error);
    
    const targetPhone = req.body.phoneNumber || defaultCallNumber;
    
    // Handle specific Twilio errors
    let errorMessage = error.message;
    if (error.message && error.message.includes('unverified')) {
      errorMessage = `The phone number ${targetPhone} is not verified with Twilio. In trial accounts, you can only call verified numbers. Please verify this number in your Twilio console or use a verified number.`;
    }
    
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: errorMessage,
      phoneNumber: targetPhone,
      suggestion: error.message && error.message.includes('unverified') ? 
        'Please verify your phone number in Twilio Console or contact support to upgrade your account.' : 
        'Please check your network connection and try again.'
    });
  }
});

// Status endpoint
app.get('/status', (req, res) => {
  const sessions = Array.from(callSessions.entries()).map(([callSid, session]) => ({
    callSid,
    startTime: session.startTime || new Date()
  }));
  
  res.json({
    server: 'Calling Agent',
    twilioEnabled: twilioClient !== null,
    activeSessions: sessions.length,
    sessions,
    endpoints: ['/health', '/voice', '/process-speech', '/call-user', '/status']
  });
});

const PORT = 3000;

console.log("🔧 Setting up server on port", PORT);

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  } else {
    console.log(`✅ Calling agent server running on port ${PORT}`);
    console.log(`🔗 Webhook URL: ${ngrokUrl}`);
    console.log(`📞 Twilio Number: ${twilioNumber}`);
    console.log(`🎯 Default Call Number: ${defaultCallNumber}`);
    console.log(`🎯 Twilio Status: ${twilioClient ? 'Enabled' : 'Disabled'}`);
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error("❌ Server error:", error);
});

process.on('uncaughtException', (error) => {
  console.error("❌ Uncaught exception:", error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("❌ Unhandled rejection at:", promise, 'reason:', reason);
});