import { useState } from 'react';
import { Link } from 'react-router-dom';
import Turnstile from '@/components/security/Turnstile';
import { authApi } from '@/api/auth.api';

/**
 * Password Reset Request page
 * - Simple flow: user provides email, completes CAPTCHA, frontend sends
 *   token + email to backend endpoint which will send a reset email.
 * - The backend must verify the Turnstile token server-side before sending
 *   any password reset email.
 */
export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    if (!captchaToken) {
      setError('Veuillez compléter le CAPTCHA pour continuer.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.passwordResetRequest({ email }, { captchaToken });
      setMessage('Si un compte existe avec cet e-mail, vous recevrez un message contenant les instructions.');
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Inspect raw env value for diagnostics in DEV. Prefer passing the explicit string
  // property when an env object shape is accidentally provided.
  const rawTurnstileEnv = (import.meta.env as any).VITE_TURNSTILE_SITE_KEY;
  if (import.meta.env.DEV) {
    try {
      const preview = typeof rawTurnstileEnv === 'object' ? JSON.stringify(rawTurnstileEnv).slice(0, 200) : String(rawTurnstileEnv);
      // eslint-disable-next-line no-console
      console.debug('[PasswordResetRequest] raw VITE_TURNSTILE_SITE_KEY type:', typeof rawTurnstileEnv, 'preview:', preview);
    } catch (e) {
      // ignore
    }
  }

  const turnstileSiteKey = typeof rawTurnstileEnv === 'object'
    ? rawTurnstileEnv?.sitekey || rawTurnstileEnv?.siteKey || rawTurnstileEnv?.VITE_TURNSTILE_SITE_KEY || undefined
    : rawTurnstileEnv;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h2>
        <p className="text-sm text-gray-600 mb-4">Entrez votre adresse e-mail et complétez le CAPTCHA pour recevoir les instructions.</p>

        {message && <div className="mb-4 text-green-700">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg" placeholder="votre@email.com" />
          </div>

          <div>
            <Turnstile
              siteKey={turnstileSiteKey}
              onVerify={(t) => setCaptchaToken(t)}
              onExpire={() => setCaptchaToken(null)}
              onError={(err) => {
                console.error('[Turnstile] error on reset page', err);
                setCaptchaToken(null);
                setError('Le CAPTCHA a échoué — veuillez réessayer.');
              }}
            />
            <p className="text-xs text-gray-500 mt-2">Le CAPTCHA aide à protéger contre les abus automatisés.</p>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#00BFA6] text-white py-2 rounded-lg font-semibold">
            {isLoading ? 'Envoi en cours…' : 'Envoyer les instructions'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <Link to="/login" className="text-[#00BFA6] font-semibold">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}
