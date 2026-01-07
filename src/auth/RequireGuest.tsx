import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth.context';

export function RequireGuest() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 🔁 Déjà connecté → home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
