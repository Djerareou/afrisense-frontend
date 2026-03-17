import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import Loader from '@/components/Loader';

export default function AdminSubscriptions() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listSubscriptions();
      setList(res as any[]);
    } catch (e) {
      setList([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Subscriptions</h2>
          <div className="text-sm text-gray-500">View and manage user subscriptions</div>
        </div>
        <div className="flex items-center gap-2">
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
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Expires</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {list.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">{s.userId}</td>
                  <td className="px-4 py-3">{s.plan}</td>
                  <td className="px-4 py-3">{new Date(s.expiresAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
