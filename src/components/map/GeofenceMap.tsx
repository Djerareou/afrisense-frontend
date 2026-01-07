import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, useMapEvents, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  center: { lat: number; lng: number };
  radius?: number;
  polygonPoints?: { lat: number; lng: number }[];
  color: string;
  status: 'active' | 'inactive';
}

interface GeofenceMapProps {
  geofences: Geofence[];
  selectedGeofenceId?: string;
  drawMode?: 'circle' | 'polygon' | null;
  onMapClick?: (lat: number, lng: number) => void;
  onCircleCreated?: (center: { lat: number; lng: number }) => void;
  onPolygonPointAdded?: (point: { lat: number; lng: number }) => void;
  center?: [number, number];
  zoom?: number;
}

// Component to handle map clicks
function MapClickHandler({ 
  drawMode, 
  onMapClick, 
  onCircleCreated, 
  onPolygonPointAdded 
}: {
  drawMode?: 'circle' | 'polygon' | null;
  onMapClick?: (lat: number, lng: number) => void;
  onCircleCreated?: (center: { lat: number; lng: number }) => void;
  onPolygonPointAdded?: (point: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      if (onMapClick) {
        onMapClick(lat, lng);
      }
      
      if (drawMode === 'circle' && onCircleCreated) {
        onCircleCreated({ lat, lng });
      }
      
      if (drawMode === 'polygon' && onPolygonPointAdded) {
        onPolygonPointAdded({ lat, lng });
      }
    },
  });
  
  return null;
}

export default function GeofenceMap({
  geofences,
  selectedGeofenceId,
  drawMode = null,
  onMapClick,
  onCircleCreated,
  onPolygonPointAdded,
  center = [12.1348, 15.0557], // N'Djamena, Chad
  zoom = 13,
}: GeofenceMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Update center when selected geofence changes
  useEffect(() => {
    if (selectedGeofenceId) {
      const selected = geofences.find(g => g.id === selectedGeofenceId);
      if (selected) {
        setMapCenter([selected.center.lat, selected.center.lng]);
      }
    }
  }, [selectedGeofenceId, geofences]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full rounded-xl"
        style={{ background: '#e5e7eb' }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Click Handler */}
        <MapClickHandler
          drawMode={drawMode}
          onMapClick={onMapClick}
          onCircleCreated={onCircleCreated}
          onPolygonPointAdded={onPolygonPointAdded}
        />

        {/* Render Geofences */}
        {geofences.map((geofence) => {
          const isSelected = geofence.id === selectedGeofenceId;
          const opacity = geofence.status === 'active' ? 0.5 : 0.2;
          const color = geofence.color;

          if (geofence.type === 'circle' && geofence.radius) {
            return (
              <Circle
                key={geofence.id}
                center={[geofence.center.lat, geofence.center.lng] as LatLngExpression}
                radius={geofence.radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.6 : opacity,
                  weight: isSelected ? 3 : 2,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900">{geofence.name}</h3>
                    <p className="text-sm text-gray-600">
                      Rayon: {geofence.radius}m
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {geofence.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          }

          if (geofence.type === 'polygon' && geofence.polygonPoints && geofence.polygonPoints.length >= 3) {
            const positions = geofence.polygonPoints.map(
              (p) => [p.lat, p.lng] as LatLngExpression
            );

            return (
              <Polygon
                key={geofence.id}
                positions={positions}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.6 : opacity,
                  weight: isSelected ? 3 : 2,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900">{geofence.name}</h3>
                    <p className="text-sm text-gray-600">
                      {geofence.polygonPoints?.length} points
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {geofence.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </p>
                  </div>
                </Popup>
              </Polygon>
            );
          }

          return null;
        })}
      </MapContainer>

      {/* Draw Mode Indicator */}
      {drawMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-6 py-3 rounded-full shadow-lg border-2 border-[#00BFA6]">
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00BFA6] rounded-full animate-pulse"></span>
            {drawMode === 'circle' 
              ? 'Cliquez sur la carte pour placer le centre du cercle'
              : 'Cliquez pour ajouter des points au polygone (min. 3 points)'
            }
          </p>
        </div>
      )}
    </div>
  );
}
