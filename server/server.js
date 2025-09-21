require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const mapsRoutes = require('./routes/maps');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:8000',
    process.env.CLIENT_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// API Routes
app.use('/', apiRoutes);
app.use('/api/maps', mapsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Alert System - Google Maps API Backend',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      routes: 'GET /getRoute?origin=lat,lng&dest=lat,lng',
      safeZones: 'GET /getSafeZones?lat=number&lng=number&radius=number'
    },
    documentation: 'https://developers.google.com/maps/documentation',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.originalUrl} was not found`,
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'GET /getRoute',
      'GET /getSafeZones'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 AI Alert System Backend Started');
  console.log('=================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗝️  Google Maps API: ${process.env.GOOGLE_MAPS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('=================================');
  console.log('Available endpoints:');
  console.log(`  GET  /              - API information`);
  console.log(`  GET  /health        - Health check`);
  console.log(`  GET  /getRoute      - Get route with alternatives`);
  console.log(`  GET  /getSafeZones  - Get nearby hospitals`);
  console.log('=================================');
  
  // Warn if Google Maps API key is missing
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.log('⚠️  WARNING: GOOGLE_MAPS_API_KEY environment variable is not set!');
    console.log('   Please set your Google Maps API key in .env file');
    console.log('   Example: GOOGLE_MAPS_API_KEY=your_api_key_here');
    console.log('=================================');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;