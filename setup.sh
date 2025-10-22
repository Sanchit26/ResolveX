#!/bin/bash

echo "🚀 Setting up Grievance Redressal Portal..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "❌ MongoDB is not running on localhost:27017"
    echo "   Please start MongoDB first:"
    echo "   - On Ubuntu/Debian: sudo systemctl start mongod"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - Or run: mongod"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Create admin user
echo "👤 Setting up admin user..."
node scripts/setup-admin.js

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Admin login: admin / admin123"
echo ""
echo "🔗 Useful URLs:"
echo "   - Homepage: http://localhost:3000"
echo "   - File Complaint: http://localhost:3000/complaint"
echo "   - Admin Login: http://localhost:3000/admin"
echo "   - Admin Dashboard: http://localhost:3000/admin/dashboard"
echo ""
echo "📚 For more information, see README.md"



