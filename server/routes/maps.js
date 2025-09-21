const express = require('express');
const router = express.Router();

// Return Google Maps config to frontend
router.get('/config', (req, res) => {
  res.json({
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    mapId: process.env.GOOGLE_MAPS_ID || '526d8b272b9c6bc936f68256', // fallback to actual Map ID
    libraries: ['places', 'visualization', 'geometry'],
    version: 'weekly',
  });
});

module.exports = router;