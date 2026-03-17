import { useState } from 'react';

type Props = {
  initial?: { fullName?: string; email?: string; role?: string };
  roles: string[];
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { fullName?: string; email?: string; password?: string; role?: string }) => Promise<void> | void;
  showPassword?: boolean; // show password field for create
  serverError?: string | null;
  fieldErrors?: Record<string, string[]> | null;
};

export default function UserForm({ initial, roles, submitting, onCancel, onSubmit, showPassword = true, serverError, fieldErrors }: Props) {
  const [form, setForm] = useState({ fullName: initial?.fullName || '', email: initial?.email || '', password: '', role: initial?.role || roles[0] || 'manager' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Basic client-side validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName || form.fullName.trim().length < 2) errs.fullName = 'Full name is required (min 2 chars)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'A valid email is required';
    if (showPassword) {
      if (!form.password || form.password.length < 8) errs.password = 'Password is required (min 8 chars)';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div>
      {serverError && <div className="mb-2 text-sm text-red-700">{serverError}</div>}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="border p-2 rounded w-full" />
          {fieldErrors?.fullName && <div className="text-xs text-red-700 mt-1">{fieldErrors.fullName.join('; ')}</div>}
        </div>
        <div>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border p-2 rounded w-full" />
          {fieldErrors?.email && <div className="text-xs text-red-700 mt-1">{fieldErrors.email.join('; ')}</div>}
        </div>
        {showPassword && (
          <div>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="border p-2 rounded w-full" />
            {fieldErrors?.password && <div className="text-xs text-red-700 mt-1">{fieldErrors.password.join('; ')}</div>}
          </div>
        )}
        <div>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border p-2 rounded w-full">
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
          </select>
          {fieldErrors?.role && <div className="text-xs text-red-700 mt-1">{fieldErrors.role.join('; ')}</div>}
        </div>
      </div>

      <div className="mt-3">
        {/** top-level server or validation error */}
        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <div className="mb-3 text-sm text-red-700">
            {Object.values(validationErrors)[0]}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button
          onClick={async () => {
            if (!validate()) return;
            try {
              await Promise.resolve(onSubmit({ fullName: form.fullName, email: form.email, password: form.password, role: form.role }));
            } catch (e) {
              // parent will surface server errors via props; just noop here
            }
          }}
          disabled={submitting}
          className="px-3 py-2 rounded bg-[#00BFA6] text-white"
        >{submitting ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}
