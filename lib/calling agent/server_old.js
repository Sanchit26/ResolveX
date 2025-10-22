// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Simple conversation state for each call
const callSessions = new Map();

// Available departments and categories (simplified for voice)
const departments = {
  '1': 'Education', '2': 'Healthcare', '3': 'Transportation', '4': 'Municipal Services',
  '5': 'Police', '6': 'Revenue', '7': 'Agriculture', '8': 'Environment',
  '9': 'IT Support'
};

const categories = {
  '1': 'Infrastructure', '2': 'Service Delay', '3': 'Quality Issue', 
  '4': 'Staff Behavior', '5': 'Corruption', '6': 'Safety Concern', 
  '7': 'Documentation', '8': 'Other', '9': 'System Error'
};

// Initialize conversation session
function initializeCallSession(callSid) {
  const session = {
    callSid,
    state: 'GREETING',
    complaintData: {},
    attempts: 0,
    startTime: new Date()
  };
  callSessions.set(callSid, session);
  console.log(`📞 New call session initialized: ${callSid}`);
  return session;
}

// Get or create session
function getCallSession(callSid) {
  return callSessions.get(callSid) || initializeCallSession(callSid);
}

// Generate text-to-speech response based on conversation state
function generateResponse(session, userInput = '') {
  const { state, complaintData, attempts } = session;
  let responseText = '';
  let nextState = state;
  
  console.log(`🎯 Processing state: ${state}, Input: "${userInput}", Attempts: ${attempts}`);
  
  try {
    switch (state) {
      case 'GREETING':
        responseText = "Hello! Welcome to the Grievance Portal voice assistant. I will help you file a complaint. Let's start. Please tell me your full name.";
        nextState = 'ASK_NAME';
        break;
        
      case 'ASK_NAME':
        if (userInput && userInput.trim().length > 2) {
          complaintData.name = userInput.trim();
          responseText = `Thank you ${complaintData.name}. Now please provide your email address.`;
          nextState = 'ASK_EMAIL';
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            responseText = "I'm having trouble hearing your name clearly. Let me transfer you to our web form. Please visit our website to file your complaint. Thank you.";
            nextState = 'END';
          } else {
            responseText = "I didn't catch your name clearly. Could you please repeat your full name?";
          }
        }
        break;
        
      case 'ASK_EMAIL':
        if (userInput && userInput.includes('@')) {
          complaintData.email = userInput.trim();
          responseText = `Got it. Now please choose your department. Press 1 for Education, 2 for Healthcare, 3 for Transportation, 4 for Municipal Services, 5 for Police, 6 for Revenue, 7 for Agriculture, 8 for Environment, or 9 for IT Support.`;
          nextState = 'ASK_DEPARTMENT';
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            responseText = "I'm having trouble with your email. Please visit our website to file your complaint. Thank you.";
            nextState = 'END';
          } else {
            responseText = "Please provide your email address clearly, including the at symbol.";
          }
        }
        break;
        
      case 'ASK_DEPARTMENT':
        const deptChoice = userInput.trim();
        if (departments[deptChoice]) {
          complaintData.department = departments[deptChoice];
          responseText = `You selected ${departments[deptChoice]}. Now please choose your complaint category. Press 1 for Infrastructure, 2 for Service Delay, 3 for Quality Issue, 4 for Staff Behavior, 5 for Corruption, 6 for Safety Concern, 7 for Documentation, 8 for Other, or 9 for System Error.`;
          nextState = 'ASK_CATEGORY';
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            complaintData.department = 'Other';
            responseText = `I'll set your department as Other. Now please choose your complaint category. Press 1 for Infrastructure, 2 for Service Delay, 3 for Quality Issue, 4 for Staff Behavior, 5 for Corruption, 6 for Safety Concern, 7 for Documentation, 8 for Other, or 9 for System Error.`;
            nextState = 'ASK_CATEGORY';
            session.attempts = 0;
          } else {
            responseText = "Please press a number from 1 to 9 to select your department.";
          }
        }
        break;
        
      case 'ASK_CATEGORY':
        const catChoice = userInput.trim();
        if (categories[catChoice]) {
          complaintData.category = categories[catChoice];
          responseText = `You selected ${categories[catChoice]}. Now please describe your complaint in detail. Speak clearly for about 30 seconds.`;
          nextState = 'ASK_DESCRIPTION';
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            complaintData.category = 'Other';
            responseText = `I'll set your category as Other. Now please describe your complaint in detail. Speak clearly for about 30 seconds.`;
            nextState = 'ASK_DESCRIPTION';
            session.attempts = 0;
          } else {
            responseText = "Please press a number from 1 to 9 to select your complaint category.";
          }
        }
        break;
        
      case 'ASK_DESCRIPTION':
        if (userInput && userInput.trim().length > 10) {
          complaintData.description = userInput.trim();
          responseText = `Thank you. Let me confirm your complaint. Name: ${complaintData.name}. Email: ${complaintData.email}. Department: ${complaintData.department}. Category: ${complaintData.category}. Press 1 to submit this complaint, or press 2 to start over.`;
          nextState = 'CONFIRM';
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            complaintData.description = "Voice complaint - details unclear";
            responseText = `I'll record your complaint with the basic details. Let me confirm. Name: ${complaintData.name}. Email: ${complaintData.email}. Department: ${complaintData.department}. Category: ${complaintData.category}. Press 1 to submit this complaint, or press 2 to start over.`;
            nextState = 'CONFIRM';
            session.attempts = 0;
          } else {
            responseText = "Could you please describe your complaint in more detail? Speak clearly.";
          }
        }
        break;
        
      case 'CONFIRM':
        if (userInput.includes('1')) {
          // Submit the complaint
          responseText = "Perfect! I'm submitting your complaint now. Please hold on.";
          nextState = 'SUBMITTING';
        } else if (userInput.includes('2')) {
          responseText = "No problem. Let's start over. Please tell me your full name.";
          nextState = 'ASK_NAME';
          session.complaintData = {};
          session.attempts = 0;
        } else {
          session.attempts++;
          if (session.attempts > 2) {
            responseText = "I'll go ahead and submit your complaint. Please hold on.";
            nextState = 'SUBMITTING';
          } else {
            responseText = "Press 1 to submit your complaint, or press 2 to start over.";
          }
        }
        break;
        
      case 'SUBMITTING':
        responseText = "Your complaint has been submitted successfully. You will receive a confirmation email shortly. Thank you for using our service. Goodbye!";
        nextState = 'END';
        break;
        
      default:
        responseText = "Thank you for calling. Goodbye!";
        nextState = 'END';
    }
    
    session.state = nextState;
    console.log(`✅ Generated response: "${responseText}", Next state: ${nextState}`);
    return responseText;
    
  } catch (error) {
    console.error('❌ Error generating response:', error);
    return "I'm sorry, there was a technical issue. Please try again or visit our website. Goodbye!";
  }
}

