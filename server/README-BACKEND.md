# AI Alert System - Backend API

This is the Node.js Express backend for the AI Alert System, providing Google Maps API integration for routes and safe zones.

## Features

- **Route Planning**: Get optimal routes with alternatives using Google Directions API
- **Safe Zone Locator**: Find nearby hospitals using Google Places API
- **Error Handling**: Comprehensive error handling with meaningful responses
- **CORS Support**: Configured for frontend integration
- **Modular Architecture**: Clean separation of concerns

## Prerequisites

- Node.js 16.0.0 or higher
- Google Maps API key with the following APIs enabled:
  - Directions API
  - Places API

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file and add your Google Maps API key:
   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

## Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### 1. Get Route Information
**GET** `/getRoute?origin=lat,lng&dest=lat,lng`

Returns route alternatives with distance, duration, and encoded polylines.

**Parameters:**
- `origin` (required): Origin coordinates as "latitude,longitude"
- `dest` (required): Destination coordinates as "latitude,longitude"

**Example:**
```
GET /getRoute?origin=37.7749,-122.4194&dest=37.7849,-122.4094
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "routes": [
      {
        "routeIndex": 0,
        "distance": {
          "text": "2.1 km",
          "value": 2100
        },
        "duration": {
          "text": "8 mins",
          "value": 480
        },
        "summary": "Market St",
        "encodedPolyline": "encoded_polyline_string",
        "startAddress": "San Francisco, CA, USA",
        "endAddress": "San Francisco, CA, USA"
      }
    ]
  },
  "timestamp": "2025-09-20T10:30:00.000Z"
}
```

### 2. Get Safe Zones (Nearby Hospitals)
**GET** `/getSafeZones?lat=number&lng=number&radius=number`

Returns nearby hospitals within the specified radius.

**Parameters:**
- `lat` (required): Latitude as a number
- `lng` (required): Longitude as a number
- `radius` (optional): Search radius in meters (default: 5000, max: 50000)

**Example:**
```
GET /getSafeZones?lat=37.7749&lng=-122.4194&radius=5000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "safeZones": [
      {
        "id": "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
        "name": "UCSF Medical Center",
        "location": {
          "lat": 37.7629,
          "lng": -122.4577
        },
        "address": "505 Parnassus Ave, San Francisco",
        "rating": 4.1,
        "userRatingsTotal": 500,
        "businessStatus": "OPERATIONAL",
        "openNow": true,
        "distance": 1250.5
      }
    ],
    "searchLocation": { "lat": 37.7749, "lng": -122.4194 },
    "radius": 5000,
    "totalFound": 8
  },
  "timestamp": "2025-09-20T10:30:00.000Z"
}
```

### 3. Health Check
**GET** `/health`

Returns server status and configuration.

**Response:**
```json
{
  "status": "OK",
  "message": "Google Maps API service is running",
  "timestamp": "2025-09-20T10:30:00.000Z",
  "environment": "development"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "example": "Usage example (when applicable)"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error
- `502` - Bad Gateway (Google API error)
- `503` - Service Unavailable (API connection error)

## Project Structure

```
server/
├── server.js                 # Main application file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── routes/
│   └── api.js               # API route handlers
├── services/
│   └── googleMapsService.js # Google Maps API integration
└── README.md                # This file
```

## Development

### Adding New Features

1. **Service Layer**: Add new functions to `services/googleMapsService.js`
2. **Route Layer**: Add new endpoints to `routes/api.js`
3. **Testing**: Test endpoints using curl or Postman

### Example CURL Commands

```bash
# Test route endpoint
curl "http://localhost:3000/getRoute?origin=37.7749,-122.4194&dest=37.7849,-122.4094"

# Test safe zones endpoint
curl "http://localhost:3000/getSafeZones?lat=37.7749&lng=-122.4194&radius=5000"

# Health check
curl "http://localhost:3000/health"
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes | - |
| `PORT` | Server port number | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `CLIENT_URL` | Frontend URL for CORS | No | http://localhost:5173 |

## Contributing

1. Follow the existing code structure
2. Add proper error handling for new endpoints
3. Update this README for new features
4. Test all endpoints before committing

## License

MIT License