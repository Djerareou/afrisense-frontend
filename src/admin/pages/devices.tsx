import { useEffect, useState } from 'react';
import { devicesApi } from '@/api';
import { useLiveTracking } from '@/hooks/useLiveTracking';

interface DeviceRow {
  id: string;
  imei: string;
  model: string;
  status: string;
}

export default function AdminDevices() {
  const [devices, setDevices] = useState<DeviceRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await devicesApi.getAll();
        setDevices(res.map(d => ({ id: d.id, imei: d.imei, model: d.model, status: d.status })));
      } catch (e) {
        // fallback to empty
        setDevices([]);
      }
    })();
  }, []);

  // subscribe to live positions for all devices ids
  const trackerIds = devices.map(d => d.id);
  const { positions, isConnected } = useLiveTracking(trackerIds);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Devices</h2>
        <div className="flex items-center gap-2">
          <div className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>{isConnected ? 'Live connected' : 'Disconnected'}</div>
          <button className="px-3 py-2 bg-[#00BFA6] text-white rounded">New Device</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">IMEI</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last position</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {devices.map(d => {
              const pos = positions.get(d.id);
              return (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-3">{d.imei}</td>
                  <td className="px-4 py-3">{d.model}</td>
                  <td className="px-4 py-3">{d.status}</td>
                  <td className="px-4 py-3">{pos ? `${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)} @ ${pos.timestamp}` : '—'}</td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-[#00BFA6] mr-3">View</button>
                    <button className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
