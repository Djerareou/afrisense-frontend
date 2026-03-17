import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import Modal from '@/components/Modal';

export default function AdminGeofences() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showNew, setShowNew] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listGeofences();
      setList(res as any[]);
    } catch (e) { setList([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (payload: any) => {
    await adminApi.createGeofence(payload);
    setShowNew(false);
    await fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete geofence?')) return;
    await adminApi.deleteGeofence(id);
    await fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Geofences</h2>
          <div className="text-sm text-gray-500">Create, edit and assign geofences</div>
        </div>
        <div>
          <button onClick={() => setShowNew(true)} className="px-3 py-2 bg-[#00BFA6] text-white rounded">New</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto p-4">
        {loading ? <div>Loading…</div> : (
          <ul className="space-y-2">
            {list.map((g) => (
              <li key={g.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-gray-500">{g.shape}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(g); setShowNew(true); }} className="px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(g.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={showNew} onClose={() => { setShowNew(false); setEditing(null); }} title={editing ? 'Edit geofence' : 'New geofence'}>
        <div>
          <div className="grid grid-cols-1 gap-3">
            <input defaultValue={editing?.name || ''} placeholder="Name" className="border p-2 rounded w-full" />
            <select defaultValue={editing?.shape || 'circle'} className="border p-2 rounded w-full">
              <option value="circle">Circle</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { setShowNew(false); setEditing(null); }} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={async () => { await handleCreate({ name: (document.querySelector('input') as HTMLInputElement).value || 'New' }); }} className="px-3 py-2 bg-[#00BFA6] text-white rounded">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
