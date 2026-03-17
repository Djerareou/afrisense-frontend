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
/**
 * Login with email and password, with optional CAPTCHA token for public endpoint security.
 * If opts.captchaToken is provided, sends it as X-Turnstile-Token header.
 */
login: async (data: LoginRequest, opts?: { captchaToken?: string }): Promise<LoginResult> => {
  try {
    const headers = opts?.captchaToken ? { 'X-Turnstile-Token': opts.captchaToken } : undefined;
    const res = await httpClient.post<any>(API_ENDPOINTS.AUTH_LOGIN, data, headers);

    // Support multiple response shapes. Common shapes:
    // - direct: { token, user }
    // - envelope: { success: true, data: { token, user } }
    // - alternative token keys: { accessToken } or { access_token } or { jwt }
    let payload: any = res;
    if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
      payload = res.data;
    }

    // Try to extract token from common fields
    const token = payload?.token || payload?.accessToken || payload?.access_token || payload?.jwt || (payload?.data && (payload.data.token || payload.data.accessToken));
    const user = payload?.user || payload?.userData || payload?.data?.user || payload?.data?.userData || payload?.user || undefined;

    if (!token) {
      // If backend didn't return a token, surface a clearer error
      throw new ApiError('Login response missing token', undefined, { raw: res });
    }

    return { token, user } as LoginResult;
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
  /** Get canonical roles for frontend pickers */
  getRoles: async (): Promise<string[]> => {
    try {
      const res = await httpClient.get<any>(API_ENDPOINTS.AUTH_ROLES);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return res.data as string[];
      }
      return res as string[];
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.getRoles] failed', { status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.getRoles] unexpected error', err);
      throw err;
    }
  },
  /** Update current user's profile (fullName, email, ... ) */
  updateProfile: async (data: { fullName?: string; email?: string; language?: string }): Promise<UserProfile> => {
    try {
      const res = await httpClient.patch<any>(API_ENDPOINTS.AUTH_ME, data);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: UserProfile }).data;
      }
      return res as UserProfile;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.updateProfile] failed', { payload: data, status: err.status, respData: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.updateProfile] unexpected error', err);
      throw err;
    }
  },
  /** Upload avatar image for current user. Accepts a File and sends multipart/form-data */
  uploadAvatar: async (file: File): Promise<UserProfile> => {
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await httpClient.patch<any>(API_ENDPOINTS.AUTH_ME, fd);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: UserProfile }).data;
      }
      return res as UserProfile;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.uploadAvatar] failed', { status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.uploadAvatar] unexpected error', err);
      throw err;
    }
  },
  /** Update notification and preference settings for current user */
  updateNotifications: async (data: { emailNotifications?: boolean; smsNotifications?: boolean; theme?: string; timezone?: string; language?: string }): Promise<any> => {
    try {
      // send as partial payload under `settings` key to avoid colliding with profile fields
      const payload = { settings: data };
      const res = await httpClient.patch<any>(API_ENDPOINTS.AUTH_ME, payload);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: any }).data;
      }
      return res as any;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.updateNotifications] failed', { payload: data, status: err.status, respData: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.updateNotifications] unexpected error', err);
      throw err;
    }
  },
  /**
   * Request a password reset email for a given address.
   * The backend should verify the provided captchaToken server-side before
   * creating/sending any password reset email to prevent abuse.
   */
  passwordResetRequest: async (data: { email: string }, opts?: { captchaToken?: string }): Promise<void> => {
    try {
      const headers = opts?.captchaToken ? { 'X-Turnstile-Token': opts.captchaToken } : undefined;
      await httpClient.post(API_ENDPOINTS.AUTH_PASSWORD_RESET_REQUEST, data, headers);
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.passwordResetRequest] failed', { data, status: err.status, dataResp: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.passwordResetRequest] unexpected error', err);
      throw err;
    }
  },
  /** Change current user's password
   * Expects { currentPassword, newPassword } and returns 204 or updated profile.
   */
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword?: string }): Promise<any> => {
    try {
      // Backend expects { currentPassword, newPassword, confirmPassword }
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword ?? data.newPassword,
      };
      const res = await httpClient.post<any>(API_ENDPOINTS.AUTH_CHANGE_PASSWORD, payload);
      // backend returns envelope { success: true, message }
      if (res && typeof res === 'object' && 'success' in res && res.success) {
        return res;
      }
      return res;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.changePassword] failed', { payload: data, status: err.status, respData: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.changePassword] unexpected error', err);
      throw err;
    }
  },
  /** Get current session info for this access token */
  getMySession: async (): Promise<any> => {
    try {
      const res = await httpClient.get<any>(API_ENDPOINTS.AUTH_SESSIONS_ME);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: any }).data;
      }
      return res;
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.getMySession] failed', { status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.getMySession] unexpected error', err);
      throw err;
    }
  },
  /** List all sessions for current user */
  getSessions: async (): Promise<any> => {
    try {
      const res = await httpClient.get<any>(API_ENDPOINTS.AUTH_SESSIONS);
      if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
        return (res as { success: boolean; data: any[] }).data;
      }
      return res as any[];
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.getSessions] failed', { status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.getSessions] unexpected error', err);
      throw err;
    }
  },
  /** Revoke a session by id */
  revokeSession: async (id: string): Promise<void> => {
    try {
      await httpClient.delete(API_ENDPOINTS.AUTH_SESSION_BY_ID(id));
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[authApi.revokeSession] failed', { id, status: err.status, data: err.data, message: err.message });
        throw err;
      }
      console.error('[authApi.revokeSession] unexpected error', err);
      throw err;
    }
  },
};
