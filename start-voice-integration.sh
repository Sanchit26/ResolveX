#!/bin/bash

# Twilio Voice Integration Quick Start Script
echo "🎯 Starting Twilio Voice Integration Setup..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to start a service in background
start_service() {
    local name=$1
    local command=$2
    local port=$3
    
    echo "🚀 Starting $name..."
    
    if check_port $port; then
        echo "✅ $name already running on port $port"
    else
        echo "   Command: $command"
        eval $command &
        local pid=$!
        sleep 3
        
        if check_port $port; then
            echo "✅ $name started successfully on port $port (PID: $pid)"
        else
            echo "❌ Failed to start $name"
            return 1
        fi
    fi
}

# Install dependencies for calling agent if needed
echo "📦 Checking calling agent dependencies..."
cd "lib/calling agent"
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi
cd ../..

# Check environment variables
echo "🔧 Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "TWILIO_ACCOUNT_SID" .env && grep -q "OPENROUTER_API_KEY" .env; then
        echo "✅ Environment variables configured"
    else
        echo "⚠️  Warning: Missing required environment variables"
        echo "   Make sure .env contains TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and OPENROUTER_API_KEY"
    fi
else
    echo "❌ .env file not found"
    exit 1
fi

# Start services
echo "🎬 Starting services..."

# Start the calling agent
start_service "Calling Agent" "cd 'lib/calling agent' && npm start" 3000

# Start the main Next.js app
start_service "Next.js App" "npm run dev" 3001

echo ""
echo "🎉 Services started successfully!"
echo ""
echo "📋 Quick Test Checklist:"
echo "   1. Visit: http://localhost:3001/admin/dashboard"
echo "   2. Click the green 'Call Me' button"
echo "   3. Enter your phone number"
echo "   4. Answer the call and follow AI prompts"
echo ""
echo "🔧 Service URLs:"
echo "   • Main App: http://localhost:3001"
echo "   • Admin Dashboard: http://localhost:3001/admin/dashboard"
echo "   • Calling Agent Health: http://localhost:3000/health"
echo ""
echo "📞 Twilio Configuration:"
TWILIO_NUMBER=$(grep "TWILIO_PHONE_NUMBER" .env | cut -d'=' -f2)
echo "   • Your Twilio Number: $TWILIO_NUMBER"
echo "   • Webhook URL needed: https://your-ngrok-url.ngrok.io/voice"
echo ""
echo "⚠️  Important: Don't forget to:"
echo "   1. Start ngrok: ngrok http 3000"
echo "   2. Update Twilio webhook URL in console"
echo "   3. Update NGROK_URL in .env file"
echo ""
echo "🛑 To stop services: Press Ctrl+C or run: pkill -f 'npm'"
echo ""

# Keep script running to show logs
echo "📊 Watching logs (Press Ctrl+C to stop)..."
echo "   Main app logs will appear here..."
echo ""

# Wait for user to stop
trap 'echo ""; echo "🛑 Stopping services..."; pkill -f "npm"; exit 0' INT
wait