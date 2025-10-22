// Simple test server
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString()
  });
});

// Simple call endpoint
app.post('/call-user', async (req, res) => {
  try {
    console.log('Call request received:', req.body);
    res.json({ 
      success: true, 
      message: 'Test call endpoint working',
      receivedData: req.body
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process call',
      details: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});