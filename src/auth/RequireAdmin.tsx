import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.context';

interface RequireAdminProps {
  children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Simple role check — adjust logic if you have a permissions matrix
  if (!user || user.role !== 'admin') {
    // Redirect to the admin login page, preserving the requested location so the
    // admin login flow can send the user back after successful authentication.
    const loc = useLocation();
    return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  }

  return <>{children}</>;
}
