import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface Position {
  trackerId: string;
  latitude: number;
  longitude: number;
  speed: number;
  eventType: string;
  timestamp: string;
}

export interface PositionHistoryParams {
  from?: string; // ISO date string
  to?: string;   // ISO date string
}

// ==================== API Functions ====================

export const positionsApi = {
  /**
   * Get position history for a specific tracker
   * Requires: Authorization header
   * 
   * @param trackerId - The UUID of the tracker
   * @param params - Optional date range filters
   */
  getHistory: async (
    trackerId: string,
    params?: PositionHistoryParams
  ): Promise<Position[]> => {
    return httpClient.get<Position[]>(
      API_ENDPOINTS.POSITIONS_HISTORY(trackerId),
      params
    );
  },
};
