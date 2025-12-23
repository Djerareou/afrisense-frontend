import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface Alert {
  type: 'battery_low' | 'speed_limit' | 'geofence_enter' | 'geofence_exit' | 'sos' | 'offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  message?: string;
}

// ==================== API Functions ====================

export const alertsApi = {
  /**
   * Get all alerts for a specific tracker
   * Requires: Authorization header
   * 
   * @param trackerId - The UUID of the tracker
   */
  getByTracker: async (trackerId: string): Promise<Alert[]> => {
    return httpClient.get<Alert[]>(API_ENDPOINTS.ALERTS(trackerId));
  },
};
