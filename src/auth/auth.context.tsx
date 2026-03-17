import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { ApiError } from '@/api/http';
import { liveWebSocket } from '@/api/websocket';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth classique
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
    opts?: { captchaToken?: string }
  ) => Promise<void>;

  logout: () => void;

  register: (
    email: string,
    password: string,
    name: string,
    options?: {
      confirmPassword?: string;
      phone?: string;
      role?: 'owner' | 'fleet_manager';
      acceptTerms?: boolean;
      captchaToken?: string;
    }
  ) => Promise<void>;

  // ✅ AJOUT OBLIGATOIRE POUR OAUTH
  setUserFromToken: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const rememberMe = localStorage.getItem('remember_me') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;

  const token = storage.getItem('auth_token');
  const userData = storage.getItem('user_data');

  if (token && userData) {
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      storage.removeItem('auth_token');
      storage.removeItem('user_data');
      localStorage.removeItem('remember_me');
    }
  }

  setIsLoading(false);
}, []);

const login = async (
  email: string,
  password: string,
  rememberMe = false,
  opts?: { captchaToken?: string }
) => {
  setIsLoading(true);
  try {
    // Pass captchaToken to API if provided (required for public endpoints)
    const loginRes = await authApi.login({ email, password }, { captchaToken: opts?.captchaToken });

    const storage = rememberMe ? localStorage : sessionStorage;
    const token = loginRes.token;

    storage.setItem('auth_token', token);
      // Ensure real-time connection is established once a token exists.
      // This avoids the "No auth token found. Cannot connect to Socket.io." message
      // when the LiveWebSocket singleton attempts to connect on import.
      try {
        liveWebSocket.ensureConnected();
      } catch (e) {
        // Non-fatal: surface to console for debugging but don't block login flow
        console.warn('[Auth] liveWebSocket.ensureConnected() failed', e);
      }
    localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');

    const profile = await authApi.getProfile();

    const user = {
      id: profile.id,
      email: profile.email,
      name: profile.fullName ?? profile.email.split('@')[0],
      role: profile.role,
    };

  storage.setItem('user_data', JSON.stringify(user));
  setUser(user);
  // Do not navigate here: leave redirect decision to the login caller so it can
  // respect chooser mode (stored in sessionStorage) or original `from` location.
  } catch (error) {
     console.error('Login error:', error);
     // If the error is an ApiError from the HTTP layer, surface its message
     // so the UI can show a more specific reason (for example invalid creds,
     // account locked, captcha required, etc.). Fall back to a generic message.
     // Development fallback: allow a local admin shortcut when running in dev.
     // Use explicit credentials: email=admin@local password=admin
     // This avoids interfering with production and is useful for local UI work.
     try {
       // Vite exposes import.meta.env.DEV
       const isDev = typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.DEV);
       if (isDev && (email === 'admin@local' && password === 'admin')) {
         const storage = rememberMe ? localStorage : sessionStorage;
         storage.setItem('auth_token', 'dev-admin-token');
         localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
         const devUser = { id: 'dev-admin', email, name: 'Local Admin', role: 'admin' };
         storage.setItem('user_data', JSON.stringify(devUser));
         setUser(devUser);
         // best-effort connect websocket
         try { liveWebSocket.ensureConnected(); } catch (e) {}
         return;
       }
     } catch (devErr) {
       // ignore dev fallback errors and continue to throw original
     }

     if (error instanceof ApiError) {
       const message = error.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
       throw new Error(message);
     }
     throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    // Disconnect realtime socket if connected
    try {
      liveWebSocket.disconnect();
    } catch (e) {
      // best-effort cleanup
    }
    // Clear storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    
    setUser(null);
    navigate('/login');
  };
const setUserFromToken = async () => {
  const profile = await authApi.getProfile();

  const userData = {
    id: profile.id,
    email: profile.email,
    name: profile.fullName ?? profile.email.split('@')[0],
    role: profile.role,
  };

  const storage =
    localStorage.getItem('auth_token')
      ? localStorage
      : sessionStorage;

  storage.setItem('user_data', JSON.stringify(userData));
  setUser(userData);
};

  const register = async (
    email: string,
    password: string,
    name: string,
    options?: { confirmPassword?: string; phone?: string; role?: 'owner' | 'fleet_manager'; acceptTerms?: boolean; captchaToken?: string }
  ) => {
    setIsLoading(true);
    try {
      await authApi.register({
        fullName: name,
        email,
        password,
        phone: options?.phone,
        role: options?.role ?? 'owner',
        confirmPassword: options?.confirmPassword,
        acceptTerms: options?.acceptTerms ?? false,
      }, { captchaToken: options?.captchaToken });

      navigate('/login');
    } catch (error) {
      // Preserve ApiError (with details) so UI can display field-level errors
      if (error instanceof ApiError) {
        console.error('Registration error:', { status: error.status, data: error.data, message: error.message });
        throw error;
      }
      console.error('Registration error:', error);
      throw new Error("Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    setUserFromToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
