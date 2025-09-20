# AI Alert System

🚨 **A comprehensive full-stack nat📋 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 📚 Documentation

- **[README-FRONTEND.md](./client/README-FRONTEND.md)** - Frontend (React) documentation
- **[README-BACKEND.md](./server/README-BACKEND.md)** - Backend (Node.js) documentation
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[FILE_ANALYSIS.md](./FILE_ANALYSIS.md)** - Architecture and file structure analysisral disaster alert and monitoring system**

This repository contains both frontend and backend components for real-time natural disaster monitoring, alerting, and emergency response coordination.

## 🏗️ Project Architecture

This is a **monorepo** containing two separate applications:

```
AIAlertSystem/
├── client/          # Frontend (React + TypeScript + Vite)
├── server/          # Backend (Node.js + Express + Google Maps API)
├── SETUP.md         # Complete setup instructions
└── README.md        # This file
```

### Frontend (`/client`)
- **Technology**: React 18 + TypeScript + Vite
- **Features**: Interactive maps, real-time alerts, route planning UI
- **Port**: 5173 (development)
- **Purpose**: User interface for disaster monitoring and response

### Backend (`/server`)
- **Technology**: Node.js + Express + Google Maps APIs
- **Features**: Route planning API, safe zone detection, alert management
- **Port**: 3000 (configurable)
- **Purpose**: API server for Google Maps integration and data processing

## 🚀 Quick Start

1. **Setup Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Add your Google Maps API key to .env
   npm run dev
   ```

2. **Setup Frontend**:
   ```bash
   cd client
   npm install
   cp .env.example .env
   # Configure API endpoints in .env
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**
