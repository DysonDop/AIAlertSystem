# AI-Driven Natural Disaster Alert System - Frontend

A modern React application for real-time natural disaster monitoring, alerting, and search & rescue coordination.

## Features

- **Real-time Dashboard**: Monitor active alerts and incidents on an interactive map
- **Alert Management**: View, filter, and search through disaster alerts from multiple sources
- **Interactive Mapping**: Visualize incidents with Leaflet maps, including affected areas and routes
- **Search & Rescue**: Coordinate emergency response operations and track incidents
- **Route Planning**: Find safe alternative routes avoiding disaster-affected areas
- **Multi-source Data**: Integrates Twitter feeds, meteorological data, and manual reports
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Maps**: React Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MCP Backend server running (see ../server directory)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in `.env`:
   - `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:8000)
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `VITE_TWITTER_BEARER_TOKEN`: Twitter API bearer token

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── alerts/         # Alert-related components
│   ├── layout/         # Layout and navigation components
│   ├── maps/           # Map components
│   └── search/         # Search functionality
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── AlertsPage.tsx  # Alert management
│   ├── MapPage.tsx     # Interactive map view
│   ├── SearchPage.tsx  # Search & rescue
│   └── SettingsPage.tsx # User settings
├── services/           # API integration
│   └── api.ts          # Backend API calls
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## API Integration

The frontend connects to the MCP backend server for:

- **Alert Management**: CRUD operations for disaster alerts
- **Twitter Integration**: Real-time social media monitoring
- **Weather Data**: Meteorological information and warnings
- **Route Planning**: Safe path calculation with Google Maps API
- **Search Operations**: Location and incident search

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | - |
| `VITE_TWITTER_BEARER_TOKEN` | Twitter API bearer token | - |

## Development Guidelines

- Use TypeScript for type safety
- Follow component-based architecture
- Implement responsive design with Tailwind CSS
- Handle loading and error states appropriately
- Use mock data for development when backend is unavailable

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Test components with different data scenarios
4. Ensure responsive design across devices
5. Document new components and APIs