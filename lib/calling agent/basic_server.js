// Basic calling agent without twilio for testing
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("Starting basic server...");

// Basic endpoints without Twilio
app.get('/health', (req, res) => {
  console.log("Health check requested");
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString()
  });
});

app.post('/call-user', async (req, res) => {
  try {
    console.log('Call request received:', req.body);
    
    // Mock response without actually calling
    res.json({ 
      success: true, 
      message: 'Mock call initiated (Twilio disabled for testing)',
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

app.post('/voice', (req, res) => {
  console.log('Voice webhook called');
  res.send('Voice webhook working');
});

const PORT = 3000;

console.log("Attempting to start server on port", PORT);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log(`🚀 Basic server running on port ${PORT}`);
  }
});