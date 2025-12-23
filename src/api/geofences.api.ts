import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface GeofenceCoordinates {
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

export interface Geofence {
  id: string;
  trackerId: string;
  name: string;
  type: 'circle'; // MVP only supports circle
  coordinates: GeofenceCoordinates;
}

export interface CreateGeofenceRequest {
  trackerId: string;
  name: string;
  type: 'circle';
  coordinates: GeofenceCoordinates;
}

export interface CreateGeofenceResponse {
  id: string;
  trackerId: string;
  name: string;
  type: 'circle';
  coordinates: GeofenceCoordinates;
}

export interface GeofenceEvent {
  trackerId: string;
  geofenceId: string;
  eventType: 'enter' | 'exit';
  timestamp: string;
}

// ==================== API Functions ====================

export const geofencesApi = {
  /**
   * Get all geofences for a specific tracker
   * Requires: Authorization header
   * 
   * @param trackerId - The UUID of the tracker
   */
  getByTracker: async (trackerId: string): Promise<Geofence[]> => {
    return httpClient.get<Geofence[]>(
      API_ENDPOINTS.GEOFENCES_BY_TRACKER(trackerId)
    );
  },

  /**
   * Create a new geofence
   * Requires: Authorization header
   * 
   * @param data - Geofence configuration
   */
  create: async (data: CreateGeofenceRequest): Promise<CreateGeofenceResponse> => {
    return httpClient.post<CreateGeofenceResponse>(
      API_ENDPOINTS.GEOFENCES,
      data
    );
  },
};
