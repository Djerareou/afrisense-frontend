import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../auth.context';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, rememberMe);
      const from = (location.state as any)?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto rounded-xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-[#0ea5a4] to-[#06b6d4] text-white gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">AfriSense Admin</h3>
              <p className="text-sm opacity-90">Gestion des utilisateurs, appareils et alertes</p>
            </div>
          </div>

          <div className="ml-1 max-w-xs">
            <h4 className="text-lg font-semibold">Tableau de bord sécurisé</h4>
            <p className="text-sm opacity-90">Accédez aux outils d'administration: surveillance en temps réel, gestion des geofences et rapports.</p>
          </div>

          <div className="mt-6 text-sm opacity-90">
            <p>Besoin d'aide ? Contactez <span className="font-semibold">support@afrisense.example</span></p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-white p-8 lg:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion administrateur</h2>
            <p className="text-sm text-gray-600 mb-6">Entrez vos identifiants pour accéder à l'espace d'administration.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
              )}

              <label className="block text-sm text-gray-700">Email</label>
              <div className="relative">
                <input
                  aria-label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                  placeholder="admin@example.com"
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                </span>
              </div>

              <label className="block text-sm text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  aria-label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pr-10 pl-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4" />
                  Se souvenir de moi
                </label>
                <Link to="/password-reset" className="text-sm text-[#00BFA6] font-semibold">Mot de passe oublié ?</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-60"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
              </button>

              <p className="text-center text-sm text-gray-500">Vous n'êtes pas administrateur ? <Link to="/login" className="text-[#00BFA6] font-semibold">Connexion utilisateur</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
