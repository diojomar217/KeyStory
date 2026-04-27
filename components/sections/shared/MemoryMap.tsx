'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MemoryMapLocation } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';

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
const createLocationPinIcon = () => {
  return L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="
        width:36px;
        height:36px;
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
      ">
        <div style="
          width:34px;
          height:34px;
          background:#ec4899;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 10px 22px rgba(236,72,153,0.25);
          border:2px solid white;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <span style="
            transform:rotate(45deg);
            color:white;
            font-size:14px;
          ">
          </span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
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
        map.fitBounds(bounds, { padding: [45, 45] });
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
  theme?: ThemeKey;
}

function getLocationType(location: MemoryMapLocation, index: number) {
  const raw = `${location.name ?? ''} ${location.description ?? ''}`.toLowerCase();

  if (raw.includes('church') || raw.includes('parish') || raw.includes('ceremony')) {
    return 'Ceremony';
  }

  if (raw.includes('reception') || raw.includes('mcdonald') || raw.includes('restaurant')) {
    return 'Reception';
  }

  return index === 0 ? 'Ceremony' : index === 1 ? 'Reception' : 'Event';
}

export default function MemoryMap({ locations, theme }: MemoryMapProps) {
  const themeUtils = theme ? useThemeUtils(theme) : null;

  const colors = themeUtils?.colors ?? {
    primary: '#be185d',
    secondary: '#f9a8d4',
    text: '#334155',
    card: '#ffffff',
    border: '#e2e8f0',
  };

  const [mapReady, setMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  const { validLocations, invalidCount } = useMemo(() => {
    const valid: MemoryMapLocation[] = [];
    let invalid = 0;

    locations.forEach((loc) => {
      if (!loc || typeof loc !== 'object') {
        invalid++;
        return;
      }

      // Coerce lat/lng to numbers to support values stored as strings.
      const latNum = Number((loc as any).lat);
      const lngNum = Number((loc as any).lng);

      if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
        invalid++;
        return;
      }

      if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
        invalid++;
        return;
      }

      if (latNum === 0 && lngNum === 0) {
        invalid++;
        return;
      }

      valid.push({
        ...loc,
        lat: latNum,
        lng: lngNum,
      });
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
      <div
        className="flex h-[320px] w-full items-center justify-center rounded-b-[30px]"
        style={{ backgroundColor: `${colors.card}` }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4"
            style={{
              borderColor: `${colors.secondary}55`,
              borderTopColor: colors.primary,
            }}
          />
          <p className="text-sm" style={{ color: `${colors.text}aa` }}>
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  if (validLocations.length === 0) {
    return (
      <div
        className="flex h-[320px] w-full items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${colors.secondary}10, ${colors.card})`,
        }}
      >
        <div className="px-8 text-center">
          <div className="mb-3 text-5xl">🗺️</div>
          <h3 className="mb-2 text-lg font-semibold" style={{ color: colors.text }}>
            No Valid Locations
          </h3>
          <p style={{ color: `${colors.text}b8` }}>
            No event locations could be loaded.
          </p>
          <p className="mt-1 text-sm" style={{ color: `${colors.text}8f` }}>
            {invalidCount > 0
              ? `${invalidCount} location(s) had invalid data`
              : 'Add locations with coordinates in the builder'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-[10] w-full overflow-hidden">
      <div className="relative h-[300px] w-full sm:h-[330px] md:h-[360px]">
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
              icon={createLocationPinIcon()}
              eventHandlers={{
                click: () => setSelectedLocation(location.id),
              }}
            >
              <Popup maxWidth={230}>
                <div className="memory-popup text-center">
                  <h3
                    className="mb-1 text-sm font-bold break-words"
                    style={{ color: colors.primary }}
                  >
                    {location.name}
                  </h3>
                  {location.description && (
                    <p className="text-xs break-words" style={{ color: `${colors.text}c0` }}>
                      {location.description}
                    </p>
                  )}
                  {location.date && (
                    <p className="mt-1 text-xs break-words" style={{ color: `${colors.text}90` }}>
                      {location.date}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {!mapReady && (
          <div
            className="absolute inset-0 z-[20] flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: `${colors.card}e6` }}
          >
            <div className="text-center">
              <div
                className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-[3px]"
                style={{
                  borderColor: `${colors.secondary}55`,
                  borderTopColor: colors.primary,
                }}
              />
              <p className="text-xs" style={{ color: `${colors.text}aa` }}>
                Initializing map...
              </p>
            </div>
          </div>
        )}
      </div>

      {validLocations.length > 0 && (
        <div
          className="border-t px-4 py-4 sm:px-5 sm:py-5"
          style={{
            background: `linear-gradient(180deg, ${colors.card}, ${colors.card}f6)`,
            borderTopColor: `${colors.border}88`,
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: colors.primary }}
              >
                Event Locations
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: `${colors.text}b5` }}
              >
                Select a venue to focus it on the map
              </p>
            </div>
          </div>

          <div className="grid gap-2.5">
            {validLocations.map((location, index) => {
              const type = getLocationType(location, index);
              const active = selectedLocation === location.id;

              return (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className="text-left transition-all"
                >
                  <div
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      background: active
                        ? `linear-gradient(180deg, ${colors.secondary}12, ${colors.card})`
                        : `linear-gradient(180deg, ${colors.card}, ${colors.card}f7)`,
                      borderColor: active
                        ? `${colors.secondary}55`
                        : `${colors.border}88`,
                      boxShadow: active
                        ? '0 10px 30px rgba(15,23,42,0.06)'
                        : 'none',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${colors.secondary}18`,
                          color: colors.primary,
                        }}
                      >
                        📍
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className="truncate text-sm font-semibold sm:text-[15px]"
                            style={{ color: colors.text }}
                          >
                            {location.name}
                          </p>

                          <span
                            className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                              backgroundColor: `${colors.secondary}15`,
                              color: colors.primary,
                            }}
                          >
                            {type}
                          </span>
                        </div>

                        {(location.address || location.description) && (
                          <p
                            className="mt-1 truncate text-xs sm:text-sm"
                            style={{ color: `${colors.text}ae` }}
                          >
                            {location.address || location.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-heart-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);
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

