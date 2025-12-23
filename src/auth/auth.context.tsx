import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
// import { authApi } from '../api'; // Will be used later when backend is ready

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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // Mock API call - Simulating backend response
      // TODO: Replace with real API when backend is ready
      // const response = await authApi.login({ email, password });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user data
      const mockUser: User = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        role: 'user',
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Store token and user data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', mockToken);
      storage.setItem('user_data', JSON.stringify(mockUser));

      setUser(mockUser);
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

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock API call - Simulating backend response
      // TODO: Replace with real API when backend is ready
      // await authApi.register({ fullName: name, email, password });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // After successful registration, redirect to login page
      // User needs to authenticate before accessing the main page
      navigate('/login');
    } catch (error) {
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
