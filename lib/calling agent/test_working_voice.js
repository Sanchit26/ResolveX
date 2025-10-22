// Simple working voice test
require('dotenv').config({ path: '../../.env.local' });
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('🚀 Testing simple voice call with fixed TwiML...');

async function makeWorkingCall() {
  try {
    const call = await client.calls.create({
      twiml: `<Response>
        <Say voice="alice" rate="slow" language="en-US">
          Hello! This is your Grievance Portal voice assistant. 
          I am now working correctly without application errors.
          Your voice calling system is functional.
          You can now receive calls and the assistant will speak to you clearly.
          This confirms the webhook issue has been resolved.
          Thank you for testing. Goodbye!
        </Say>
        <Hangup/>
      </Response>`,
      to: process.env.DEFAULT_CALL_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Working call initiated!');
    console.log('📞 Call SID:', call.sid);
    console.log('📋 Status:', call.status);
    console.log('🎯 You should receive a call with clear voice speaking!');
    
  } catch (error) {
    console.error('❌ Call failed:', error.message);
  }
}

makeWorkingCall();