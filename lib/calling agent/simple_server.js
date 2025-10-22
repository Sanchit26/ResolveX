// Simple calling agent server
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Hard-coded credentials to avoid environment issues
const accountSid = process.env.TWILIO_ACCOUNT_SID || "(API)";
const authToken = process.env.TWILIO_AUTH_TOKEN || "(API)";
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = "(API)";
const defaultCallNumber = "(API)";
const ngrokUrl = process.env.NGROK_URL || "(API)";

// Simple conversation state
const callSessions = new Map();

// Initialize conversation session
function initializeCallSession(callSid) {
  const session = {
    callSid,
    state: 'GREETING',
    complaintData: {},
    startTime: new Date()
  };
  callSessions.set(callSid, session);
  console.log(`📞 New call session: ${callSid}`);
  return session;
}

// Get session
function getCallSession(callSid) {
  return callSessions.get(callSid) || initializeCallSession(callSid);
}

// Initial call webhook
app.post('/voice', (req, res) => {
  try {
    const callSid = req.body.CallSid;
    console.log(`📞 Incoming call: ${callSid}`);
    
    const session = initializeCallSession(callSid);
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say({
      voice: 'alice',
      rate: 'slow',
      language: 'en-US'
    }, "Hello! Welcome to the Grievance Portal voice assistant. I will help you file a complaint. Please tell me your full name.");
    
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
    }, "I didn't hear anything. Please call back. Goodbye!");
    twiml.hangup();
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /voice:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Goodbye!');
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
    
    console.log(`🎤 Speech: "${speechResult}" (State: ${session.state})`);
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    let responseText = '';
    
    switch (session.state) {
      case 'GREETING':
        if (speechResult.trim().length > 2) {
          session.complaintData.name = speechResult.trim();
          responseText = `Thank you ${session.complaintData.name}. Now please provide your email address.`;
          session.state = 'ASK_EMAIL';
        } else {
          responseText = "I didn't catch your name. Could you please repeat it?";
        }
        break;
        
      case 'ASK_EMAIL':
        if (speechResult.includes('@') || speechResult.includes('at')) {
          session.complaintData.email = speechResult.trim();
          responseText = `Got it. Now tell me about your complaint. What's the issue?`;
          session.state = 'ASK_COMPLAINT';
        } else {
          responseText = "Please provide your email address clearly.";
        }
        break;
        
      case 'ASK_COMPLAINT':
        if (speechResult.trim().length > 10) {
          session.complaintData.description = speechResult.trim();
          responseText = `Thank you. Your complaint has been recorded: ${session.complaintData.description.substring(0, 50)}... We will process this and send you a confirmation email. Goodbye!`;
          session.state = 'END';
        } else {
          responseText = "Please provide more details about your complaint.";
        }
        break;
        
      default:
        responseText = "Thank you for your complaint. Goodbye!";
        session.state = 'END';
    }
    
    twiml.say({
      voice: 'alice',
      rate: 'slow',
      language: 'en-US'
    }, responseText);
    
    if (session.state === 'END') {
      twiml.hangup();
      callSessions.delete(callSid);
      console.log(`✅ Call completed: ${callSid}`);
    } else {
      twiml.gather({
        input: 'speech',
        timeout: 15,
        speechTimeout: 4,
        action: '/process-speech',
        method: 'POST',
        language: 'en-US'
      });
      
      twiml.say({
        voice: 'alice',
        rate: 'slow'
      }, "I'm waiting for your response.");
      twiml.redirect('/process-speech');
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
    
  } catch (error) {
    console.error('❌ Error in /process-speech:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error. Goodbye!');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Endpoint to initiate calls
app.post('/call-user', async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber || defaultCallNumber;
    
    console.log(`📞 Initiating call to: ${phoneNumber}`);
    
    const call = await twilioClient.calls.create({
      to: phoneNumber,
      from: twilioNumber,
      url: `${ngrokUrl}/voice`,
      method: 'POST',
      timeout: 30
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    activeSessions: callSessions.size
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Calling agent running on port ${PORT}`);
  console.log(`🔗 Webhook URL: ${ngrokUrl}`);
  console.log(`📞 Twilio Number: ${twilioNumber}`);
  console.log(`🎯 Default Call Number: ${defaultCallNumber}`);
});