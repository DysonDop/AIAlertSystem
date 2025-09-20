export interface Alert {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'tsunami' | 'hurricane' | 'tornado';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    radius: number; // in kilometers
  };
  timestamp: string;
  source: 'twitter' | 'meteorological' | 'manual';
  isActive: boolean;
  affectedAreas?: string[];
  recommendations?: string[];
}

export interface Route {
  id: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints: Array<{ lat: number; lng: number }>;
  distance: number; // in meters
  duration: number; // in seconds
  instructions: string[];
  alertsOnRoute: Alert[];
  isRecommended: boolean;
}

export interface TwitterData {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

export interface WeatherData {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    visibility: number;
  };
  alerts: Array<{
    type: string;
    severity: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface SearchFilters {
  alertTypes: Alert['type'][];
  severity: Alert['severity'][];
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  source: Alert['source'][];
}