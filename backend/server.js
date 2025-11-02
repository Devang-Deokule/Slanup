const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Slanup API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Slanup Event Discovery API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      createEvent: 'POST /api/events',
      getAllEvents: 'GET /api/events',
      getEventById: 'GET /api/events/:id'
    }
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/slanup';
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // For MVP, continue running even without DB (can use in-memory array later)
    console.log('⚠️  Continuing without database connection (MVP mode)');
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});

