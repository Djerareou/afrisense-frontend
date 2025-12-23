import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Loading state while checking authentication
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6]"></div>
          <p className="mt-4 text-gray-600 font-['Inter']">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
