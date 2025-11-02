import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import type { Location } from '../utils/maps';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon path issues for many bundlers
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  center: Location;
  // onLocationSelect: returns { lat, lng }
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}

function ClickHandler({ onLocationSelect }: { onLocationSelect: (c: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ center, onLocationSelect }: LocationPickerProps) {
  // Ensure center has valid coords
  const mapCenter = [center.lat || 51.5074, center.lng || -0.1278] as [number, number];

  // Workaround: when center changes, flyTo the location
  function MapEffect({ coords }: { coords: [number, number] }) {
    const map = (window as any)._leaflet_map_ref as LeafletMap | undefined;
    useEffect(() => {
      if (map) map.flyTo(coords, 13);
    }, [coords, map]);
    return null;
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slanup-border">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ width: '100%', height: 300 }}
        whenCreated={(mapInstance: LeafletMap) => { (window as any)._leaflet_map_ref = mapInstance }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onLocationSelect={onLocationSelect} />
        <Marker position={mapCenter as [number, number]} />
        <MapEffect coords={mapCenter} />
      </MapContainer>
    </div>
  );
}