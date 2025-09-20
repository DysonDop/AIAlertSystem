import axios from 'axios';
import type { Alert, Route, TwitterData, WeatherData, SearchFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alert Services
export const alertService = {
  async getAlerts(filters?: SearchFilters): Promise<Alert[]> {
    const response = await api.get('/alerts', { params: filters });
    return response.data;
  },

  async getAlert(id: string): Promise<Alert> {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  async createAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> {
    const response = await api.post('/alerts', alert);
    return response.data;
  },

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    const response = await api.patch(`/alerts/${id}`, updates);
    return response.data;
  },

  async deleteAlert(id: string): Promise<void> {
    await api.delete(`/alerts/${id}`);
  },

  async getActiveAlerts(): Promise<Alert[]> {
    const response = await api.get('/alerts/active');
    return response.data;
  },
};

// Route Services
export const routeService = {
  async getOptimalRoutes(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    avoidAlerts = true
  ): Promise<Route[]> {
    const response = await api.post('/routes/optimal', {
      origin,
      destination,
      avoidAlerts,
    });
    return response.data;
  },

  async getRoute(routeId: string): Promise<Route> {
    const response = await api.get(`/routes/${routeId}`);
    return response.data;
  },
};

// Twitter Services
export const twitterService = {
  async getRelevantTweets(keywords?: string[], location?: { lat: number; lng: number; radius: number }): Promise<TwitterData[]> {
    const response = await api.get('/twitter/relevant', {
      params: { keywords: keywords?.join(','), ...location },
    });
    return response.data;
  },

  async analyzeTweet(tweetId: string): Promise<TwitterData> {
    const response = await api.get(`/twitter/analyze/${tweetId}`);
    return response.data;
  },
};

// Weather Services
export const weatherService = {
  async getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    const response = await api.get('/weather', { params: { lat, lng } });
    return response.data;
  },

  async getWeatherAlerts(lat: number, lng: number, radius = 50): Promise<Alert[]> {
    const response = await api.get('/weather/alerts', { params: { lat, lng, radius } });
    return response.data;
  },
};

// Search Services
export const searchService = {
  async searchAlerts(query: string, filters?: SearchFilters): Promise<Alert[]> {
    const response = await api.get('/search/alerts', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  async searchLocations(query: string): Promise<Array<{ name: string; lat: number; lng: number }>> {
    const response = await api.get('/search/locations', { params: { q: query } });
    return response.data;
  },
};