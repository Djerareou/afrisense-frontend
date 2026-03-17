import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import TrackerForm from '@/components/admin/TrackerForm';
import { adminApi } from '@/api';

type TrackerRow = {
  id: string;
  imei: string;
  name: string;
  vehicleType?: string;
  assignedUserId?: string | null;
  status: string;
  lastUpdate?: string;
  enabled: boolean;
};

export default function AdminTrackers() {
  const [trackers, setTrackers] = useState<TrackerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  const fetch = async () => {
    setLoading(true);
    try {
      const t = await adminApi.listTrackers();
      setTrackers(t as any);
      const u = await adminApi.listUsers();
      setUsers(u as any);
    } catch (e) {
      // ignore — fallback empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (payload: any) => {
    setCreating(true);
    try {
      await adminApi.createTracker(payload);
      setShowCreate(false);
      await fetch();
    } catch (e: any) {
      alert(e?.message || 'Failed to create');
    } finally { setCreating(false); }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await adminApi.toggleTrackerEnabled(id, enabled);
      await fetch();
    } catch (e) {
      alert('Failed to update');
    }
  };

  const handleAssign = async (id: string, userId: string | null) => {
    try {
      await adminApi.assignTracker(id, userId);
      await fetch();
    } catch (e) {
      alert('Failed to assign');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Trackers</h2>
          <div className="text-sm text-gray-500">Manage device inventory and assignments</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-[#00BFA6] text-white rounded">New tracker</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6"><Loader /></div>
        ) : (
          <table className="min-w-full divide-y">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3">IMEI</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">Last update</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {trackers.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">{t.imei}</td>
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.vehicleType || '—'}</td>
                  <td className="px-4 py-3">{t.enabled ? t.status : 'disabled'}</td>
                  <td className="px-4 py-3">
                    <select value={t.assignedUserId ?? ''} onChange={(e) => handleAssign(t.id, e.target.value || null)} className="border p-1 rounded">
                      <option value="">— Unassigned —</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">{t.lastUpdate ? new Date(t.lastUpdate).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(t.id, !(t.enabled))} className={`px-2 py-1 rounded ${t.enabled ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{t.enabled ? 'Disable' : 'Enable'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create tracker">
        <TrackerForm users={users} submitting={creating} onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />
      </Modal>
    </div>
  );
}
