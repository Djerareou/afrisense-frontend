// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  TIMEOUT: 10000,
} as const;

// Dev-only: log resolved environment and API config for quick verification
if (import.meta.env.DEV) {
  console.log('[Env] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('[Env] VITE_WS_URL:', import.meta.env.VITE_WS_URL);
  console.log('[API_CONFIG]', API_CONFIG);
}

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  // OAuth
  AUTH_OAUTH_GOOGLE: '/auth/google',
  AUTH_OAUTH_MICROSOFT: '/auth/microsoft',
  AUTH_OAUTH_APPLE: '/auth/apple',
  
  // Devices
  DEVICES: '/devices',
  DEVICE_BY_ID: (id: string) => `/devices/${id}`,
  
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
} as const;
