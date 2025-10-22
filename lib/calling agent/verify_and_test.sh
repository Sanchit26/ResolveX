#!/bin/bash

# Phone Number Verification & Testing Script
# This script will help you verify your phone number and test the voice system

echo "📞 TWILIO PHONE VERIFICATION & TESTING GUIDE"
echo "============================================="
echo ""

# Check environment variables
source ../../.env.local

echo "🔧 Current Configuration:"
echo "Twilio Account SID: $TWILIO_ACCOUNT_SID"
echo "Twilio Phone Number: $TWILIO_PHONE_NUMBER"  
echo "Your Phone Number: $DEFAULT_CALL_NUMBER"
echo ""

echo "📋 STEP 1: VERIFY YOUR PHONE NUMBER"
echo "=================================="
echo "1. Open: https://console.twilio.com/"
echo "2. Login with your Twilio account"
echo "3. Go to: Phone Numbers → Verified Caller IDs"
echo "4. Click: 'Add a new number' (+ button)"
echo "5. Enter: $DEFAULT_CALL_NUMBER"
echo "6. Select: Voice & SMS"
echo "7. Click: 'Call Me Now'"
echo "8. Answer your phone and enter the verification code"
echo ""

echo "📋 STEP 2: TEST THE SYSTEM"
echo "========================="
echo "After verification, run these tests:"
echo ""
echo "Test 1 - Direct Twilio Call:"
echo "node direct_call_test.js"
echo ""
echo "Test 2 - Calling Agent API:"
echo "curl -X POST http://localhost:3000/call-user -H 'Content-Type: application/json' -d '{\"phoneNumber\": \"$DEFAULT_CALL_NUMBER\"}'"
echo ""
echo "Test 3 - Full Application Test:"
echo "curl -X POST http://localhost:3002/api/call-me -H 'Content-Type: application/json' -d '{\"phoneNumber\": \"$DEFAULT_CALL_NUMBER\"}'"
echo ""

echo "🎯 EXPECTED RESULTS AFTER VERIFICATION:"
echo "======================================="
echo "✅ You will receive actual voice calls"
echo "✅ AI assistant will speak to you in clear English"
echo "✅ You can file complaints through voice conversation"
echo "✅ System will provide tracking IDs"
echo "✅ Complaints will be saved to database"
echo ""

echo "🆘 NEED HELP?"
echo "============"
echo "If you encounter any issues:"
echo "1. Check that your phone can receive calls"
echo "2. Make sure you're in an area with good reception"
echo "3. Try verification with a different number if needed"
echo "4. Contact Twilio support if verification fails"
echo ""

echo "Press Enter after completing phone verification to run tests..."
read

echo "🧪 Running post-verification tests..."
echo ""

# Test 1: Health check
echo "Test 1: Server Health Check"
curl -s http://localhost:3000/health | jq
echo ""

# Test 2: Direct call
echo "Test 2: Direct Twilio Call Test"
node direct_call_test.js
echo ""

# Test 3: API endpoint
echo "Test 3: Calling Agent API Test"
curl -s -X POST http://localhost:3000/call-user -H "Content-Type: application/json" -d "{\"phoneNumber\": \"$DEFAULT_CALL_NUMBER\"}" | jq
echo ""

echo "✅ Testing complete! Check your phone for calls."