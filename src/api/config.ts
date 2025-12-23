// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  
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
  WS_LIVE: '/live',
} as const;
