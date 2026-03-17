// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  TIMEOUT: 10000,
} as const;

// NOTE: avoid emitting dev-only console logs here to keep the console clean.

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  // Backend exposes authenticated change-password at POST /api/auth/password/change
  // NOTE: `VITE_API_BASE_URL` may include the `/api` prefix (e.g. http://host:port/api).
  // To avoid double `/api/api/...` when composing the final URL, keep endpoints
  // relative to the base (no duplicated `/api` here).
  AUTH_CHANGE_PASSWORD: '/auth/password/change',
  AUTH_PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
  // OAuth
  AUTH_OAUTH_GOOGLE: '/auth/google',
  AUTH_OAUTH_MICROSOFT: '/auth/microsoft',
  AUTH_OAUTH_APPLE: '/auth/apple',
  // Roles
  AUTH_ROLES: '/auth/roles',
  
  // Devices
  DEVICES: '/devices',
  DEVICE_BY_ID: (id: string) => `/devices/${id}`,
  // Users (admin)
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  
  // Positions
  POSITIONS_HISTORY: (trackerId: string) => `/positions/${trackerId}/history`,
  
  // Alerts
  ALERTS: (trackerId: string) => `/alerts/${trackerId}`,
  
  // Payments
  PAYMENTS_INITIATE: '/payments/initiate',
  
  // Geofences
  GEOFENCES: '/geofences',
  GEOFENCES_BY_TRACKER: (trackerId: string) => `/geofences/${trackerId}`,
  
  // WebSocket
  // Socket.io default path is /socket.io; we connect via base URL using the client
  WS_LIVE: '/socket.io',
  // Sessions
  AUTH_SESSIONS: '/auth/sessions',
  AUTH_SESSIONS_ME: '/auth/sessions/me',
  AUTH_SESSION_BY_ID: (id: string) => `/auth/sessions/${id}`,
} as const;
