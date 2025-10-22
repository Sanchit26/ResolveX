// Direct Twilio call test
require('dotenv').config({ path: '../../.env.local' });
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('🚀 Making direct call with Twilio...');
console.log('📞 From:', process.env.TWILIO_PHONE_NUMBER);
console.log('📱 To:', process.env.DEFAULT_CALL_NUMBER);

async function makeCall() {
  try {
    const call = await client.calls.create({
      twiml: `<Response>
        <Say voice="alice" rate="slow" language="en-US">
          Hello! This is a test call from your Grievance Portal voice system. 
          The calling agent is working correctly. 
          You can now receive voice calls for complaint filing. 
          Thank you for testing! Goodbye!
        </Say>
        <Hangup/>
      </Response>`,
      to: process.env.DEFAULT_CALL_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Call initiated successfully!');
    console.log('📞 Call SID:', call.sid);
    console.log('📋 Status:', call.status);
    console.log('🎯 Direction:', call.direction);
    
    // Wait a moment then check call status
    setTimeout(async () => {
      try {
        const callStatus = await client.calls(call.sid).fetch();
        console.log('📊 Updated Status:', callStatus.status);
        console.log('⏱️  Duration:', callStatus.duration, 'seconds');
      } catch (error) {
        console.log('ℹ️  Call status check:', error.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Call failed:', error.message);
    
    if (error.message.includes('not verified')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Go to https://console.twilio.com/');
      console.log('2. Navigate to Phone Numbers → Verified Caller IDs');
      console.log(`3. Add and verify: ${process.env.DEFAULT_CALL_NUMBER}`);
      console.log('4. Complete the verification process');
      console.log('5. Try calling again');
    }
  }
}

makeCall();