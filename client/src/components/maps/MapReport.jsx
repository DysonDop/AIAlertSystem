import { useCallback, useMemo, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const API = "https://kj5uk03dk9.execute-api.us-east-1.amazonaws.com";

export default function MapReport({ onAlertSubmitted }) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });
  const [pin, setPin] = useState(null); // {lat, lng}
  const [submitting, setSubmitting] = useState(false);

  const center = useMemo(() => ({ lat: 3.139, lng: 101.686 }), []);
  const onClick = useCallback((e) => {
    setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, []);

  async function submitAlert() {
    if (!pin) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/alerts/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "flood",           
          severity: "HIGH",
          description: "User-reported hazard via map",
          location: {
            lat: pin.lat,
            lng: pin.lng
          },
          reportedBy: {
            source: "web-app",
            user: "anonymous"
          },
          source: "manual",
          title: "Flood reported"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      alert("Alert submitted!");
      setPin(null);
      
      // Trigger refresh of manual alerts with a small delay
      if (onAlertSubmitted) {
        // Small delay to ensure the API has processed the new alert
        setTimeout(() => {
          onAlertSubmitted();
        }, 500);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoaded) return <div className="map-report-loading">Loading map…</div>;
  
  return (
    <div className="map-report-container">
      <div className="map-report-instructions">
        Click anywhere on the map to drop a pin, then submit your alert. Help us keep the community informed about potential hazards.
      </div>
      
      <div className="map-report-map-container">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: 320 }}
          zoom={12}
          center={center}
          onClick={onClick}
          options={{ 
            streetViewControl: false, 
            mapTypeControl: false, 
            fullscreenControl: false,
            zoomControl: true,
            mapId: undefined // Remove mapId for better compatibility
          }}
        >
          {pin && <Marker position={pin} />}
        </GoogleMap>
      </div>

      <div className="map-report-controls">
        <div className="map-report-location-info">
          <span className="map-report-pin-icon">
            {pin ? "" : ""}
          </span>
          <span>
            {pin ? (
              <span className="map-report-coordinates">
                {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
              </span>
            ) : (
              "Click to choose a location"
            )}
          </span>
        </div>
        
        <div className="map-report-actions">
          <button
            disabled={!pin || submitting}
            onClick={submitAlert}
            className="map-report-submit-btn"
          >
            {submitting ? "Submitting…" : "Submit Alert"}
          </button>
          {pin && (
            <button 
              onClick={() => setPin(null)} 
              className="map-report-clear-btn"
            >
              Clear Pin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}