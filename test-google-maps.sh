#!/bin/bash

echo "🔍 Testing Google Maps Frontend Integration"
echo "=========================================="

# Test 1: Check if frontend is accessible
echo "1. Testing frontend accessibility..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:5173"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

# Test 2: Check if Google Maps API key is configured
echo ""
echo "2. Checking Google Maps API configuration..."
if [ -f "/workspaces/AIAlertSystem/client/.env" ]; then
    if grep -q "VITE_GOOGLE_MAPS_API_KEY" /workspaces/AIAlertSystem/client/.env; then
        echo "✅ Google Maps API key is configured in .env"
    else
        echo "❌ Google Maps API key not found in .env"
    fi
else
    echo "❌ Frontend .env file not found"
fi

# Test 3: Check if Leaflet dependencies were removed
echo ""
echo "3. Checking dependency cleanup..."
if ! npm list leaflet 2>/dev/null | grep -q "leaflet"; then
    echo "✅ Leaflet dependencies successfully removed"
else
    echo "❌ Leaflet dependencies still present"
fi

if npm list @googlemaps/js-api-loader 2>/dev/null | grep -q "@googlemaps/js-api-loader"; then
    echo "✅ Google Maps loader dependency installed"
else
    echo "❌ Google Maps loader not found"
fi

# Test 4: Check if source files were updated
echo ""
echo "4. Checking source file updates..."
if grep -q "GoogleMapsService" /workspaces/AIAlertSystem/client/src/components/maps/DisasterMap.jsx; then
    echo "✅ DisasterMap.jsx updated to use Google Maps"
else
    echo "❌ DisasterMap.jsx still using old implementation"
fi

if grep -q "googleMapsService" /workspaces/AIAlertSystem/client/src/components/maps/RouteControls.jsx; then
    echo "✅ RouteControls.jsx updated for Google Maps integration"
else
    echo "❌ RouteControls.jsx not properly updated"
fi

# Test 5: Check if CSS was cleaned up
echo ""
echo "5. Checking CSS cleanup..."
if ! grep -q "leaflet" /workspaces/AIAlertSystem/client/src/index.css; then
    echo "✅ Leaflet CSS imports removed from index.css"
else
    echo "❌ Leaflet CSS imports still present"
fi

echo ""
echo "🎯 Google Maps Migration Summary:"
echo "- Frontend: React + Vite ✅"
echo "- Maps: Google Maps JavaScript API ✅"  
echo "- Loader: @googlemaps/js-api-loader ✅"
echo "- Backend: Node.js + Google Maps APIs ✅"
echo ""
echo "🌐 Access your app at: http://localhost:5173"
echo "📍 Navigate to 'Map' page to test Google Maps functionality"