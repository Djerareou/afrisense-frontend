import { useEffect, useState } from 'react';
import { getAdminSettings, updateAdminSettings } from '@/api';
import Loader from '@/components/Loader';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ traccarUrl: string; websocketUrl: string; notifications: { email: boolean; sms: boolean } }>({ traccarUrl: '', websocketUrl: '', notifications: { email: true, sms: false } });

  const fetch = async () => {
    setLoading(true);
    try {
      const s = await getAdminSettings();
      setForm(s as any);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await updateAdminSettings(form);
      alert('Saved');
    } catch (e) { alert('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-6"><Loader /></div>;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="text-sm text-gray-500">Traccar & system configuration</div>
      </div>

      <div className="bg-white rounded shadow p-4 max-w-xl">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium">Traccar API URL</label>
            <input value={form.traccarUrl} onChange={(e) => setForm({ ...form, traccarUrl: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">WebSocket URL</label>
            <input value={form.websocketUrl} onChange={(e) => setForm({ ...form, websocketUrl: e.target.value })} className="border p-2 rounded w-full" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.notifications.email} onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, email: e.target.checked } })} /> Email</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.notifications.sms} onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, sms: e.target.checked } })} /> SMS</label>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={fetch} className="px-3 py-2 border rounded">Reset</button>
          <button onClick={save} className="px-3 py-2 bg-[#00BFA6] text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
