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
        <div className="absolute top-2 md:top-4 left-2 right-2 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-[1000]">
          <div className="bg-white border-l-4 border-[#00BFA6] text-gray-800 px-3 py-2 md:px-6 md:py-3 rounded-lg shadow-md flex items-center gap-2 font-semibold font-['Inter'] text-xs md:text-base">
            <span className="text-[#00BFA6]">✓</span>
            <span>Alerte d'entrée dans la zone</span>
          </div>
        </div>

        {/* Info Bar */}
        <div className="absolute bottom-2 md:bottom-4 left-2 right-2 md:left-4 md:right-4 z-[1000]">
          <div className="bg-[#3B6EA5] text-gray-800 px-3 py-2 md:px-8 md:py-4 rounded-lg shadow-lg font-['Inter'] border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg">⚡</span>
                  <span className="text-white font-medium">Vitesse: <span className="text-white font-bold">{speed} km/h</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg">🔋</span>
                  <span className="text-white font-medium">Batterie: <span className="text-white font-bold">{battery}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg">🕐</span>
                  <span className="text-white font-medium hidden sm:inline">Dernière mise à jour: {lastUpdate}</span>
                  <span className="text-white font-medium sm:hidden">{lastUpdate}</span>
                </div>
              </div>
              <button className="text-white px-4 py-2 md:px-5 md:py-2 rounded-lg hover:bg-[#00a892] transition-all shadow-sm font-semibold text-xs md:text-base w-full md:w-auto">
                Consulter l'historique
              </button>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-20 md:bottom-24 left-2 md:left-4 z-[1000] flex flex-col md:flex-row gap-2 md:gap-3 font-['Inter']">
          <button className="bg-[#00BFA6] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-[#00a892] transition-all font-medium shadow-md flex items-center gap-2 text-xs md:text-base justify-center">
            <span>+</span>
            <span className="hidden sm:inline">Ajouter une géorepérage</span>
            <span className="sm:hidden">Géorepérage</span>
          </button>
          <button className="bg-white text-gray-800 border-2 border-gray-300 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:border-[#00BFA6] hover:text-[#00BFA6] transition-all font-medium shadow-md flex items-center gap-2 text-xs md:text-base justify-center">
            <span>🔍</span>
            <span className="hidden sm:inline">Commandes de zoom</span>
            <span className="sm:hidden">Zoom</span>
          </button>
        </div>

        {/* Zoom Controls (top right) */}
        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-[1000] flex flex-col gap-2">
          <button className="bg-white border-2 border-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
            +
          </button>
          <button className="bg-white border-2 border-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg md:text-xl shadow-lg">
            ⚙️
          </button>
          <button className="bg-white border-2 border-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
            −
          </button>
        </div>
      </MapContainer>
    </div>
  );
}
