import { httpClient, ApiError } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface RegisterRequest {
  fullName?: string;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  role?: string; // default 'owner'
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: LoginUser;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

// Note: Backend returns direct objects (no envelope)

// ==================== API Functions ====================

export const authApi = {
  /** Register a new user */
  register: async (data: RegisterRequest, opts?: { captchaToken?: string }): Promise<UserProfile> => {
    // Send only expected fields for the backend to avoid validation errors
    const payload = {
      fullName: data.fullName ?? data.name ?? '',
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role ?? 'owner',
      confirmPassword: data.confirmPassword,
      acceptTerms: data.acceptTerms,
    };
    try {
  const res = await httpClient.post<any>(API_ENDPOINTS.AUTH_REGISTER, payload, opts?.captchaToken ? { 'X-Turnstile-Token': opts.captchaToken } : undefined);
      // Normalize: support both envelope { success, data } and direct payloads
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: UserProfile }).data;
      }
      return res as UserProfile;
    } catch (err) {
      // Log detailed error information to aid debugging
      if (err instanceof ApiError) {
        console.error('[authApi.register] failed', {
          payload,
          status: err.status,
          data: err.data,
          message: err.message,
        });
        throw err; // Preserve ApiError with meaningful message
      }
      console.error('[authApi.register] unexpected error', err);
      throw err;
    }
},

/** Login with email and password */
login: async (data: LoginRequest): Promise<LoginResult> => {
  try {
    const res = await httpClient.post<any>(API_ENDPOINTS.AUTH_LOGIN, data);
    // Normalize: support both envelope { success, data } and direct payloads
    if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
      return (res as { success: boolean; data: LoginResult }).data;
    }
    return res as LoginResult;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error('[authApi.login] failed', {
        data,
        status: err.status,
        dataResp: err.data,
        message: err.message,
      });
      throw err;
    }
    console.error('[authApi.login] unexpected error', err);
    throw err;
  }
},


  /** Get current user profile */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const res = await httpClient.get<any>(API_ENDPOINTS.AUTH_ME);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: UserProfile }).data;
      }
      return res as UserProfile;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.getProfile] failed', {
          status: err.status,
          data: err.data,
          message: err.message,
        });
        throw err;
      }
      console.error('[authApi.getProfile] unexpected error', err);
      throw err;
    }
  },
};
