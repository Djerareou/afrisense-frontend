import { API_CONFIG } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const configHeaders = {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    };
    const config: RequestInit = {
      ...options,
      headers: configHeaders,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Handle empty response
      if (response.status === 204) {
        return {} as T;
      }

      // Attempt to parse JSON body (both success and error shapes)
      let body: any = null;
      try {
        body = await response.json();
      } catch (e) {
        body = null;
      }

      // Envelope handling: { success, data?, error?, requestId? }
      if (body && typeof body === 'object' && 'success' in body) {
        const success = !!body.success;
        if (success) {
          // Prefer nested data if present
          return (('data' in body ? body.data : body) as T);
        }
        // success === false -> normalize and throw
        const errObj = body.error || {};
        const message = errObj.message || 'Request failed';
        // Keep structured info on the error
        const data = {
          error: errObj,
          requestId: body.requestId,
        };
        throw new ApiError(message, response.status, data);
      }

      // Non-envelope responses
      if (!response.ok) {
        // Prefer explicit message field when present; avoid string guessing
        const message = body?.message || response.statusText || `HTTP Error: ${response.status}`;
        throw new ApiError(message, response.status, body);
      }

      // OK + non-envelope -> return parsed body as-is
      return body as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout');
        }
        throw new ApiError(error.message);
      }
      throw new ApiError('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, extraHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: extraHeaders,
    });
  }

  async put<T>(endpoint: string, data?: any, extraHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: extraHeaders,
    });
  }

  async patch<T>(endpoint: string, data?: any, extraHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: extraHeaders,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
