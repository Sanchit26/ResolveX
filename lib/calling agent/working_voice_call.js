// Working voice conversation without webhooks
require('dotenv').config({ path: '../../.env.local' });
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('🚀 Creating working voice conversation...');

async function createWorkingVoiceCall() {
  try {
    // Create a multi-step TwiML that handles basic interaction
    const call = await client.calls.create({
      twiml: `<Response>
        <Say voice="alice" rate="slow" language="en-US">
          Hello! Welcome to the Grievance Portal voice assistant. 
          I will help you file a complaint. 
          Please listen carefully to the instructions.
          
          To file a complaint, please visit our website at localhost 3002.
          Or call our support team during business hours.
          
          For immediate assistance, press 1 now.
          For general information, press 2.
          To speak to an agent, press 3.
          
          Thank you for calling our Grievance Portal.
        </Say>
        
        <Gather input="dtmf" timeout="10" numDigits="1">
          <Say voice="alice" rate="slow">
            Press 1 for immediate assistance, 2 for information, or 3 to speak to an agent.
          </Say>
        </Gather>
        
        <Say voice="alice" rate="slow">
          Thank you for calling. Visit our website for online complaint filing. Goodbye!
        </Say>
        <Hangup/>
      </Response>`,
      to: process.env.DEFAULT_CALL_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Working voice call initiated!');
    console.log('📞 Call SID:', call.sid);
    console.log('🎯 This call should work without application errors!');
    console.log('📋 You can press 1, 2, or 3 when prompted');
    
  } catch (error) {
    console.error('❌ Call failed:', error.message);
  }
}

createWorkingVoiceCall();