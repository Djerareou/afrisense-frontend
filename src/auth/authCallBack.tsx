import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/auth.context';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth(); // on va l’ajouter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const remember = params.get('remember') === 'true';

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);

    // hydrate user via /me
    setUserFromToken()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        storage.removeItem('auth_token');
        navigate('/login', { replace: true });
      });
  }, [navigate, setUserFromToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 font-medium">
        Connexion en cours…
      </p>
    </div>
  );
}
