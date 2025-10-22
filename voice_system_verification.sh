#!/bin/bash

echo "🧪 VOICE COMPLAINT SYSTEM - POST-CALL VERIFICATION"
echo "================================================="
echo ""

echo "📞 Checking recent calls from Twilio..."
curl -s -X GET "https://api.twilio.com/2010-04-01/Accounts/ACfd2de9bd1e517645195653bd5c29154e/Calls.json" \
  -u "ACfd2de9bd1e517645195653bd5c29154e:018781b83c6735685644d3e5b42aac4c" | \
  jq '.calls[:3] | .[] | {sid: .sid, to: .to, status: .status, duration: .duration}'

echo ""
echo "📊 Checking server health..."
curl -s http://localhost:3000/health | jq

echo ""
echo "💾 Checking if complaints were saved to database..."
curl -s http://localhost:3002/api/complaints | jq '.[] | select(.submissionMethod == "voice-call") | {trackingId, name, department, status}'

echo ""
echo "✅ Voice system verification complete!"
echo ""
echo "📋 NEXT ACTIONS:"
echo "1. Did you receive and answer the voice calls?"
echo "2. Were you able to complete the conversation?"
echo "3. Did you receive a tracking ID?"
echo "4. Check the database results above for your complaint"