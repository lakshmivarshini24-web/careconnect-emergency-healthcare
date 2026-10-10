import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital } from '../../types';
import { MapPin, Phone, Bed, Navigation } from 'lucide-react';

// Fix Leaflet marker icons in React Vite
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospitalId?: string;
  userLat?: number;
  userLng?: number;
  height?: string;
}

// Component to handle map center changes dynamically
const MapRecenter: React.FC<{ lat: number; lng: number; zoom?: number }> = ({ lat, lng, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};

export const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals,
  selectedHospitalId,
  userLat = 12.9716,
  userLng = 77.5946,
  height = '400px'
}) => {
  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);
  const centerLat = selectedHospital ? selectedHospital.latitude : userLat;
  const centerLng = selectedHospital ? selectedHospital.longitude : userLng;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter lat={centerLat} lng={centerLng} />

        {/* User Location Marker */}
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-blue-600 font-bold block mb-1">📍 Your Current Location</strong>
              <span>Emergency Dispatch Center</span>
            </div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        {hospitals.map(hosp => (
          <Marker
            key={hosp.id}
            position={[hosp.latitude, hosp.longitude]}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs max-w-xs">
                <strong className="text-slate-900 font-bold text-sm block">{hosp.name}</strong>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {hosp.address}
                </p>
                <div className="flex items-center gap-2 font-bold py-1">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Bed className="w-3 h-3" /> {hosp.availableBeds} beds
                  </span>
                  <span className="text-indigo-600">
                    ICU: {hosp.icuAvailable}
                  </span>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex-1 py-1 px-2 bg-slate-900 text-white rounded text-[10px] text-center font-bold"
                  >
                    Call Hospital
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-blue-100 text-blue-700 rounded"
                    title="Get Directions"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
