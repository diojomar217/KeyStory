'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
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
    html: `
      <div style="
        background:#ec4899;
        width:32px;
        height:32px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 2px 8px rgba(236,72,153,0.4);
        border:2px solid white;
      ">
        <span style="
          transform:rotate(45deg);
          color:white;
          font-size:14px;
        ">❤</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapBoundsHandler({
  locations,
  mapReady,
}: {
  locations: MemoryMapLocation[];
  mapReady: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !mapReady || locations.length === 0) return;

    const validLocations = locations.filter(
      (loc) => loc.lat && loc.lng && loc.lat !== 0 && loc.lng !== 0
    );

    if (validLocations.length === 0) return;

    const timer = setTimeout(() => {
      if (validLocations.length === 1) {
        map.setView([validLocations[0].lat, validLocations[0].lng], 12);
      } else {
        const bounds = L.latLngBounds(
          validLocations.map((loc) => [loc.lat, loc.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, [locations, map, mapReady]);

  return null;
}

function MapResizeHandler({ mapReady }: { mapReady: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!mapReady) return;

    const handleResize = () => {
      map.invalidateSize();
    };

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, mapReady]);

  return null;
}

interface MemoryMapProps {
  locations: MemoryMapLocation[];
}

export default function MemoryMap({ locations }: MemoryMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  const { validLocations, invalidCount } = useMemo(() => {
    const valid: MemoryMapLocation[] = [];
    let invalid = 0;

    locations.forEach((loc, index) => {
      if (!loc || typeof loc !== 'object') {
        invalid++;
        return;
      }

      if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
        invalid++;
        return;
      }

      if (loc.lat < -90 || loc.lat > 90 || loc.lng < -180 || loc.lng > 180) {
        invalid++;
        return;
      }

      if (loc.lat === 0 && loc.lng === 0) {
        invalid++;
        return;
      }

      valid.push(loc);
    });

    return { validLocations: valid, invalidCount: invalid };
  }, [locations]);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const center: [number, number] =
    validLocations.length > 0
      ? [validLocations[0].lat, validLocations[0].lng]
      : [20, 0];

  const handleLocationClick = (location: MemoryMapLocation) => {
    setSelectedLocation(location.id);

    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 14, {
        animate: true,
      });
    }
  };

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center border border-slate-200">
        <div className="text-center p-8">
          <div className="text-5xl mb-3">🗺️</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Valid Locations</h3>
          <p className="text-slate-500 font-medium">No memory locations could be loaded</p>
          <p className="text-slate-400 text-sm mt-1">
            {invalidCount > 0
              ? `${invalidCount} location(s) had invalid data`
              : 'Add locations with coordinates in the builder'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative z-[10]">
      <div className="w-full h-[400px] relative">
        <MapContainer
          center={center}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          className="memory-map-leaflet"
          whenReady={() => setMapReady(true)}
          ref={mapRef}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapBoundsHandler locations={validLocations} mapReady={mapReady} />
          <MapResizeHandler mapReady={mapReady} />

          {validLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createHeartIcon()}
              eventHandlers={{
                click: () => setSelectedLocation(location.id),
              }}
            >
              <Popup maxWidth={220}>
                <div className="memory-popup text-center">
                  <h3 className="font-bold text-rose-600 text-sm mb-1 break-words">
                    {location.name}
                  </h3>
                  {location.description && (
                    <p className="text-slate-600 text-xs break-words">
                      {location.description}
                    </p>
                  )}
                  {location.date && (
                    <p className="text-slate-400 text-xs mt-1 break-words">
                      {location.date}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {!mapReady && (
          <div className="absolute inset-0 z-[20] bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-6 border-[3px] border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-500 text-xs">Initializing map...</p>
            </div>
          </div>
        )}
      </div>

      {validLocations.length > 0 && (
        <div className="bg-white p-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600 mb-3">
            Our Memory Locations
          </h4>
          <div className="grid gap-2 max-h-[200px] overflow-y-auto">
            {validLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={`text-left p-3 rounded-xl transition-all ${selectedLocation === location.id
                  ? 'bg-rose-50 border border-rose-200'
                  : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                  }`}
              >
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-rose-500 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">
                      {location.name}
                    </p>
                    {location.description && (
                      <p className="text-slate-500 text-xs truncate">
                        {location.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
  .custom-heart-marker {
    background: transparent !important;
    border: none !important;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
.leaflet-container {
  overflow: hidden !important;
}
  .leaflet-popup-content {
    margin: 12px !important;
    min-width: 0 !important;
    max-width: 220px !important;
    overflow: hidden !important;
  }

  .leaflet-popup-tip-container {
    overflow: hidden;
  }

  .memory-popup {
    width: 100%;
    max-width: 196px;
    overflow: hidden;
    word-break: break-word;
    white-space: normal;
  }

  .memory-map-leaflet {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }
`}</style>
    </div>
  );
}