// Submit complaint to the main system
async function submitComplaint(complaintData) {
  try {
    console.log('📝 Submitting complaint:', complaintData);
    const response = await axios.post('http://localhost:3001/api/complaints', {
      name: complaintData.name,
      email: complaintData.email,
      department: complaintData.department,
      category: complaintData.category,
      description: complaintData.description,
      submissionMethod: 'voice-call'
    });
    
    console.log('✅ Complaint submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting complaint:', error.message);
    throw error;
  }
}

// Webhook endpoints

// Initial call webhook - when call is answered
app.post('/voice', (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const session = initializeCallSession(callSid);
    const responseText = generateResponse(session);
    
    console.log(`📞 Incoming call: ${callSid}`);
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Say the greeting with good voice settings
    twiml.say({
      voice: 'alice',
      rate: 'slow',
      language: 'en-US'
    }, responseText);
    
    // Gather speech input
    twiml.gather({
      input: 'speech',
      timeout: 10,
      speechTimeout: 3,
      action: '/process-speech',
      method: 'POST',
      language: 'en-US'
    });
    
    // Fallback if no input
    twiml.say({
      voice: 'alice',
      rate: 'slow'
    }, "I didn't hear anything. Please call back when you're ready. Goodbye!");
    twiml.hangup();
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /voice webhook:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Please try again later. Goodbye!');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Process speech input
app.post('/process-speech', async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const speechResult = req.body.SpeechResult || '';
    const session = getCallSession(callSid);
    
    console.log(`🎤 Speech input for ${callSid}: "${speechResult}"`);
    console.log(`📊 Current state: ${session.state}`);
    
    // Handle complaint submission
    if (session.state === 'SUBMITTING') {
      try {
        await submitComplaint(session.complaintData);
        session.state = 'COMPLETED';
      } catch (error) {
        console.error('❌ Complaint submission failed:', error);
        session.state = 'ERROR';
      }
    }
    
    const responseText = generateResponse(session, speechResult);
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    if (session.state === 'END' || session.state === 'COMPLETED' || session.state === 'ERROR') {
      // End the call
      twiml.say({
        voice: 'alice',
        rate: 'slow',
        language: 'en-US'
      }, responseText);
      twiml.hangup();
      
      // Clean up session
      callSessions.delete(callSid);
      console.log(`🧹 Cleaned up session: ${callSid}`);
    } else {
      // Continue conversation
      twiml.say({
        voice: 'alice',
        rate: 'slow',
        language: 'en-US'
      }, responseText);
      
      // Gather next input
      const gather = twiml.gather({
        input: 'speech dtmf',
        timeout: 15,
        speechTimeout: 4,
        action: '/process-speech',
        method: 'POST',
        language: 'en-US',
        numDigits: 1
      });
      
      // Fallback for no input
      twiml.say({
        voice: 'alice',
        rate: 'slow'
      }, "I didn't hear your response. Let me try again.");
      twiml.redirect('/process-speech');
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /process-speech:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error processing your response. Goodbye!');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Endpoint to initiate outbound calls
app.post('/call-user', async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber || process.env.DEFAULT_CALL_NUMBER;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    console.log(`📞 Initiating call to: ${phoneNumber}`);
    
    const call = await twilioClient.calls.create({
      to: phoneNumber,
      from: twilioNumber,
      url: `${process.env.NGROK_URL}/voice`,
      method: 'POST',
      timeout: 30,
      record: false
    });
    
    console.log(`✅ Call initiated: ${call.sid}`);
    res.json({ 
      success: true, 
      callSid: call.sid,
      message: `Call initiated to ${phoneNumber}` 
    });
    
  } catch (error) {
    console.error('❌ Error initiating call:', error);
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    activeSessions: callSessions.size
  });
});

// Status endpoint to check active sessions
app.get('/status', (req, res) => {
  const sessions = Array.from(callSessions.entries()).map(([callSid, session]) => ({
    callSid,
    state: session.state,
    startTime: session.startTime,
    hasComplaintData: Object.keys(session.complaintData).length > 0
  }));
  
  res.json({
    activeSessions: sessions.length,
    sessions
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Calling agent server running on port ${PORT}`);
  console.log(`🔗 Webhook URL: ${process.env.NGROK_URL}`);
  console.log(`📞 Twilio Number: ${twilioNumber}`);
  console.log(`🎯 Default Call Number: ${process.env.DEFAULT_CALL_NUMBER}`);
});
// -------------------
// Webhook: Answer incoming call
// -------------------
app.post("/voice", async (req, res) => {
  const callSid = req.body.CallSid;
  const session = getCallSession(callSid);
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Get initial greeting
  const greeting = await processConversation(session);
  
  twiml.say({
    voice: 'alice',
    language: 'en-US'
  }, greeting);
  
  // Start the conversation loop
  twiml.gather({
    input: 'speech',
    timeout: 10,
    speechTimeout: 'auto',
    action: '/process-speech',
    method: 'POST'
  });
  
  // Fallback if no speech detected
  twiml.say("I didn't hear anything. Please speak after the tone.");
  twiml.redirect('/voice');

  res.type("text/xml");
  res.send(twiml.toString());
});

// -------------------
// Webhook: Process speech input
// -------------------
app.post("/process-speech", async (req, res) => {
  const callSid = req.body.CallSid;
  const speechResult = req.body.SpeechResult || '';
  const confidence = req.body.Confidence || 0;
  
  console.log(`Speech received: "${speechResult}" (confidence: ${confidence})`);
  
  const session = getCallSession(callSid);
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Process the conversation
  let response;
  if (confidence > 0.5 || speechResult.trim()) {
    response = await processConversation(session, speechResult);
  } else {
    response = "I didn't understand that clearly. Could you please repeat?";
  }
  
  twiml.say({
    voice: 'alice',
    language: 'en-US'
  }, response);
  
  // Continue conversation if not completed
  if (session.state !== 'COMPLETED' && session.state !== 'ERROR') {
    twiml.gather({
      input: 'speech',
      timeout: 15,
      speechTimeout: 'auto',
      action: '/process-speech',
      method: 'POST'
    });
    
    twiml.say("I'm waiting for your response.");
    twiml.redirect('/voice');
  } else {
    // End the call
    twiml.hangup();
    // Clean up session
    callSessions.delete(callSid);
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// -------------------
// Webhook: Recording finished (backup method)
// -------------------
app.post("/recording-complete", (req, res) => {
  const recordingUrl = req.body.RecordingUrl;
  console.log("Recording finished! URL:", recordingUrl);

  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say("Thank you! Your message has been recorded. We'll get back to you soon.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// -------------------
// Endpoint to trigger outgoing call from dashboard
// -------------------
app.post("/call-user", async (req, res) => {
  const { phoneNumber, userInfo } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  
  try {
    console.log(`Initiating call to ${phoneNumber}`);
    
    const call = await twilioClient.calls.create({
      to: phoneNumber,
      from: twilioNumber,
      url: `${process.env.NGROK_URL || 'http://localhost:3000'}/voice`,
      statusCallback: `${process.env.NGROK_URL || 'http://localhost:3000'}/call-status`,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
    });
    
    console.log(`Call initiated with SID: ${call.sid}`);
    res.json({ 
      success: true, 
      message: "Call initiated successfully", 
      callSid: call.sid,
      to: phoneNumber,
      from: twilioNumber
    });
  } catch (err) {
    console.error("Error making call:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.toString()
    });
  }
});

// -------------------
// Call status webhook
// -------------------
app.post("/call-status", (req, res) => {
  const { CallSid, CallStatus, To, From } = req.body;
  console.log(`Call ${CallSid} to ${To} status: ${CallStatus}`);
  res.sendStatus(200);
});

// -------------------
// Endpoint to get call session info
// -------------------
app.get("/call-session/:callSid", (req, res) => {
  const { callSid } = req.params;
  const session = callSessions.get(callSid);
  
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  
  res.json({
    callSid: session.callSid,
    state: session.state,
    complaintData: session.complaintData,
    startTime: session.startTime
  });
});

// -------------------
// Health check endpoint
// -------------------
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    activeSessions: callSessions.size,
    twilio: {
      configured: !!(accountSid && authToken && twilioNumber),
      number: twilioNumber
    },
    openrouter: {
      configured: !!openrouterApiKey
    }
  });
});

// -------------------
// Endpoint to trigger outgoing call (legacy)
// -------------------
app.get("/make-call", async (req, res) => {
  try {
    const call = await twilioClient.calls.create({
      to: req.query.to,
      from: twilioNumber,
      url: `${process.env.NGROK_URL || 'http://localhost:3000'}/voice`,
    });
    res.json({ message: "Call initiated", callSid: call.sid });
  } catch (err) {
    console.error("Error making call:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// Start server
// -------------------
const PORT = process.env.CALLING_AGENT_PORT || 3000;
app.listen(PORT, () => {
  console.log(`📞 Call assistant running on http://localhost:${PORT}`);
  console.log(`🔑 Twilio configured: ${!!(accountSid && authToken && twilioNumber)}`);
  console.log(`🤖 OpenRouter configured: ${!!openrouterApiKey}`);
  console.log(`📱 Twilio number: ${twilioNumber}`);
  console.log(`🌐 Webhook URL should be: ${process.env.NGROK_URL || `http://localhost:${PORT}`}/voice`);
});
