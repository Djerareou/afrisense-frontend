import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../auth.context';

export default function AdminLoginFixed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Decorative */}
        <div className="hidden lg:flex flex-col justify-center gap-6 p-12 bg-gradient-to-br from-[#0f1724] via-[#0d4b4a] to-[#007f73] text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">AfriSense Admin</h3>
              <p className="text-sm opacity-90">Accédez aux outils d'administration — surveillance, gestion et rapports.</p>
            </div>
          </div>

          <div className="mt-4 text-sm text-white/90 max-w-xs">
            <p className="mb-4">Interface sécurisée pour les administrateurs. Utilisez un compte avec les privilèges appropriés.</p>
            <ul className="text-sm space-y-2">
              <li>• Surveillance en temps réel</li>
              <li>• Gestion des utilisateurs et appareils</li>
              <li>• Configurations et rapports</li>
            </ul>
          </div>

          <div className="mt-auto text-xs text-white/70">Besoin d'aide ? <a className="underline" href="mailto:support@afrisense.example">support@afrisense.example</a></div>
        </div>

        {/* Right - Form */}
        <div className="p-8 lg:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] flex items-center justify-center shadow-md">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">AfriSense — Admin</h1>
                <p className="text-sm text-gray-500">Espace administrateur</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h2>
            <p className="text-sm text-gray-600 mb-6">Identifiez-vous pour accéder au tableau de bord d'administration</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/20"
                  placeholder="admin@example.com"
                />
              </label>

              <label className="block relative">
                <span className="text-sm font-semibold text-gray-700">Mot de passe</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/20 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                  aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </label>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                  Se souvenir de moi
                </label>
                <Link to="/password-reset" className="text-sm font-semibold text-[#00BFA6]">Mot de passe oublié ?</Link>
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

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">Vous n'êtes pas administrateur ? <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[#00BFA6]">Connexion utilisateur</button></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
