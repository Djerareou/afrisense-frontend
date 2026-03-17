import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import Loader from '@/components/Loader';

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listAlerts({ severity: severity || undefined });
      setAlerts(res as any[]);
    } catch (e) {
      setAlerts([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [severity]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Alerts</h2>
          <div className="text-sm text-gray-500">System alerts (read-only)</div>
        </div>
        <div className="flex items-center gap-2">
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="border p-2 rounded">
            <option value="">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={() => fetch()} className="px-3 py-2 border rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6"><Loader /></div>
        ) : (
          <table className="min-w-full divide-y">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Tracker</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {alerts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">{a.trackerId}</td>
                  <td className="px-4 py-3">{a.severity}</td>
                  <td className="px-4 py-3">{a.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
