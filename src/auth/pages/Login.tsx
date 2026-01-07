import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, Activity, Shield, Zap } from 'lucide-react';
// import Turnstile from '@/components/security/Turnstile';
import { API_CONFIG, API_ENDPOINTS } from '@/api/config';
import { useAuth } from '../auth.context';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // TEMP: Disable CAPTCHA for testing
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
  await login(formData.email, formData.password, rememberMe);
      // Navigation handled by AuthContext
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth handlers - À connecter avec votre backend plus tard
const handleGoogleLogin = () => {
window.location.href = `${API_CONFIG.BASE_URL}/api/auth/google/authorize`;
};



  const handleMicrosoftLogin = () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_OAUTH_MICROSOFT}`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_OAUTH_APPLE}`;
  };

  return (
    <div className="min-h-screen flex font-['Inter']">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00BFA6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#3B6EA5]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo & Brand */}
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <Radio className="relative w-6 h-6 md:w-7 md:h-7 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">AfriSense</h1>
                <p className="text-xs md:text-sm text-gray-500 font-semibold">GPS Tracking System</p>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Bienvenue !</h2>
            <p className="text-sm md:text-base text-gray-600">Connectez-vous pour accéder à votre espace de suivi GPS</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fadeInUp">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email ou Identifiant
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#00BFA6] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 md:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#00BFA6] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]/20 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <a href="#" className="text-sm font-semibold text-[#00BFA6] hover:text-[#00a892] transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* CAPTCHA (TEMP: disabled) */}
            {/* <div className="pt-2">
              <Turnstile onVerify={(t) => setCaptchaToken(t)} onExpire={() => setCaptchaToken(null)} onError={() => setCaptchaToken(null)} />
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 md:py-4 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold">OU</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                <span className="hidden sm:inline">Microsoft</span>
              </button>
              <button
                type="button"
                onClick={handleAppleLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-900 border-2 border-black rounded-xl text-white font-semibold text-sm transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="font-bold text-[#00BFA6] hover:text-[#00a892] transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#1a2332]">
        {/* Professional 3D GPS tracking background */}
        <img
          src="/images/tracking-hero.jpg"
          alt="Suivi GPS en temps réel - vue aérienne"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none blur-sm"
          onError={(e) => {
            // Fallback to SVG if JPG not available
            e.currentTarget.src = '/images/tracking-hero.svg';
          }}
        />

        {/* Overlay gradient for better text readability and brand consistency */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2e]/70 via-[#1a2842]/50 to-[#00BFA6]/20"></div>
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 py-12 text-white w-full">
          {/* Hero Text */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold mb-4 leading-tight">
              Suivi GPS en<br />temps réel
            </h2>
            <p className="text-lg xl:text-xl text-white/80 font-medium leading-relaxed max-w-xl">
              Gérez votre flotte, sécurisez vos véhicules et optimisez vos performances avec notre solution professionnelle.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 xl:gap-6 max-w-2xl">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Localisation précise</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Suivez vos véhicules avec une précision GPS de quelques mètres
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Temps réel</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Données actualisées en direct pour une réactivité maximale
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sécurité renforcée</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Alertes instantanées et géorepérage pour protéger vos biens
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Performance</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Analyses détaillées et rapports pour optimiser votre flotte
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center">
              <div className="text-3xl xl:text-4xl font-extrabold mb-1">5000+</div>
              <div className="text-sm text-white/70 font-medium">Véhicules suivis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl xl:text-4xl font-extrabold mb-1">99.9%</div>
              <div className="text-sm text-white/70 font-medium">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl xl:text-4xl font-extrabold mb-1">24/7</div>
              <div className="text-sm text-white/70 font-medium">Support client</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
