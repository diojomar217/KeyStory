'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MemoryMapLocation } from '@/lib/types';

import 'leaflet/dist/leaflet.css';

const fixLeafletIcon = () => {
  if (typeof window === 'undefined') return;
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

const createHeartIcon = () => {
  return L.divIcon({
    className: 'custom-heart-marker',
    html: '<div style="background:#ec4899;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(236,72,153,0.4);border:2px solid white;"><span style="transform:rotate(45deg);color:white;font-size:14px;">heart</span></div>'.replace('heart', String.fromCodePoint(0x2764)),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapBoundsHandler({ locations }: { locations: MemoryMapLocation[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;
    const validLocations = locations.filter((loc) => loc.lat && loc.lng && loc.lat !== 0 && loc.lng !== 0);
    if (validLocations.length === 0) return;
    setTimeout(() => {
      if (validLocations.length === 1) {
        map.setView([validLocations[0].lat, validLocations[0].lng], 12);
      } else {
        const bounds = L.latLngBounds(validLocations.map((loc) => [loc.lat, loc.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 100);
  }, [locations, map]);
  return null;
}

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    setTimeout(handleResize, 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);
  return null;
}

interface MemoryMapProps {
  locations: MemoryMapLocation[];
}

export default function MemoryMap({ locations }: MemoryMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  const validLocations = locations.filter((loc) => loc.lat && loc.lng && loc.lat !== 0 && loc.lng !== 0);

  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcon();
  }, []);

  const center: [number, number] = validLocations.length > 0 ? [validLocations[0].lat, validLocations[0].lng] : [20, 0];

  const handleLocationClick = (location: MemoryMapLocation) => {
    setSelectedLocation(location.id);
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 14);
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
        <p className="text-slate-400">Loading map...</p>
      </div>
    );
  }

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center border border-slate-200">
        <div className="text-center p-8">
          <div className="text-5xl mb-3">map</div>
          <p className="text-slate-500 font-medium">No memory locations added yet</p>
          <p className="text-slate-400 text-sm mt-1">Add locations with coordinates in the builder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
      <div className="w-full h-[400px] relative">
        <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} className="z-0">
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapBoundsHandler locations={validLocations} />
          <MapResizeHandler />
          {validLocations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]} icon={createHeartIcon()} eventHandlers={{ click: () => setSelectedLocation(location.id) }}>
              <Popup>
                <div className="text-center min-w-[150px]">
                  <h3 className="font-bold text-rose-600 text-sm mb-1">{location.name}</h3>
                  {location.description && <p className="text-slate-600 text-xs">{location.description}</p>}
                  {location.date && <p className="text-slate-400 text-xs mt-1">{location.date}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {locations.length > 0 && (
        <div className="bg-white p-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600 mb-3">Our Memory Locations</h4>
          <div className="grid gap-2 max-h-[200px] overflow-y-auto">
            {locations.map((location) => (
              <button key={location.id} onClick={() => handleLocationClick(location)} className={`text-left p-3 rounded-xl transition-all ${selectedLocation === location.id ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 hover:bg-slate-100 border border-transparent'}`}>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-rose-500 mt-0.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{location.name}</p>
                    {location.description && <p className="text-slate-500 text-xs truncate">{location.description}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <style jsx global>{`.custom-heart-marker{background:transparent!important;border:none!important}.leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}.leaflet-popup-content{margin:12px}.leaflet-container{width:100%;height:100%}`}</style>
    </div>
  );
}
