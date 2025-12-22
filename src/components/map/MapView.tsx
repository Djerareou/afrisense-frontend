import { MapContainer, TileLayer, Marker, Circle, Polyline, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center: [number, number];
  zoom: number;
  trackerPosition: [number, number];
  geofenceCenter: [number, number];
  geofenceRadius: number;
  historyPath: [number, number][];
  speed: number;
  battery: number;
  lastUpdate: string;
}

// Fix Leaflet default icon issue
const carIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+aizwvdGV4dD48L3N2Zz4=',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export default function MapView({
  center,
  zoom,
  trackerPosition,
  geofenceCenter,
  geofenceRadius,
  historyPath,
  speed,
  battery,
  lastUpdate,
}: MapViewProps) {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Geofence Circle */}
        <Circle
          center={geofenceCenter}
          radius={geofenceRadius}
          pathOptions={{
            color: '#00BFA6',
            fillColor: '#00BFA6',
            fillOpacity: 0.25,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-center font-semibold font-['Inter']">
              Géorepérage domicile
            </div>
          </Popup>
        </Circle>

        {/* History Path */}
        <Polyline
          positions={historyPath}
          pathOptions={{
            color: '#00BFA6',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
          }}
        />

        {/* Current Position Marker */}
        <Marker position={trackerPosition} icon={carIcon}>
          <Popup>
            <div className="font-semibold">Position actuelle</div>
          </Popup>
        </Marker>

        {/* Enter Alert Banner */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-white border-l-4 border-[#00BFA6] text-gray-800 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 font-semibold font-['Inter']">
            <span className="text-[#00BFA6]">✓</span>
            <span>Alerte d'entrée dans la zone</span>
          </div>
        </div>

        {/* Info Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000] ">
          <div className="bg-[#3B6EA5] text-gray-800 px-8 py-4 rounded-lg shadow-lg flex items-center justify-between font-['Inter'] border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-white font-medium">Vitesse: <span className="text-white font-bold">{speed} km/h</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔋</span>
                <span className="text-white font-medium">Batterie: <span className="text-white font-bold">{battery}%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🕐</span>
                <span className="text-white font-medium">Dernière mise à jour: {lastUpdate}</span>
              </div>
            </div>
            <button className=" text-white px-5 py-2 rounded-lg hover:bg-[#00a892] transition-all shadow-sm font-semibold">
              Consulter l'historique
            </button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-24 left-4 z-[1000] flex gap-3 font-['Inter']">
          <button className="bg-[#00BFA6] text-white px-4 py-2 rounded-lg hover:bg-[#00a892] transition-all font-medium shadow-md flex items-center gap-2">
            <span>+</span>
            <span>Ajouter une géorepérage</span>
          </button>
          <button className="bg-white text-gray-800 border-2 border-gray-300 px-4 py-2 rounded-lg hover:border-[#00BFA6] hover:text-[#00BFA6] transition-all font-medium shadow-md flex items-center gap-2">
            <span>🔍</span>
            <span>Commandes de zoom</span>
          </button>
        </div>

        {/* Zoom Controls (top right) */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl shadow-lg">
            +
          </button>
          <button className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xl shadow-lg">
            ⚙️
          </button>
          <button className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-xl shadow-lg">
            −
          </button>
        </div>
      </MapContainer>
    </div>
  );
}
