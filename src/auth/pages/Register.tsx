import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Radio, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Activity, Shield, Zap, Check, X } from 'lucide-react';
import { useAuth } from '../auth.context';
import { isValidEmail, isAcceptablePassword, normalizeFullName } from '@/utils/validators';
import { adaptBackendError } from '@/utils/errorAdapter';
import { ApiError } from '@/api/http';
// import Turnstile from '@/components/security/Turnstile';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backendErrors, setBackendErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  // TEMP: Disable CAPTCHA for testing
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'fullName'|'email'|'phone'|'password'|'confirmPassword'|'role'|'acceptTerms', string>>>({});
  const [role, setRole] = useState<'owner' | 'fleet_manager'>('owner');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Check password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  // Derive a friendly, specific error message from backend response
  const getFriendlyErrorMessage = (err: ApiError, details: Array<{ field?: string; message?: string }> = []) => {
    const lower = (s?: string) => (s || '').toLowerCase();
    // Email already exists: often 409 or a detail mentioning existence
    const emailDetail = details.find(d => (d.field === 'email') && /(existe|already|taken|existant|duplicate|dupli)/i.test(d.message || ''));
    if (err.status === 409 || emailDetail) {
      return "Cet email existe déjà. Veuillez utiliser une autre adresse.";
    }
    // Validation errors: surface first detail message if available
    if (Array.isArray(details) && details.length > 0) {
      const first = details[0];
      if (first?.message) return first.message;
    }
    // Specific common cases by message pattern
    const msg = lower(err.message);
    if (/password/.test(msg) && /(weak|format|invalid|complexity)/.test(msg)) {
      return 'Le mot de passe ne répond pas aux exigences de sécurité.';
    }
    if (/phone|téléphone/.test(msg) && /(invalid|format)/.test(msg)) {
      return 'Le numéro de téléphone est invalide.';
    }
    if (/role/.test(msg) && /(invalid|allowed)/.test(msg)) {
      return 'Le rôle sélectionné n’est pas autorisé.';
    }
    // Default fallback avoiding generic "Bad Request"
    return err.message && err.message !== 'Bad Request'
      ? err.message
      : 'Une erreur est survenue. Veuillez vérifier les champs et réessayer.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBackendErrors([]);
    setFieldErrors({});

    // Validation
    const normalizedName = normalizeFullName(formData.fullName);
    // Basic email validation using input type; avoid brittle regex here
    if (!isValidEmail(formData.email)) {
      setError('Email invalide');
      return;
    }
    // Full name length 3–50
    const nameLen = normalizedName.trim().length;
    if (nameLen < 3 || nameLen > 50) {
      setFieldErrors(prev => ({ ...prev, fullName: 'Le nom complet doit contenir entre 3 et 50 caractères.' }));
      setError('Nom complet invalide');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setFieldErrors(prev => ({ ...prev, acceptTerms: 'Vous devez accepter les conditions générales' }));
      setError('Vous devez accepter les conditions générales');
      return;
    }

    if (!isAcceptablePassword(formData.password)) {
      setFieldErrors(prev => ({ ...prev, password: 'Le mot de passe doit contenir des lettres, des chiffres et un caractère spécial, et au moins 8 caractères.' }));
      setError('Le mot de passe est trop faible');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, normalizedName, {
        phone: formData.phone || undefined,
        role,
        confirmPassword: formData.confirmPassword,
        acceptTerms,
  // captchaToken: captchaToken ?? undefined, // TEMP: disabled
      });
      setSuccess('Inscription réussie. Bienvenue sur AfriSense !');
      // Navigation handled by AuthContext
    } catch (err) {
      if (err instanceof ApiError) {
        const adapted = adaptBackendError(err.data);
        // Field-level errors
        setFieldErrors(adapted.fields);
        setRequestId(adapted.requestId);
        // Rendering strategy: for EMAIL_ALREADY_EXISTS show only under the email field
        if (!err.status) {
          setBackendErrors([]);
          setError("Impossible de contacter le serveur. Vérifiez l'URL de l'API et que le backend est démarré.");
        } else if (adapted.code === 'EMAIL_ALREADY_EXISTS') {
          setBackendErrors([]);
          setError(''); // prefer inline email field error only
        } else if (adapted.code === 'VALIDATION_ERROR') {
          setBackendErrors(Object.entries(adapted.fields).map(([field, message]) => ({ field, message: String(message) })));
          setError(adapted.message || 'Erreur de validation');
        } else {
          setBackendErrors(Object.entries(adapted.fields).map(([field, message]) => ({ field, message: String(message) })));
          setError(adapted.message || err.message || 'Une erreur est survenue.');
        }
      } else {
        setError(err instanceof Error ? err.message : "Erreur d'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Auto-focus the first field with an error
  useEffect(() => {
    const order: Array<keyof typeof fieldErrors> = ['fullName','email','phone','password','confirmPassword','role','acceptTerms'];
    const first = order.find((k) => fieldErrors[k]);
    if (!first) return;
    const idMap: Record<string, string> = {
      fullName: 'fullName',
      email: 'email',
      phone: 'phone',
      password: 'password',
      confirmPassword: 'confirmPassword',
      role: 'role-owner',
      acceptTerms: 'acceptTerms'
    };
    const elId = idMap[first as string];
    if (elId) {
      const el = document.getElementById(elId) as (HTMLInputElement | HTMLButtonElement | null);
      el?.focus();
    }
  }, [fieldErrors]);

  // OAuth handlers - À connecter avec votre backend plus tard
  const handleGoogleRegister = () => {
    console.log('Google OAuth Register - À implémenter avec le backend');
  };

  const handleMicrosoftRegister = () => {
    console.log('Microsoft OAuth Register - À implémenter avec le backend');
  };

  const handleAppleRegister = () => {
    console.log('Apple OAuth Register - À implémenter avec le backend');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Faible';
    if (passwordStrength === 2) return 'Moyen';
    if (passwordStrength === 3) return 'Bon';
    return 'Excellent';
  };

  return (
    <div className="min-h-screen flex font-['Inter']">
      {/* Left Side - Register Form */}
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Créez votre compte</h2>
            <p className="text-sm md:text-base text-gray-600">Commencez à suivre vos véhicules en temps réel</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fadeInUp" aria-live="assertive">
                <p className="text-sm text-red-600 font-medium">{error}</p>
                {backendErrors.length > 0 && (
                  <div className="mt-2 text-xs text-red-700 space-y-1">
                    {backendErrors.map((e, idx) => (
                      <span key={idx}>{e.field}: {e.message}</span>
                    ))}
                  </div>
                )}
                {/* Optional support info: requestId */}
                {requestId && (
                  <div className="mt-2 text-[11px] text-gray-500">ID requête: {requestId}</div>
                )}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-fadeInUp" aria-live="polite">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium ${fieldErrors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00BFA6]'}`}
                  placeholder="Jean Dupont"
                  required
                />
                {fieldErrors.fullName && <p className="mt-2 text-xs text-red-600">{fieldErrors.fullName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  // Prefer native validation, avoid brittle regex
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium ${fieldErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00BFA6]'}`}
                  placeholder="jean@example.com"
                  required
                />
                {fieldErrors.email && <p className="mt-2 text-xs text-red-600">{fieldErrors.email}</p>}
              </div>
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  pattern="^[0-9]{8,15}$"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium ${fieldErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00BFA6]'}`}
                  placeholder="0612345678"
                />
                {fieldErrors.phone && <p className="mt-2 text-xs text-red-600">{fieldErrors.phone}</p>}
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
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium ${fieldErrors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00BFA6]'}`}
                  placeholder="••••••••"
                  required
                />
              {fieldErrors.password && (
                <p className="mt-2 text-xs text-red-600">{fieldErrors.password}</p>
              )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength >= 3 ? 'text-green-600' : 
                    passwordStrength === 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/10 transition-all font-medium ${fieldErrors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00BFA6]'}`}
                  placeholder="••••••••"
                  required
                />
              {fieldErrors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <p className="text-xs font-medium text-green-600">Les mots de passe correspondent</p>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600" />
                      <p className="text-xs font-medium text-red-600">Les mots de passe ne correspondent pas</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Rôle (remplace Type de compte) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rôle
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  id="role-owner"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    role === 'owner'
                      ? 'bg-[#00BFA6] border-[#00BFA6] text-white shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Propriétaire</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('fleet_manager')}
                  id="role-fleet_manager"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    role === 'fleet_manager'
                      ? 'bg-[#00BFA6] border-[#00BFA6] text-white shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Gestionnaire de flotte</span>
                </button>
              </div>
              {fieldErrors.role && <p className="mt-2 text-xs text-red-600">{fieldErrors.role}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]/20 transition-all cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
                J'accepte les{' '}
                <a href="#" className="text-[#00BFA6] font-semibold hover:underline">
                  Conditions Générales d'Utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-[#00BFA6] font-semibold hover:underline">
                  Politique de Confidentialité
                </a>
              </label>
              {fieldErrors.acceptTerms && <p className="text-xs text-red-600 ml-2">{fieldErrors.acceptTerms}</p>}
            </div>

            {/* CAPTCHA (TEMP: disabled) */}
            {/* <div className="pt-2">
              <Turnstile onVerify={(t) => setCaptchaToken(t)} onExpire={() => setCaptchaToken(null)} onError={() => setCaptchaToken(null)} />
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] text-white font-bold py-3.5 md:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <User className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
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
                onClick={handleGoogleRegister}
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
                onClick={handleMicrosoftRegister}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                <span className="hidden sm:inline">Microsoft</span>
              </button>
              <button
                type="button"
                onClick={handleAppleRegister}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-900 border-2 border-black rounded-xl text-white font-semibold text-sm transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-[#00BFA6] hover:text-[#00a892] transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-[#3B6EA5] via-[#4a7db5] to-[#2c5d8f] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00BFA6] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00d4b8] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#4a7db5] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 py-16 text-white">
          <h2 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight">
            Rejoignez la révolution du suivi GPS
          </h2>
          <p className="text-lg xl:text-xl text-white/90 mb-12 leading-relaxed max-w-xl">
            Créez votre compte et découvrez pourquoi plus de 5000 utilisateurs nous font confiance pour sécuriser leurs véhicules.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Suivi en Temps Réel</h3>
              <p className="text-sm text-white/80">Localisez vos véhicules instantanément avec une précision GPS avancée</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Alertes Intelligentes</h3>
              <p className="text-sm text-white/80">Recevez des notifications instantanées pour chaque événement important</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sécurité Maximale</h3>
              <p className="text-sm text-white/80">Vos données sont cryptées et protégées avec les meilleurs standards</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Démarrage Rapide</h3>
              <p className="text-sm text-white/80">Configurez votre premier tracker en moins de 5 minutes</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl xl:text-4xl font-extrabold mb-1">5000+</div>
                <div className="text-sm text-white/80">Véhicules suivis</div>
              </div>
              <div>
                <div className="text-3xl xl:text-4xl font-extrabold mb-1">99.9%</div>
                <div className="text-sm text-white/80">Disponibilité</div>
              </div>
              <div>
                <div className="text-3xl xl:text-4xl font-extrabold mb-1">24/7</div>
                <div className="text-sm text-white/80">Support client</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
