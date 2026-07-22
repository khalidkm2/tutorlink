import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Student Marker (Red)
const studentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Tutor Marker (Violet)
const tutorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Recenter map whenever center changes
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

export default function MapView({
  center,
  tutors = [],
  height = '400px'
}) {
  const mapCenter =
    center && center.length === 2
      ? center
      : [27.7172, 85.3240];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg"
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: '100%',
          width: '100%',
          background: '#ffffff'
        }}
      >
        {/* Bright OpenStreetMap */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Student Marker */}
        {center && center.length === 2 && (
          <Marker position={center} icon={studentIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
                <br />
                Latitude: {center[0].toFixed(6)}
                <br />
                Longitude: {center[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tutor Markers */}
        {tutors.map((tutor, index) => {
          const coords = tutor?.tutor?.location?.coordinates;

          if (!coords || coords.length !== 2) return null;

          const position = [coords[1], coords[0]];

          return (
            <Marker
              key={tutor.tutor?._id || index}
              position={position}
              icon={tutorIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{tutor.tutor?.name}</strong>

                  <br />
                  Fee: NPR {tutor.profileDetails?.hourlyFee}/hr

                  <br />
                  Experience: {tutor.profileDetails?.experience} Years

                  <br />
                  Rating: ★{' '}
                  {tutor.profileDetails?.averageRating || 'Unrated'}

                  <br />
                  Distance:{' '}
                  {tutor.distance?.toFixed(2)} km
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