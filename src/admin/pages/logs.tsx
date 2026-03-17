import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import Loader from '@/components/Loader';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listLogs();
      setLogs(res as any[]);
    } catch (e) { setLogs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Audit Logs</h2>
          <div className="text-sm text-gray-500">System audit trail (read-only)</div>
        </div>
        <div>
          <button onClick={() => fetch()} className="px-3 py-2 border rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? <div className="p-6"><Loader /></div> : (
          <table className="min-w-full divide-y">
            <thead>
              <tr className="text-left text-sm text-gray-500"><th className="px-4 py-3">Time</th><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th></tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {logs.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="px-4 py-3">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">{l.admin}</td>
                  <td className="px-4 py-3">{l.action}</td>
                  <td className="px-4 py-3">{l.target || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
