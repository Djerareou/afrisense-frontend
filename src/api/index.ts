// Export all API modules
export * from './config';
export * from './http';
export * from './auth.api';
export * from './devices.api';
export * from './positions.api';
export * from './alerts.api';
export * from './payments.api';
export * from './geofences.api';
export * from './websocket';

// Convenience exports for common use cases
export { authApi } from './auth.api';
export { devicesApi } from './devices.api';
export { positionsApi } from './positions.api';
export { alertsApi } from './alerts.api';
export { paymentsApi } from './payments.api';
export { geofencesApi } from './geofences.api';
export { liveWebSocket } from './websocket';
