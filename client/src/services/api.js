import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const MAPS_API_BASE_URL = import.meta.env.VITE_MAPS_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mapsApi = axios.create({
  baseURL: MAPS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alert Services
export const alertService = {
  /**
   * Get all alerts with optional filters
   * @param {import('../types/index.js').SearchFilters} [filters] - Filter criteria
   * @returns {Promise<import('../types/index.js').Alert[]>} Array of alerts
   */
  async getAlerts(filters) {
    const response = await api.get('/alerts', { params: filters });
    return response.data;
  },

  /**
   * Get a specific alert by ID
   * @param {string} id - Alert ID
   * @returns {Promise<import('../types/index.js').Alert>} Alert object
   */
  async getAlert(id) {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  /**
   * Create a new alert
   * @param {Omit<import('../types/index.js').Alert, 'id' | 'timestamp'>} alert - Alert data without ID and timestamp
   * @returns {Promise<import('../types/index.js').Alert>} Created alert
   */
  async createAlert(alert) {
    const response = await api.post('/alerts', alert);
    return response.data;
  },

  /**
   * Update an existing alert
   * @param {string} id - Alert ID
   * @param {Partial<import('../types/index.js').Alert>} updates - Updates to apply
   * @returns {Promise<import('../types/index.js').Alert>} Updated alert
   */
  async updateAlert(id, updates) {
    const response = await api.patch(`/alerts/${id}`, updates);
    return response.data;
  },

  /**
   * Delete an alert
   * @param {string} id - Alert ID
   * @returns {Promise<void>}
   */
  async deleteAlert(id) {
    await api.delete(`/alerts/${id}`);
  },

  /**
   * Get all active alerts
   * @returns {Promise<import('../types/index.js').Alert[]>} Array of active alerts
   */
  async getActiveAlerts() {
    const response = await api.get('/alerts/active');
    return response.data;
  },

  /**
   * Get alerts near a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} [radius=10] - Search radius in kilometers
   * @returns {Promise<import('../types/index.js').Alert[]>} Array of nearby alerts
   */
  async getNearbyAlerts(lat, lng, radius = 10) {
    const response = await api.get('/alerts/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },
};

// Route Services
export const routeService = {
  /**
   * Get optimal routes between two points
   * @param {{lat: number, lng: number}} origin - Origin coordinates
   * @param {{lat: number, lng: number}} destination - Destination coordinates
   * @param {boolean} [avoidAlerts=true] - Whether to avoid alert areas
   * @returns {Promise<import('../types/index.js').Route[]>} Array of route options
   */
  async getOptimalRoutes(origin, destination, avoidAlerts = true) {
    const originStr = `${origin.lat},${origin.lng}`;
    const destStr = `${destination.lat},${destination.lng}`;
    
    const response = await mapsApi.get('/getRoute', {
      params: {
        origin: originStr,
        dest: destStr,
      },
    });
    
    // Transform Google Maps API response to match our Route type
    if (response.data.success && response.data.data.routes) {
      return response.data.data.routes.map((route, index) => ({
        id: `route_${index}`,
        waypoints: [
          { lat: origin.lat, lng: origin.lng },
          { lat: destination.lat, lng: destination.lng }
        ],
        distance: route.distance.value, // meters
        duration: route.duration.value, // seconds
        summary: route.summary,
        encodedPolyline: route.encodedPolyline,
        distanceText: route.distance.text,
        durationText: route.duration.text,
        steps: route.steps || []
      }));
    }
    
    return [];
  },

  /**
   * Get route by ID (deprecated with Google Maps API)
   * @param {string} routeId - Route ID
   * @returns {Promise<import('../types/index.js').Route>} Route object
   */
  async getRoute(routeId) {
    // For backwards compatibility - this method might not be needed with Google Maps API
    throw new Error('getRoute by ID is not supported with Google Maps API. Use getOptimalRoutes instead.');
  },
};

// Twitter Services
export const twitterService = {
  /**
   * Get relevant tweets based on keywords and location
   * @param {string[]} [keywords] - Keywords to search for
   * @param {{lat: number, lng: number, radius: number}} [location] - Location filter
   * @returns {Promise<import('../types/index.js').TwitterData[]>} Array of relevant tweets
   */
  async getRelevantTweets(keywords, location) {
    const response = await api.get('/twitter/relevant', {
      params: { keywords: keywords?.join(','), ...location },
    });
    return response.data;
  },

  /**
   * Analyze a specific tweet
   * @param {string} tweetId - Tweet ID to analyze
   * @returns {Promise<import('../types/index.js').TwitterData>} Analyzed tweet data
   */
  async analyzeTweet(tweetId) {
    const response = await api.get(`/twitter/analyze/${tweetId}`);
    return response.data;
  },
};

// Weather Services
export const weatherService = {
  /**
   * Get weather data for a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<import('../types/index.js').WeatherData>} Weather data
   */
  async getWeatherData(lat, lng) {
    const response = await api.get('/weather', { params: { lat, lng } });
    return response.data;
  },

  /**
   * Get weather alerts for a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} [radius=50] - Search radius in kilometers
   * @returns {Promise<import('../types/index.js').Alert[]>} Weather alerts
   */
  async getWeatherAlerts(lat, lng, radius = 50) {
    const response = await api.get('/weather/alerts', { params: { lat, lng, radius } });
    return response.data;
  },
};

// Safe Zone Services
export const safeZoneService = {
  /**
   * Get nearby hospitals and safe zones
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} [radius=5000] - Search radius in meters
   * @returns {Promise<Array<{
   *   id: string,
   *   name: string,
   *   location: {lat: number, lng: number},
   *   address: string,
   *   rating?: number,
   *   userRatingsTotal?: number,
   *   businessStatus?: string,
   *   openNow?: boolean,
   *   distance: number
   * }>>} Array of safe zones
   */
  async getNearbyHospitals(lat, lng, radius = 5000) {
    const response = await mapsApi.get('/getSafeZones', {
      params: { lat, lng, radius },
    });
    
    if (response.data.success && response.data.data.safeZones) {
      return response.data.data.safeZones;
    }
    
    return [];
  },
};

// Search Services
export const searchService = {
  /**
   * Search for alerts using a text query
   * @param {string} query - Search query
   * @param {import('../types/index.js').SearchFilters} [filters] - Additional filters
   * @returns {Promise<import('../types/index.js').Alert[]>} Search results
   */
  async searchAlerts(query, filters) {
    const response = await api.get('/search/alerts', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * Search for locations
   * @param {string} query - Location search query
   * @returns {Promise<Array<{name: string, lat: number, lng: number}>>} Location results
   */
  async searchLocations(query) {
    const response = await api.get('/search/locations', { params: { q: query } });
    return response.data;
  },
};