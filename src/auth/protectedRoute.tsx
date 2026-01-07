import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth.context';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ⏳ Attendre la rehydration
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement…
      </div>
    );
  }

  // ❌ Non authentifié → redirect login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ OK
  return children;
}
