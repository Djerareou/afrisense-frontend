import MapView from '@/components/map/MapView';

export default function AdminDashboard() {
  const mapCenter: [number, number] = [12.1348, 15.0557];
  const trackerPosition: [number, number] = [12.1348, 15.0557];
  const geofenceCenter: [number, number] = [12.1348, 15.0557];
  const historyPath: [number, number][] = [];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Active devices<br/><span className="text-2xl font-bold">123</span></div>
        <div className="bg-white p-4 rounded shadow">Unresolved alerts<br/><span className="text-2xl font-bold">7</span></div>
        <div className="bg-white p-4 rounded shadow">MRR<br/><span className="text-2xl font-bold">€4,320</span></div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Live Map</h2>
        <div className="h-96">
          <MapView
            center={mapCenter}
            zoom={12}
            trackerPosition={trackerPosition}
            geofenceCenter={geofenceCenter}
            geofenceRadius={500}
            historyPath={historyPath}
            speed={0}
            battery={0}
            lastUpdate="—"
          />
        </div>
      </section>
    </div>
  );
}
