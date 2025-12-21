import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TrackerList from '../components/tracking/TrackerList';
import AlertsPanel from '../components/alerts/AlertsPanel';
import MapView from '../components/map/MapView';

export function App() {
  const [selectedTrackerId, setSelectedTrackerId] = useState('car1');

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
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <TrackerList
          trackers={trackers}
          selectedId={selectedTrackerId}
          onSelect={setSelectedTrackerId}
          onAddTracker={() => alert('Ajouter un traqueur')}
        />

        {/* Center Map */}
        <div className="flex-1">
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

        {/* Right Sidebar */}
        <AlertsPanel
          alerts={alerts}
          onViewAll={() => alert('Afficher toutes les alertes')}
        />
      </main>
      <Footer />
    </div>
  );
}
