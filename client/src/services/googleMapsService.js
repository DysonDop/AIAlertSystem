import { Loader } from '@googlemaps/js-api-loader';

class GoogleMapsService {
  constructor() {
    this.google = null;
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.markers = [];
    this.polylines = [];
    this.isLoaded = false;
    this.mapsConfig = null;
  }

  async fetchMapsConfig() {
    if (this.mapsConfig) return this.mapsConfig;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiBaseUrl}/api/maps/config`);
      if (!response.ok) throw new Error('Failed to fetch maps configuration');

      this.mapsConfig = await response.json();
      return this.mapsConfig;
    } catch (error) {
      console.error('Error fetching maps config:', error);
      throw new Error(
        'Unable to load Google Maps configuration. Please ensure the backend is running and configured properly.'
      );
    }
  }

  async loadGoogleMaps() {
    if (this.isLoaded) return this.google;

    // Use environment variable for API base URL
    const apiBaseUrl = import.meta.env.VITE_MAPS_API_BASE_URL || 'http://localhost:3000';
    const { apiKey, mapId, libraries, version } = await fetch(`${apiBaseUrl}/api/maps/config`).then(res => res.json());

    const loader = new Loader({
      apiKey,
      version,
      libraries,
      mapIds: [mapId], // mapId is used here
    });

    await loader.load();
    this.google = window.google;

    try {
      await this.google.maps.importLibrary('marker');
    } catch (error) {
      console.warn('Could not import marker library:', error);
    }

    this.isLoaded = true;
    return this.google;
  }

  async initializeMap(container, options = {}) {
    await this.loadGoogleMaps();
    
    // Use environment variable for API base URL
    const apiBaseUrl = import.meta.env.VITE_MAPS_API_BASE_URL || 'http://localhost:3000';
    const { apiKey, mapId, libraries, version } = await fetch(`${apiBaseUrl}/api/maps/config`).then(res => res.json());
    
    const defaultOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 10,
      mapId: mapId, // also set in the map options
      ...options
    };

    this.map = new google.maps.Map(container, defaultOptions);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });
    this.directionsRenderer.setMap(this.map);

    return this.map;
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  clearPolylines() {
    this.polylines.forEach((polyline) => polyline.setMap(null));
    this.polylines = [];
  }

  setCenter(center, zoom) {
    if (this.map) {
      this.map.setCenter(center);
      if (zoom) this.map.setZoom(zoom);
    }
  }

  addMarker(position, options = {}) {
    const marker = new this.google.maps.Marker({ position, map: this.map, ...options });
    this.markers.push(marker);
    return marker;
  }

  // 🔔 Alert markers
  addAlertMarker(alert, onClick) {
    const position = { lat: alert.location.lat, lng: alert.location.lng };
    const severityColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6' };
    const alertEmojis = { earthquake: '🌍', flood: '🌊', fire: '🔥', storm: '⛈️', tsunami: '🌊', hurricane: '🌀', tornado: '🌪️' };

    const marker = new this.google.maps.Marker({
      position,
      map: this.map,
      title: alert.title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${severityColors[alert.severity] || '#6b7280'}" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">${alertEmojis[alert.type] || '⚠️'}</text>
          </svg>
        `)}`,
        scaledSize: new this.google.maps.Size(32, 32),
        anchor: new this.google.maps.Point(16, 16),
      },
    });

    const infoWindow = new this.google.maps.InfoWindow({
      content: `<div><h3>${alert.title}</h3><p>${alert.description}</p></div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
      if (onClick) onClick(alert);
    });

    this.markers.push(marker);
    return marker;
  }

  decodePolyline(encoded) {
    if (!encoded) return [];
    const poly = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return poly;
  }

  getMap() {
    return this.map;
  }
}

export default GoogleMapsService;
