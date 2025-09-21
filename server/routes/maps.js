const express = require('express');
const router = express.Router();

// Get Maps configuration (API key, Map ID, etc.)
router.get('/config', (req, res) => {
  try {
    res.json({
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      mapId: '526d8b272b9c6bc936f68256', // Hardcoded Map ID
      libraries: ['marker', 'places', 'geometry'],
      version: 'weekly'
    });
  } catch (error) {
    console.error('Error getting maps config:', error);
    res.status(500).json({ error: 'Failed to get maps configuration' });
  }
});

module.exports = router;