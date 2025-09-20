const axios = require('axios');

/**
 * Google Maps API Service
 * Provides reusable functions for Google Maps API integration
 */
class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseURL = 'https://maps.googleapis.com/maps/api';
    
    if (!this.apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY environment variable is required');
    }
  }

  /**
   * Get route information from Google Directions API
   * @param {string} origin - Origin coordinates as "lat,lng"
   * @param {string} destination - Destination coordinates as "lat,lng"
   * @returns {Promise<Object>} Route data with alternatives
   */
  async getRoute(origin, destination) {
    try {
      // Validate input coordinates
      if (!this.isValidCoordinates(origin) || !this.isValidCoordinates(destination)) {
        throw new Error('Invalid coordinates format. Use "lat,lng" format.');
      }

      const url = `${this.baseURL}/directions/json`;
      const params = {
        origin,
        destination,
        alternatives: true,
        key: this.apiKey,
        mode: 'driving',
        units: 'metric'
      };

      const response = await axios.get(url, { params });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
      }

      // Transform the response to include only necessary data
      const routes = response.data.routes.map((route, index) => {
        const leg = route.legs[0]; // Assuming single leg journey
        return {
          routeIndex: index,
          distance: {
            text: leg.distance.text,
            value: leg.distance.value // meters
          },
          duration: {
            text: leg.duration.text,
            value: leg.duration.value // seconds
          },
          summary: route.summary,
          encodedPolyline: route.overview_polyline.points,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
            distance: step.distance,
            duration: step.duration,
            polyline: step.polyline.points
          }))
        };
      });

      return {
        status: 'success',
        routes,
        geocoded_waypoints: response.data.geocoded_waypoints
      };

    } catch (error) {
      console.error('Error in getRoute:', error.message);
      throw error;
    }
  }

  /**
   * Get nearby safe zones (hospitals) from Google Places API
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Search radius in meters (default: 5000)
   * @returns {Promise<Object>} List of nearby hospitals
   */
  async getSafeZones(lat, lng, radius = 5000) {
    try {
      // Validate input
      if (!this.isValidLatLng(lat, lng)) {
        throw new Error('Invalid latitude or longitude values');
      }

      if (radius <= 0 || radius > 50000) {
        throw new Error('Radius must be between 1 and 50000 meters');
      }

      const url = `${this.baseURL}/place/nearbysearch/json`;
      const params = {
        location: `${lat},${lng}`,
        radius,
        type: 'hospital',
        key: this.apiKey
      };

      const response = await axios.get(url, { params });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
      }

      // Transform the response to include only necessary data
      const safeZones = response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        address: place.vicinity,
        rating: place.rating || null,
        userRatingsTotal: place.user_ratings_total || 0,
        businessStatus: place.business_status,
        openNow: place.opening_hours?.open_now || null,
        priceLevel: place.price_level || null,
        types: place.types,
        distance: this.calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
      }));

      // Sort by distance (closest first)
      safeZones.sort((a, b) => a.distance - b.distance);

      return {
        status: 'success',
        safeZones,
        searchLocation: { lat, lng },
        radius,
        totalFound: safeZones.length
      };

    } catch (error) {
      console.error('Error in getSafeZones:', error.message);
      throw error;
    }
  }

  /**
   * Validate coordinates string format (lat,lng)
   * @param {string} coordinates - Coordinates string
   * @returns {boolean} True if valid
   */
  isValidCoordinates(coordinates) {
    if (typeof coordinates !== 'string') return false;
    
    const parts = coordinates.split(',');
    if (parts.length !== 2) return false;
    
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    
    return this.isValidLatLng(lat, lng);
  }

  /**
   * Validate latitude and longitude values
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} True if valid
   */
  isValidLatLng(lat, lng) {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' && 
      lat >= -90 && lat <= 90 && 
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - First point latitude
   * @param {number} lng1 - First point longitude
   * @param {number} lat2 - Second point latitude
   * @param {number} lng2 - Second point longitude
   * @returns {number} Distance in meters
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}

module.exports = GoogleMapsService;