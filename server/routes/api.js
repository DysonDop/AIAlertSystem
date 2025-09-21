const express = require('express');
const GoogleMapsService = require('../services/googleMapsService');

const router = express.Router();
const mapsService = new GoogleMapsService();

/**
 * GET /getRoute
 * Get route information from Google Directions API
 * Query parameters:
 *   - origin: "lat,lng" format (required)
 *   - dest: "lat,lng" format (required)
 */
router.get('/getRoute', async (req, res) => {
  try {
    const { origin, dest } = req.query;

    // Validate required parameters
    if (!origin || !dest) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both origin and dest parameters are required',
        example: '/getRoute?origin=37.7749,-122.4194&dest=37.7849,-122.4094'
      });
    }

    // Validate parameter types
    if (typeof origin !== 'string' || typeof dest !== 'string') {
      return res.status(400).json({
        error: 'Invalid parameter types',
        message: 'Origin and destination must be strings in "lat,lng" format'
      });
    }

    // Get route data from Google Maps service
    const routeData = await mapsService.getRoute(origin, dest);

    // Success response
    res.json({
      success: true,
      data: routeData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /getRoute endpoint:', error.message);
    
    // Handle different types of errors
    if (error.message.includes('Invalid coordinates')) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: error.message,
        example: 'Use format: "37.7749,-122.4194"'
      });
    }

    if (error.message.includes('Google Maps API error')) {
      return res.status(502).json({
        error: 'Google Maps API error',
        message: error.message
      });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to Google Maps API'
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
});

/**
 * GET /getSafeZones
 * Get nearby hospitals (safe zones) from Google Places API
 * Query parameters:
 *   - lat: latitude (required)
 *   - lng: longitude (required)
 *   - radius: search radius in meters (optional, default: 5000)
 */
router.get('/getSafeZones', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    // Validate required parameters
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both lat and lng parameters are required',
        example: '/getSafeZones?lat=37.7749&lng=-122.4194'
      });
    }

    // Parse and validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Latitude and longitude must be valid numbers',
        received: { lat, lng }
      });
    }

    // Parse and validate radius (optional)
    let searchRadius = 5000; // Default radius
    if (radius !== undefined) {
      searchRadius = parseInt(radius);
      if (isNaN(searchRadius)) {
        return res.status(400).json({
          error: 'Invalid radius',
          message: 'Radius must be a valid number',
          received: { radius }
        });
      }
    }

    // Get safe zones data from Google Maps service
    const safeZonesData = await mapsService.getSafeZones(latitude, longitude, searchRadius);

    // Success response
    res.json({
      success: true,
      data: safeZonesData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /getSafeZones endpoint:', error.message);
    
    // Handle different types of errors
    if (error.message.includes('Invalid latitude or longitude')) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: error.message
      });
    }

    if (error.message.includes('Radius must be')) {
      return res.status(400).json({
        error: 'Invalid radius',
        message: error.message
      });
    }

    if (error.message.includes('Google Places API error')) {
      return res.status(502).json({
        error: 'Google Places API error',
        message: error.message
      });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to Google Places API'
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
});

/**
 * GET /getalerts
 * Get all disaster alerts
 */
router.get('/getalerts', (req, res) => {
  try {
    // Mock alerts data for development
    const mockAlerts = [
      {
        id: '1',
        type: 'earthquake',
        severity: 'high',
        title: 'Magnitude 6.2 Earthquake',
        description: 'Strong earthquake detected near downtown area. Buildings may be affected.',
        location: {
          lat: 37.7749,
          lng: -122.4194,
          address: 'San Francisco, CA',
          radius: 25,
        },
        timestamp: new Date().toISOString(),
        source: 'meteorological',
        isActive: true,
        status: 'active'
      },
      {
        id: '2',
        type: 'flood',
        severity: 'critical',
        title: 'Flash Flood Warning',
        description: 'Severe flooding expected in low-lying areas due to heavy rainfall.',
        location: {
          lat: 37.7849,
          lng: -122.4094,
          address: 'Mission District, SF',
          radius: 15,
        },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        source: 'twitter',
        isActive: true,
        status: 'active'
      },
      {
        id: '3',
        type: 'fire',
        severity: 'medium',
        title: 'Wildfire Alert',
        description: 'Wildfire spreading in rural areas. Evacuation may be necessary.',
        location: {
          lat: 37.7649,
          lng: -122.4294,
          address: 'Golden Gate Park, SF',
          radius: 10,
        },
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        source: 'meteorological',
        isActive: false,
        status: 'resolved'
      },
      {
        id: '4',
        type: 'storm',
        severity: 'high',
        title: 'Severe Thunderstorm Warning',
        description: 'Severe thunderstorm with high winds and hail approaching the area.',
        location: {
          lat: 37.7549,
          lng: -122.4394,
          address: 'Richmond District, SF',
          radius: 20,
        },
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        source: 'meteorological',
        isActive: true,
        status: 'active'
      },
      {
        id: '5',
        type: 'tsunami',
        severity: 'critical',
        title: 'Tsunami Watch',
        description: 'Tsunami watch issued for coastal areas following offshore earthquake.',
        location: {
          lat: 37.8049,
          lng: -122.4194,
          address: 'Fisherman\'s Wharf, SF',
          radius: 30,
        },
        timestamp: new Date(Date.now() - 900000).toISOString(),
        source: 'meteorological',
        isActive: true,
        status: 'active'
      }
    ];

    res.json({
      success: true,
      data: mockAlerts,
      count: mockAlerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /getalerts endpoint:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching alerts'
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Google Maps API service is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;