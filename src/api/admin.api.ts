// Lightweight in-memory mock admin API for development and admin UI prototypes
// This file intentionally uses simple, synchronous in-memory arrays — replace with real HTTP calls when wiring to backend.
// lightweight id generator for mock data
function genId(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36).slice(-4)}`;
}

type Tracker = {
  id: string;
  imei: string;
  name: string;
  vehicleType?: string;
  assignedUserId?: string | null;
  status: 'online' | 'offline' | 'disabled';
  lastUpdate?: string;
  enabled: boolean;
};

type User = { id: string; name: string; email: string };

type Geofence = { id: string; name: string; shape: 'circle' | 'polygon'; meta?: any };

// Seed data
const users: User[] = [
  { id: 'u-1', name: 'Alice Admin', email: 'alice@example.com' },
  { id: 'u-2', name: 'Bob Manager', email: 'bob@example.com' },
];

const trackers: Tracker[] = [
  { id: 't-1', imei: '357951086542001', name: 'Van 01', vehicleType: 'van', assignedUserId: 'u-2', status: 'online', lastUpdate: new Date().toISOString(), enabled: true },
  { id: 't-2', imei: '357951086542002', name: 'Car 02', vehicleType: 'car', assignedUserId: null, status: 'offline', lastUpdate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), enabled: true },
  { id: 't-3', imei: '357951086542003', name: 'Truck 03', vehicleType: 'truck', assignedUserId: 'u-1', status: 'disabled', lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), enabled: false },
];

const alerts = [
  { id: 'a-1', trackerId: 't-1', severity: 'high', message: 'Overspeed', timestamp: new Date().toISOString() },
  { id: 'a-2', trackerId: 't-2', severity: 'low', message: 'Battery low', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const subscriptions = [
  { id: 's-1', userId: 'u-1', plan: 'pro', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() },
  { id: 's-2', userId: 'u-2', plan: 'basic', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString() },
];

const geofences: Geofence[] = [
  { id: 'g-1', name: 'HQ Parking', shape: 'circle', meta: { center: [12.13, 15.05], radius: 400 } },
];

const logs: Array<{ id: string; admin: string; action: string; target?: string; timestamp: string }> = [];

function pushLog(admin: string, action: string, target?: string) {
  logs.unshift({ id: genId('log-'), admin, action, target, timestamp: new Date().toISOString() });
}
import { httpClient, ApiError } from './http';

export const adminApi = {
  async getStats() {
    return {
      totalTrackers: trackers.length,
      online: trackers.filter((t) => t.status === 'online').length,
      offline: trackers.filter((t) => t.status === 'offline').length,
      totalUsers: users.length,
      activeAlerts24h: alerts.filter((a) => Date.now() - new Date(a.timestamp).getTime() < 1000 * 60 * 60 * 24).length,
      recentLogs: logs.slice(0, 10),
    };
  },

  // Trackers
  async listTrackers() {
    try {
      // Backend contract: GET /api/admin/trackers -> { data: Tracker[] }
      const res = await httpClient.get<any>('/api/admin/trackers');
      // Support both shapes: { data: [...] } or direct array
      if (res && Array.isArray(res.data)) return res.data as Tracker[];
      if (Array.isArray(res)) return res as Tracker[];
      return [] as Tracker[];
    } catch (err) {
      // preserve ApiError or rethrow generic errors
      if (err instanceof ApiError) throw err;
      throw err;
    }
  },

  async createTracker(payload: { imei: string; name: string; vehicleType?: string; assignedUserId?: string | null }) {
    const t: Tracker = { id: genId('t-'), imei: payload.imei, name: payload.name, vehicleType: payload.vehicleType, assignedUserId: payload.assignedUserId ?? null, status: 'offline', enabled: true, lastUpdate: new Date().toISOString() };
    trackers.unshift(t);
    pushLog('system', 'create_tracker', t.id);
    return t;
  },

  async updateTracker(id: string, data: Partial<Tracker>) {
    const idx = trackers.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Not found');
    trackers[idx] = { ...trackers[idx], ...data };
    pushLog('system', 'update_tracker', id);
    return trackers[idx];
  },

  async toggleTrackerEnabled(id: string, enabled: boolean) {
    return this.updateTracker(id, { enabled, status: enabled ? 'offline' : 'disabled' });
  },

  async assignTracker(id: string, userId: string | null) {
    return this.updateTracker(id, { assignedUserId: userId });
  },

  async listUsers() {
    return users.map((u) => ({ ...u }));
  },

  // Alerts
  async listAlerts(opts?: { q?: string; severity?: string; from?: string; to?: string }) {
    // very small filtering
    let res = alerts.slice();
    if (opts?.severity) res = res.filter((r) => r.severity === opts.severity);
    return res;
  },

  // Subscriptions
  async listSubscriptions() {
    return subscriptions.map((s) => ({ ...s }));
  },

  async updateSubscription(id: string, data: Partial<{ plan: string; expiresAt: string }>) {
    const idx = subscriptions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Not found');
    subscriptions[idx] = { ...subscriptions[idx], ...data } as any;
    pushLog('system', 'update_subscription', id);
    return subscriptions[idx];
  },

  // Geofences
  async listGeofences() {
    return geofences.map((g) => ({ ...g }));
  },
  async createGeofence(payload: Partial<Geofence>) {
    const g = { id: genId('g-'), name: payload.name || 'New Geofence', shape: payload.shape || 'circle', meta: payload.meta } as Geofence;
    geofences.unshift(g);
    pushLog('system', 'create_geofence', g.id);
    return g;
  },
  async updateGeofence(id: string, payload: Partial<Geofence>) {
    const idx = geofences.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Not found');
    geofences[idx] = { ...geofences[idx], ...payload };
    pushLog('system', 'update_geofence', id);
    return geofences[idx];
  },
  async deleteGeofence(id: string) {
    const idx = geofences.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Not found');
    geofences.splice(idx, 1);
    pushLog('system', 'delete_geofence', id);
    return true;
  },

  // Logs
  async listLogs() {
    return logs.slice();
  },
};

// Settings stored outside adminApi to avoid self-referential typing in this mock
type SettingsType = { traccarUrl: string; websocketUrl: string; notifications: { email: boolean; sms: boolean } };
let _mockSettings: SettingsType = { traccarUrl: 'http://localhost:8082', websocketUrl: 'ws://localhost:8082', notifications: { email: true, sms: false } };

export async function getAdminSettings() {
  return { ..._mockSettings } as SettingsType;
}

export async function updateAdminSettings(data: Partial<SettingsType>) {
  _mockSettings = { ..._mockSettings, ...data } as SettingsType;
  pushLog('system', 'update_settings');
  return _mockSettings;
}
export default adminApi;
