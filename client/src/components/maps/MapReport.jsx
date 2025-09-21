import { useCallback, useMemo, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const API = "https://kj5uk03dk9.execute-api.us-east-1.amazonaws.com";

export default function MapReport() {
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
          description: "User-reported hazard",
          location: pin
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      alert("Alert submitted!");
      setPin(null);
      // TODO: call props.onCreated?.() to refresh your list
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoaded) return <div>Loading map…</div>;
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-600">Click anywhere on the map to drop a pin, then submit.</div>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: 420, borderRadius: 16 }}
        zoom={12}
        center={center}
        onClick={onClick}
        options={{ streetViewControl:false, mapTypeControl:false, fullscreenControl:false }}
      >
        {pin && <Marker position={pin} />}
      </GoogleMap>

      <div className="flex items-center gap-3">
        <div className="text-sm">{pin ? `📍 ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}` : "Click to choose a location"}</div>
        <button
          disabled={!pin || submitting}
          onClick={submitAlert}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit alert"}
        </button>
        {pin && (
          <button onClick={() => setPin(null)} className="px-3 py-2 rounded-xl border">
            Clear pin
          </button>
        )}
      </div>
    </div>
  );
}