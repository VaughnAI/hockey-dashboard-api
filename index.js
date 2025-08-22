import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Twilio client
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hockey Dashboard API is running!' });
});

// Send SMS endpoint
app.post('/send-sms', async (req, res) => {
  try {
    const { phone, message, playerJersey } = req.body;
    
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    
    console.log(`SMS sent to ${phone}: ${message}`);
    
    res.json({ 
      success: true, 
      messageSid: result.sid,
      playerJersey 
    });
    
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
