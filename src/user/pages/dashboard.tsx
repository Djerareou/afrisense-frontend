import { useState } from 'react';
import { Map, Car, Bell } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import TrackerList from '../../components/tracking/TrackerList';
import AlertsPanel from '../../components/alerts/AlertsPanel';
import MapView from '../../components/map/MapView';

export default function Dashboard() {
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
    {
      id: 'moto1',
      name: 'Moto Sport',
      status: 'online' as const,
      speed: 65,
      battery: 55,
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
      <div className="lg:hidden bg-white border-b border-gray-200 flex font-['Inter'] w-full shrink-0 sticky top-0 z-[100] safe-area-insets">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-2 sm:px-4 py-3 min-h-touch text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00BFA6] ${
            activeTab === 'map'
              ? 'bg-[#00BFA6] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          aria-pressed={activeTab === 'map'}
        >
          <Map className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" aria-hidden="true" />
          <span>Carte</span>
        </button>
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex-1 px-2 sm:px-4 py-3 min-h-touch text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00BFA6] ${
            activeTab === 'trackers'
              ? 'bg-[#00BFA6] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          aria-pressed={activeTab === 'trackers'}
        >
          <Car className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" aria-hidden="true" />
          <span>Traqueurs</span>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-2 sm:px-4 py-3 min-h-touch text-xs sm:text-sm font-medium transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00BFA6] ${
            activeTab === 'alerts'
              ? 'bg-[#00BFA6] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          aria-pressed={activeTab === 'alerts'}
          aria-label="Alertes (3 non lues)"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" aria-hidden="true" />
          <span>Alertes</span>
          <span className="absolute top-1 right-1 sm:right-2 bg-[#FF7F50] text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-sm">
            3
          </span>
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden relative safe-area-bottom">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`${activeTab === 'trackers' ? 'absolute inset-0 z-[50] gpu-accelerated' : 'hidden lg:block'} lg:relative w-full lg:w-auto transition-transform duration-300 ease-in-out`}>
          <TrackerList
            trackers={trackers}
            selectedId={selectedTrackerId}
            onSelect={setSelectedTrackerId}
            onAddTracker={() => alert('Ajouter un traqueur')}
          />
        </div>

        {/* Center Map - Hidden on mobile based on active tab, always visible on desktop */}
        <div className={`${activeTab === 'map' ? 'absolute inset-0 z-[50] gpu-accelerated' : 'hidden lg:block'} lg:relative flex-1 transition-transform duration-300 ease-in-out`}>
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
        <div className={`${activeTab === 'alerts' ? 'absolute inset-0 z-[50] gpu-accelerated' : 'hidden lg:block'} lg:relative w-full lg:w-auto transition-transform duration-300 ease-in-out`}>
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
