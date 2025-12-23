import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

// ==================== API Functions ====================

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return httpClient.post<RegisterResponse>(API_ENDPOINTS.AUTH_REGISTER, data);
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, data);
  },

  /**
   * Get current user profile
   * Requires: Authorization header
   */
  getProfile: async (): Promise<UserProfile> => {
    return httpClient.get<UserProfile>(API_ENDPOINTS.AUTH_PROFILE);
  },
};
