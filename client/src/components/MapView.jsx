import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Red pin for the Student / center location
const studentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Indigo pin for matching Tutors
const tutorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically pan the map when the center coordinates change
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapView({ center, tutors = [], height = '400px' }) {
  // Fallback to default Kathmandu coords if center is empty/invalid
  const mapCenter = (center && center[0] !== undefined && center[1] !== undefined) 
    ? center 
    : [27.7172, 85.3240];

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-10" 
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
      >
        {/* Dark-themed Map tiles from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Center / Student Marker */}
        {center && center[0] !== undefined && center[1] !== undefined && (
          <Marker position={center} icon={studentIcon}>
            <Popup className="custom-leaflet-popup">
              <div className="text-slate-900 text-xs font-semibold p-1">
                <p className="font-bold border-b pb-1 mb-1">Your Location</p>
                <p className="text-slate-500 font-normal">Latitude: {center[0]}</p>
                <p className="text-slate-500 font-normal">Longitude: {center[1]}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tutors Markers */}
        {tutors.map((tutor) => {
          // GeoJSON is [longitude, latitude], Leaflet expects [latitude, longitude]
          const tutorCoords = tutor.user?.location?.coordinates;
          if (!tutorCoords || tutorCoords.length !== 2) return null;
          
          const position = [tutorCoords[1], tutorCoords[0]]; // [lat, lng]

          return (
            <Marker 
              key={tutor.user?._id || tutor.user?.email} 
              position={position} 
              icon={tutorIcon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="text-slate-900 text-xs p-1">
                  <p className="font-bold border-b pb-1 mb-1 text-indigo-700">
                    {tutor.user?.name}
                  </p>
                  <p className="font-medium">Fee: <span className="text-emerald-600 font-bold">${tutor.profileDetails?.hourlyFee}/hr</span></p>
                  <p className="font-medium">Exp: <span className="text-slate-700">{tutor.profileDetails?.experience} Yrs</span></p>
                  <p className="font-medium">Rating: <span className="text-amber-500 font-bold">★ {tutor.profileDetails?.averageRating || 'Unrated'}</span></p>
                  {tutor.distance !== undefined && (
                    <p className="font-semibold text-slate-500 border-t pt-1 mt-1 text-[10px]">
                      Distance: {tutor.distance.toFixed(2)} km
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <RecenterMap center={mapCenter} />
      </MapContainer>
    </div>
  );
}
