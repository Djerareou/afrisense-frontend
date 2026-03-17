import { useState } from 'react';

type Props = {
  initial?: { imei?: string; name?: string; vehicleType?: string; assignedUserId?: string | null };
  users?: { id: string; name: string }[];
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { imei: string; name: string; vehicleType?: string; assignedUserId?: string | null }) => Promise<void> | void;
};

export default function TrackerForm({ initial, users = [], submitting, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<{ imei: string; name: string; vehicleType: string; assignedUserId: string | null }>({ imei: initial?.imei || '', name: initial?.name || '', vehicleType: initial?.vehicleType || '', assignedUserId: initial?.assignedUserId ?? null });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.imei || form.imei.trim().length < 6) e.imei = 'IMEI is required';
    if (!form.name || form.name.trim().length < 2) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm font-medium">IMEI</label>
          <input value={form.imei} onChange={(e) => setForm({ ...form, imei: e.target.value })} className="border p-2 rounded w-full" />
          {errors.imei && <div className="text-xs text-red-600">{errors.imei}</div>}
        </div>
        <div>
          <label className="text-sm font-medium">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" />
          {errors.name && <div className="text-xs text-red-600">{errors.name}</div>}
        </div>
        <div>
          <label className="text-sm font-medium">Vehicle type</label>
          <input value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm font-medium">Assign to user</label>
          <select value={form.assignedUserId ?? ''} onChange={(e) => setForm({ ...form, assignedUserId: e.target.value || null })} className="border p-2 rounded w-full">
            <option value="">— Unassigned —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="px-3 py-2 border rounded" onClick={onCancel}>Cancel</button>
        <button
          className="px-3 py-2 bg-[#00BFA6] text-white rounded"
          onClick={async () => {
            if (!validate()) return;
            await Promise.resolve(onSubmit({ imei: form.imei, name: form.name, vehicleType: form.vehicleType, assignedUserId: form.assignedUserId || null }));
          }}
          disabled={submitting}
        >{submitting ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}
