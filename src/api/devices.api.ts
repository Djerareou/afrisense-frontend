import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface Device {
  id: string;
  imei: string;
  model: string;
  simNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface CreateDeviceRequest {
  imei: string;
  model: string;
  simNumber: string;
}

export interface CreateDeviceResponse {
  id: string;
  imei: string;
  model: string;
  simNumber: string;
  status: 'active' | 'inactive' | 'suspended';
}

// ==================== API Functions ====================

export const devicesApi = {
  /**
   * Get all devices for the authenticated user
   * Requires: Authorization header
   */
  getAll: async (): Promise<Device[]> => {
    return httpClient.get<Device[]>(API_ENDPOINTS.DEVICES);
  },

  /**
   * Create a new device/tracker
   * Requires: Authorization header
   */
  create: async (data: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
    return httpClient.post<CreateDeviceResponse>(API_ENDPOINTS.DEVICES, data);
  },

  /**
   * Get a specific device by ID
   * Requires: Authorization header
   */
  getById: async (id: string): Promise<Device> => {
    return httpClient.get<Device>(API_ENDPOINTS.DEVICE_BY_ID(id));
  },
};
