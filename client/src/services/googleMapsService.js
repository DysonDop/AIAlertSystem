import { Loader } from '@googlemaps/js-api-loader';

class GoogleMapsService {
  constructor() {
    this.google = null;
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.placesService = null;
    this.markers = [];
    this.polylines = [];
    this.isLoaded = false;
  }

  async fetchMapsConfig() {
    if (this.mapsConfig) return this.mapsConfig;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiBaseUrl}/api/maps/config`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch maps configuration');
      }
      
      this.mapsConfig = await response.json();
      return this.mapsConfig;
    } catch (error) {
      console.error('Error fetching maps config:', error);
      throw new Error('Unable to load Google Maps configuration. Please ensure the backend is running and configured properly.');
    }
  }

  async loadGoogleMaps() {
    if (this.isLoaded) return this.google;

    // Fetch configuration from backend API
    const { apiKey, mapId, libraries, version } = await fetch('/api/maps/config').then(res => res.json());

    const loader = new Loader({
      apiKey,
      version,
      libraries,
      mapIds: GOOGLE_MAPS_ID, 
    });

    await loader.load();
    this.google = window.google;
    
    // Import the AdvancedMarkerElement specifically
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
    
    // Fetch configuration including Map ID
    const { apiKey, mapId, libraries, version } = await fetch('/api/maps/config').then(res => res.json());
    
    const defaultOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 10,
      mapId: GOOGLE_MAPS_ID, // also set in the map options
      ...options
    };

    this.map = new google.maps.Map(document.getElementById("map"), defaultOptions);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer({
      suppressMarkers: true, // We'll use custom markers
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });
    this.directionsRenderer.setMap(this.map);
    // Note: PlacesService has been deprecated for new customers
    // Use google.maps.places.Place API instead if needed

    return this.map;
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  clearPolylines() {
    this.polylines.forEach(polyline => polyline.setMap(null));
    this.polylines = [];
  }

  setCenter(center, zoom) {
    if (this.map) {
      this.map.setCenter(center);
      if (zoom) {
        this.map.setZoom(zoom);
      }
    }
  }

  addMarker(position, options = {}) {
    const marker = new this.google.maps.Marker({
      position,
      map: this.map,
      ...options
    });

    this.markers.push(marker);
    return marker;
  }

  addAlertMarker(alert, onClick) {
    const position = { lat: alert.location.lat, lng: alert.location.lng };
    
    const severityColors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#3b82f6'
    };

    const alertEmojis = {
      earthquake: '🌍',
      flood: '🌊',
      fire: '🔥',
      storm: '⛈️',
      tsunami: '🌊',
      hurricane: '🌀',
      tornado: '🌪️'
    };

    const marker = new this.google.maps.Marker({
      position,
      map: this.map,
      title: alert.title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${severityColors[alert.severity] || '#6b7280'}" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">${alertEmojis[alert.type] || '⚠️'}</text>
          </svg>
        `)}`,
        scaledSize: new this.google.maps.Size(32, 32),
        anchor: new this.google.maps.Point(16, 16)
      }
    });
    
    const infoWindow = new this.google.maps.InfoWindow({
      content: `
        <div style="min-width: 200px; padding: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; margin-right: 8px;">${alertEmojis[alert.type] || '⚠️'}</span>
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${alert.title}</h3>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${alert.description}</p>
          <div style="font-size: 12px; color: #888; line-height: 1.4;">
            <div>Severity: <strong>${alert.severity.toUpperCase()}</strong></div>
            <div>Location: ${alert.location.address}</div>
            <div>Time: ${new Date(alert.timestamp).toLocaleString()}</div>
            <div>Status: <span style="color: ${alert.isActive ? '#10b981' : '#6b7280'}">${alert.isActive ? 'Active' : 'Inactive'}</span></div>
          </div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
      if (onClick) onClick(alert);
    });

    // Add radius circle for alert
    if (alert.location.radius) {
      const circle = new this.google.maps.Circle({
        strokeColor: severityColors[alert.severity] || '#6b7280',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: severityColors[alert.severity] || '#6b7280',
        fillOpacity: 0.2,
        map: this.map,
        center: position,
        radius: alert.location.radius * 1000 // Convert km to meters
      });
      this.markers.push(circle);
    }

    this.markers.push(marker);
    return marker;
  }

  addSafeZoneMarker(safeZone) {
    const position = { lat: safeZone.location.lat, lng: safeZone.location.lng };
    
    const marker = new this.google.maps.Marker({
      position,
      map: this.map,
      title: safeZone.name,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#10b981" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">🏥</text>
          </svg>
        `)}`,
        scaledSize: new this.google.maps.Size(32, 32),
        anchor: new this.google.maps.Point(16, 16)
      }
    });

    const infoWindow = new this.google.maps.InfoWindow({
      content: `
        <div style="min-width: 200px; padding: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; margin-right: 8px;">🏥</span>
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${safeZone.name}</h3>
          </div>
          <div style="font-size: 14px; line-height: 1.4;">
            <div><strong>Address:</strong> ${safeZone.address}</div>
            <div><strong>Distance:</strong> ${Math.round(safeZone.distance)}m</div>
            ${safeZone.rating ? `<div><strong>Rating:</strong> ${safeZone.rating}⭐ (${safeZone.userRatingsTotal} reviews)</div>` : ''}
            ${safeZone.openNow !== null ? `<div><strong>Status:</strong> <span style="color: ${safeZone.openNow ? '#10b981' : '#ef4444'}">${safeZone.openNow ? 'Open' : 'Closed'}</span></div>` : ''}
            <div style="color: #10b981; font-weight: bold; margin-top: 4px;">Safe Zone</div>
          </div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    return marker;
  }

  addRouteMarker(position, type, title) {
    const colors = {
      origin: '#3b82f6',
      destination: '#ef4444'
    };

    const emojis = {
      origin: '🚩',
      destination: '🏁'
    };

    const marker = new this.google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${colors[type]}" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">${emojis[type]}</text>
          </svg>
        `)}`,
        scaledSize: new this.google.maps.Size(32, 32),
        anchor: new this.google.maps.Point(16, 16)
      }
    });

    const infoWindow = new this.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${title}</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px;">${type === 'origin' ? 'Start Point' : 'End Point'}</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    return marker;
  }

  displayRoutes(routes, origin, destination) {
    this.clearPolylines();
    
    // Add route markers
    this.addRouteMarker(origin, 'origin', 'Route Origin');
    this.addRouteMarker(destination, 'destination', 'Route Destination');

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      
      // Decode the polyline
      const decodedPath = this.decodePolyline(route.encodedPolyline);
      
      const polyline = new this.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: this.map
      });

      // Add click listener for route info
      const infoWindow = new this.google.maps.InfoWindow();
      
      polyline.addListener('click', (event) => {
        infoWindow.setContent(`
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">Route ${index + 1}</h3>
            <div style="font-size: 14px; line-height: 1.4;">
              <div><strong>Distance:</strong> ${route.distanceText}</div>
              <div><strong>Duration:</strong> ${route.durationText}</div>
              <div><strong>Summary:</strong> ${route.summary}</div>
            </div>
          </div>
        `);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(this.map);
      });

      this.polylines.push(polyline);
    });

    // Fit map to show all routes
    const bounds = new this.google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    this.map.fitBounds(bounds);
  }

  decodePolyline(encoded) {
    if (!encoded) return [];
    
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({ lat: lat / 1E5, lng: lng / 1E5 });
    }
    return poly;
  }

  setCenter(position, zoom = null) {
    if (this.map) {
      this.map.setCenter(position);
      if (zoom !== null) {
        this.map.setZoom(zoom);
      }
    }
  }

  getMap() {
    return this.map;
  }
}

export default GoogleMapsService;