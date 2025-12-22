import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TrackerList from '../components/tracking/TrackerList';
import AlertsPanel from '../components/alerts/AlertsPanel';
import MapView from '../components/map/MapView';

export function App() {
  const [selectedTrackerId, setSelectedTrackerId] = useState('car1');
  const [activeTab, setActiveTab] = useState<'map' | 'trackers' | 'alerts'>('map');

  // Mock data
  const trackers = [
    {
      id: 'car1',
      name: 'Car 1',
      status: 'online' as const,
      speed: 45,
      battery: 80,
    },
    {
      id: 'bike1',
      name: 'Bike 01',
      status: 'offline' as const,
      lastSeen: 'Dernière connexion il y a 2h',
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'battery' as const,
      title: 'Battery Low',
      severity: 'medium' as const,
      time: '12:30 PM',
    },
    {
      id: '2',
      type: 'speed' as const,
      title: 'Speed Alert',
      severity: 'high' as const,
      time: '12:15 PM',
    },
    {
      id: '3',
      type: 'geofence' as const,
      title: 'Geofence Entered',
      severity: 'low' as const,
      time: '12:45 PM',
    },
  ];

  // Map coordinates (New York example)
  const mapCenter: [number, number] = [40.7128, -74.0060];
  const trackerPosition: [number, number] = [40.7128, -74.0060];
  const geofenceCenter: [number, number] = [40.7128, -74.0060];
  const historyPath: [number, number][] = [
    [40.7100, -74.0080],
    [40.7110, -74.0070],
    [40.7120, -74.0065],
    [40.7128, -74.0060],
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 max-w-full">
      <Header />
      
      {/* Mobile Tabs - Only visible on small screens */}
      <div className="lg:hidden bg-white border-b border-gray-200 flex font-['Inter'] w-full shrink-0">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'map'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🗺️</span>
          Carte
        </button>
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'trackers'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🚗</span>
          Traqueurs
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all relative ${
            activeTab === 'alerts'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🔔</span>
          Alertes
          <span className="absolute top-1 right-1 sm:right-2 bg-[#FF7F50] text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`${activeTab === 'trackers' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block w-full lg:w-auto`}>
          <TrackerList
            trackers={trackers}
            selectedId={selectedTrackerId}
            onSelect={setSelectedTrackerId}
            onAddTracker={() => alert('Ajouter un traqueur')}
          />
        </div>

        {/* Center Map - Hidden on mobile based on active tab, always visible on desktop */}
        <div className={`${activeTab === 'map' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block flex-1`}>
          <MapView
            center={mapCenter}
            zoom={13}
            trackerPosition={trackerPosition}
            geofenceCenter={geofenceCenter}
            geofenceRadius={500}
            historyPath={historyPath}
            speed={45}
            battery={80}
            lastUpdate="12:45 PM"
          />
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`${activeTab === 'alerts' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block w-full lg:w-auto`}>
          <AlertsPanel
            alerts={alerts}
            onViewAll={() => alert('Afficher toutes les alertes')}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
