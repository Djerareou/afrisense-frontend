import { httpClient, ApiError } from './http';
import { API_ENDPOINTS } from './config';

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const usersApi = {
  /** List users with optional pagination */
  list: async (params?: { page?: number; perPage?: number; q?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.perPage) query.set('perPage', String(params.perPage));
      if (params?.q) query.set('q', params.q);

      const url = `${API_ENDPOINTS.USERS}${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await httpClient.get<any>(url);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return res.data as { items: UserSummary[]; total: number };
      }
      // assume direct payload
      return res as { items: UserSummary[]; total: number };
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[usersApi.list] failed', { params, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[usersApi.list] unexpected error', err);
      throw err;
    }
  },

  getById: async (id: string) => {
    try {
      const res = await httpClient.get<any>(API_ENDPOINTS.USER_BY_ID(id));
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return res.data as UserSummary;
      }
      return res as UserSummary;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[usersApi.getById] failed', { id, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[usersApi.getById] unexpected error', err);
      throw err;
    }
  },
  /** Create a new user (admin) */
  create: async (payload: { fullName?: string; email: string; password?: string; role?: string }) => {
    try {
      const res = await httpClient.post<any>(API_ENDPOINTS.USERS, payload);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return res.data as UserSummary;
      }
      return res as UserSummary;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[usersApi.create] failed', { payload, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[usersApi.create] unexpected error', err);
      throw err;
    }
  },

  /** Update user by id */
  update: async (id: string, payload: Partial<{ fullName: string; email: string; role: string; password?: string }>) => {
    try {
      const res = await httpClient.patch<any>(API_ENDPOINTS.USER_BY_ID(id), payload);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return res.data as UserSummary;
      }
      return res as UserSummary;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[usersApi.update] failed', { id, payload, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[usersApi.update] unexpected error', err);
      throw err;
    }
  },

  /** Delete user by id */
  delete: async (id: string) => {
    try {
      await httpClient.delete(API_ENDPOINTS.USER_BY_ID(id));
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[usersApi.delete] failed', { id, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[usersApi.delete] unexpected error', err);
      throw err;
    }
  },
};
