# AI Alert System - Setup Guide

This guide will help you set up the complete AI Alert System with Google Maps integration.

## 🏗️ Architecture Overview

This is a **full-stack application** with separate frontend and backend:

- **Frontend** (`/client`): React + TypeScript + Vite application for the user interface
- **Backend** (`/server`): Node.js + Express API server with Google Maps integration

Each has its own `package.json`, `.env.example`, `README.md`, and `.gitignore` files because they are **separate applications** that run in different environments. This is standard practice for full-stack development.

📋 **For detailed file structure analysis, see [FILE_ANALYSIS.md](./FILE_ANALYSIS.md)**

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- Google Maps API key with the following APIs enabled:
  - **Directions API** (for route planning)
  - **Places API** (for finding safe zones/hospitals)

## 🛠️ Backend Setup

### 1. Install Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Environment Configuration

3. Create environment file:
   ```bash
   cp .env.backend.example .env
   ```

2. Edit the `.env` file and add your Google Maps API key:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

### 3. Start the Backend Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

The backend will be available at `http://localhost:3000`

## 🌐 Frontend Setup

### 1. Install Dependencies

Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

### 2. Environment Configuration

Create your `.env` file in the client directory:
```bash
cp .env.frontend.example .env
```

The default configuration should work:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_MAPS_API_BASE_URL=http://localhost:3000
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗺️ Google Maps API Setup

### 1. Get API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**
4. Create credentials (API Key)
5. Optionally, restrict the API key to your domain for security

### 2. API Restrictions (Recommended)

For security, restrict your API key:
- **Application restrictions**: HTTP referrers (web sites)
- **API restrictions**: Select only the APIs you need
- **Referrer restrictions**: Add your domains (e.g., `localhost:*`, `yourdomain.com/*`)

## 🧪 Testing the Integration

### 1. Test Backend Endpoints

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Test route planning:
```bash
curl "http://localhost:3000/getRoute?origin=37.7749,-122.4194&dest=37.7849,-122.4094"
```

Test safe zones:
```bash
curl "http://localhost:3000/getSafeZones?lat=37.7749&lng=-122.4194&radius=5000"
```

### 2. Test Frontend Features

1. Open `http://localhost:5173` in your browser
2. Navigate to the Map page
3. Use the route controls to:
   - Enter origin and destination coordinates
   - Click "Plan Route" to see route options
   - Toggle "Show Hospitals" to see nearby safe zones
   - Click markers for detailed information

## 📱 Features Overview

### Backend Features

- **Route Planning API**: Get multiple route options with distance, duration, and encoded polylines
- **Safe Zone Locator**: Find nearby hospitals within a specified radius
- **Error Handling**: Comprehensive error responses for all failure scenarios
- **CORS Support**: Configured for frontend integration
- **Health Monitoring**: Health check endpoint for service monitoring

### Frontend Features

- **Interactive Map**: Leaflet-based map with custom markers
- **Route Visualization**: Display multiple route options as colored polylines
- **Safe Zone Display**: Show nearby hospitals with ratings and status
- **Alert Markers**: Display disaster alerts with severity indicators
- **Route Controls**: User-friendly interface for route planning
- **Real-time Updates**: Dynamic loading and error handling

## 🔧 Configuration Options

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes | - |
| `PORT` | Server port number | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Main API base URL | http://localhost:8000 |
| `VITE_MAPS_API_BASE_URL` | Google Maps API base URL | http://localhost:3000 |

## 🚀 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ai-alert-backend"
   ```
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure environment variables securely

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your web server
3. Configure production environment variables
4. Set up proper routing for SPA

## 🐛 Troubleshooting

### Common Issues

1. **Google Maps API Error**: Ensure your API key is valid and has the required APIs enabled
2. **CORS Issues**: Check that CORS is properly configured in the backend
3. **Port Conflicts**: Ensure ports 3000 (backend) and 5173 (frontend) are available
4. **Missing Dependencies**: Run `npm install` in both client and server directories

### Error Messages

- **"GOOGLE_MAPS_API_KEY environment variable is required"**: Add your API key to `.env`
- **"Google Maps API error: OVER_QUERY_LIMIT"**: You've exceeded API quota limits
- **"Invalid coordinates format"**: Use proper lat,lng format (e.g., "37.7749,-122.4194")

## 📞 Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Verify API key permissions and quotas
3. Ensure all dependencies are installed correctly
4. Check network connectivity and firewall settings

## 🔒 Security Considerations

1. **API Key Security**: 
   - Never commit API keys to version control
   - Use environment variables
   - Restrict API keys to specific domains
   - Monitor API usage

2. **Input Validation**:
   - All coordinates are validated
   - Rate limiting should be implemented in production
   - Sanitize all user inputs

3. **CORS Configuration**:
   - Configure allowed origins properly
   - Use HTTPS in production
   - Implement proper authentication if needed

---

🎉 **Congratulations!** Your AI Alert System with Google Maps integration is now ready to use!