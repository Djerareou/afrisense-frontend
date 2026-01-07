import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { ApiError } from '@/api/http';

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

const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    const loginRes = await authApi.login({ email, password });

    const storage = rememberMe ? localStorage : sessionStorage;
    const token = loginRes.token;

    storage.setItem('auth_token', token);
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

    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
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
