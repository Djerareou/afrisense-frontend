import { useEffect, useState } from 'react';
import { usersApi, authApi } from '@/api';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import UserForm from '@/components/admin/UserForm';
import ConfirmDialog from '@/components/ConfirmDialog';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2024-12-01' },
  { id: '2', name: 'Manager', email: 'manager@example.com', role: 'manager', createdAt: '2024-12-05' },
  { id: '3', name: 'Support', email: 'support@example.com', role: 'support', createdAt: '2024-12-10' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [toDelete, setToDelete] = useState<UserRow | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const fetchUsers = async (p = page, pp = perPage, q?: string) => {
    setLoading(true);
    try {
      const resp = await usersApi.list({ page: p, perPage: pp, q: q ?? searchQ });
      if (resp && Array.isArray((resp as any).items)) {
        const items = (resp as any).items as any[];
        setUsers(items.map((it) => ({ id: it.id, name: it.fullName ?? it.name ?? it.email, email: it.email, role: it.role ?? 'user', createdAt: it.createdAt ?? '' })));
        setTotal((resp as any).total ?? items.length);
        setLoading(false);
        return;
      }
      setUsers(MOCK_USERS);
      setTotal(MOCK_USERS.length);
    } catch (e) {
      setUsers(MOCK_USERS);
      setTotal(MOCK_USERS.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, perPage);
  }, [page, perPage]);

  useEffect(() => {
    (async () => {
      try {
        const r = await authApi.getRoles();
        setRoles(r);
      } catch (e) {
        // ignore; keep defaults
      }
    })();
  }, []);

  const openNew = () => { setEditing(null); setServerError(null); setFieldErrors(null); setShowNew(true); };
  const openEdit = (u: UserRow) => { setEditing(u); setServerError(null); setFieldErrors(null); setShowNew(true); };
  const closeNew = () => { setShowNew(false); setEditing(null); setServerError(null); setFieldErrors(null); };

  const handleCreateOrUpdate = async (payload: { fullName?: string; email?: string; password?: string; role?: string }) => {
    setCreating(true);
    setServerError(null);
    setFieldErrors(null);
    try {
      if (editing) {
        // update
        await usersApi.update(editing.id, payload as any);
      } else {
        // create
        // Prefer admin users endpoint if available; fall back to authApi.register when appropriate
        try {
          await usersApi.create(payload as any);
        } catch (e) {
          // fallback to auth.register for systems that only expose that
          await authApi.register({ fullName: payload.fullName, email: payload.email!, password: payload.password || '', role: payload.role, acceptTerms: true });
        }
      }
      // refresh
      await fetchUsers(1, perPage, searchQ);
      closeNew();
    } catch (err: any) {
      // surface structured API errors into modal
      if (err && err.status && err.data) {
        // ApiError shape: message + data (may contain error object)
        setServerError(err.message || 'Server error');
        const d = err.data;
        // try to extract field-level errors if present under error.fields or errors
        if (d?.error?.fields) setFieldErrors(d.error.fields as Record<string, string[]>);
        else if (d?.fields) setFieldErrors(d.fields as Record<string, string[]>);
      } else {
        setServerError(err?.message || 'Failed to save user');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (u: UserRow) => {
    try {
      await usersApi.delete(u.id);
      setToDelete(null);
      // refresh current page
      await fetchUsers(page, perPage);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete user');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="text-sm text-gray-500">Manage users and roles</div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="border p-2 rounded w-full" />
            <button onClick={() => { setSearchQ(search); setPage(1); fetchUsers(1, perPage, search); }} className="px-3 py-2 bg-gray-100 border rounded">Search</button>
            <button onClick={() => { setSearch(''); setSearchQ(''); setPage(1); fetchUsers(1, perPage, ''); }} className="px-3 py-2 bg-white border rounded">Clear</button>
          </div>
          <button onClick={openNew} className="px-3 py-2 bg-[#00BFA6] text-white rounded" disabled={creating}>New User</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6"><Loader /></div>
        ) : (
          <>
            <table className="min-w-full divide-y">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">{u.createdAt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(u)} className="text-sm text-[#00BFA6] mr-3">Edit</button>
                      <button onClick={() => setToDelete(u)} className="text-sm text-red-600">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">Showing page {page} / {totalPages} — {total} users</div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per page:</label>
                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border p-1 rounded">
                  {[10,20,50,100].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-2 py-1 border rounded">Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-2 py-1 border rounded">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={showNew} onClose={closeNew} title={editing ? 'Edit user' : 'Create user'}>
        {serverError && <div className="mb-3 text-sm text-red-700">{serverError}</div>}
        <UserForm initial={editing ? { fullName: editing.name, email: editing.email, role: editing.role } : undefined} roles={roles.length ? roles : ['admin','manager','viewer']} submitting={creating} onCancel={closeNew} onSubmit={handleCreateOrUpdate} showPassword={!editing} serverError={serverError} fieldErrors={fieldErrors} />
      </Modal>

  <ConfirmDialog isOpen={Boolean(toDelete)} title="Delete user" message={`${toDelete?.email || ''}? This action cannot be undone.`} onCancel={() => setToDelete(null)} onConfirm={() => toDelete && handleDelete(toDelete)} confirmLabel="Delete" />
    </div>
  );
}
