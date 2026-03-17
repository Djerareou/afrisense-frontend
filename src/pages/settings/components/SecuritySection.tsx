import { useState, useCallback, useEffect } from 'react';
import { Lock, XCircle } from 'lucide-react';
import { authApi, ApiError } from '@/api';
import Modal from '@/components/Modal';

type Session = {
  id: string;
  device?: string;
  userAgent?: string;
  ip?: string;
  revoked?: boolean;
  createdAt?: string;
  lastSeenAt?: string;
};
type ExternalConn = { id: string; name: string; connected: boolean };

export default function SecuritySection() {
  const [captchaEnabled, setCaptchaEnabled] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // password validation state
  const [pwErrors, setPwErrors] = useState<string[]>([]);
  const [pwStrength, setPwStrength] = useState<number>(0); // 0..4

  const handleClose = useCallback(() => {
    if (!loading) setShowChangeModal(false);
  }, [loading]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [mySession, setMySession] = useState<Session | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState<string | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const loadSessions = async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    setRawResponse(null);
    try {
      // request raw responses for debugging
      const [meRaw, allRaw] = await Promise.all([authApi.getMySession(true), authApi.getSessions(true)]);
      // store pretty-printed raw response for UI inspection
      setRawResponse(JSON.stringify({ me: meRaw, sessions: allRaw }, null, 2));

      // normalize to our expected shapes
      const me = (meRaw && typeof meRaw === 'object' && 'success' in meRaw && 'data' in meRaw) ? meRaw.data : meRaw;
      const all = (allRaw && typeof allRaw === 'object' && 'success' in allRaw && 'data' in allRaw) ? allRaw.data : allRaw;

      setMySession(me || null);
      setSessions(Array.isArray(all) ? all : []);
    } catch (err: any) {
      console.error('[SecuritySection] load sessions failed', err);
      setSessionsError(err?.message || 'Impossible de charger les sessions');
      // If fetch failed before a response (e.g. network/CORS), show last composed request for debugging
      try {
        const last = (window as any).__lastHttpDebug;
        if (last) {
          setRawResponse(JSON.stringify({ error: err?.message, lastRequest: last }, null, 2));
        } else {
          setRawResponse(JSON.stringify({ error: err?.message }, null, 2));
        }
      } catch (e) {
        // ignore
      }
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) return;
      await loadSessions();
    })();
    return () => { mounted = false; };
  }, []);

  const external: ExternalConn[] = [
    { id: 'google', name: 'Google', connected: true },
    { id: 'microsoft', name: 'Microsoft', connected: false },
    { id: 'apple', name: 'Apple', connected: false },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Sécurité & authentification</h2>

      <div className="space-y-6">
        {/* Authentication */}
        <div>
          <h3 className="font-semibold mb-2">Authentification</h3>
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Changer votre mot de passe régulièrement améliore la sécurité de votre compte.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowChangeModal(true); setError(null); setSuccess(null); }} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 inline-flex items-center gap-2"><Lock size={14} /> Changer le mot de passe</button>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Toggle label="CAPTCHA" description="Activer la protection CAPTCHA sur formulaires publics" checked={captchaEnabled} onChange={setCaptchaEnabled} />
            <Toggle label="Remember me" description="Autoriser la session persistante" checked={rememberMe} onChange={setRememberMe} />
          </div>
        </div>

        {/* External Connections */}
        <div>
          <h3 className="font-semibold mb-2">Connexions externes</h3>
          <div className="space-y-2">
            {external.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-sm text-gray-500">{e.connected ? 'Connecté' : 'Non connecté'}</div>
                </div>
                <div className="flex items-center gap-2">
                  {e.connected ? (
                    <button className="text-sm text-red-600">Révoquer</button>
                  ) : (
                    <button className="px-3 py-1 border rounded">Connecter</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold mb-2">Sessions actives</h3>
            <div>
              <button onClick={loadSessions} disabled={sessionsLoading} className="px-3 py-1 border rounded text-sm">
                {sessionsLoading ? 'Chargement...' : 'Refresh sessions'}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {sessionsLoading && <div className="text-sm text-gray-500">Chargement des sessions...</div>}
            {sessionsError && <div className="text-sm text-red-600">{sessionsError}</div>}
            {!sessionsLoading && sessions.length === 0 && <div className="text-sm text-gray-500">Aucune session active trouvée.</div>}
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{s.device || s.userAgent || 'Appareil inconnu'}</div>
                  <div className="text-sm text-gray-500">{s.ip || '—'} • {s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleString() : (s.createdAt ? new Date(s.createdAt).toLocaleString() : '')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!confirm('Déconnecter cette session ?')) return;
                      setRevokeLoading(s.id);
                      try {
                        await authApi.revokeSession(s.id);
                        // If we revoked the current session, reload to reflect logout
                        if (mySession && mySession.id === s.id) {
                          window.location.reload();
                          return;
                        }
                        // otherwise refetch sessions
                        const all = await authApi.getSessions();
                        setSessions(Array.isArray(all) ? all : []);
                      } catch (err: any) {
                        console.error('Revoke failed', err);
                        alert(err?.message || 'Erreur lors de la révocation');
                      } finally {
                        setRevokeLoading(null);
                      }
                    }}
                    className="text-sm text-red-600"
                    disabled={revokeLoading !== null}
                  >
                    {revokeLoading === s.id ? 'En cours...' : 'Déconnecter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button
              onClick={async () => {
                if (!confirm('Déconnecter toutes les sessions (sauf la session actuelle) ?')) return;
                setRevokeLoading('all');
                try {
                  // revoke all sessions except current
                  const ids = sessions.map((s) => s.id).filter((id) => id && id !== mySession?.id);
                  await Promise.all(ids.map((id) => authApi.revokeSession(id)));
                  const all = await authApi.getSessions();
                  setSessions(Array.isArray(all) ? all : []);
                } catch (err: any) {
                  console.error('Revoke all failed', err);
                  alert(err?.message || 'Erreur lors de la révocation de toutes les sessions');
                } finally {
                  setRevokeLoading(null);
                }
              }}
              className="px-3 py-2 bg-red-600 text-white rounded"
              disabled={revokeLoading !== null}
            >
              {revokeLoading === 'all' ? 'En cours...' : 'Déconnecter tous'}
            </button>
          </div>
          {rawResponse && (
            <div className="mt-3">
              <div className="text-xs font-medium mb-1">Raw API response</div>
              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-48">{rawResponse}</pre>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div>
          <h3 className="font-semibold mb-2">Danger zone</h3>
          <div className="text-sm text-red-600 flex items-center gap-2">
            <XCircle />
            <button onClick={() => { if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) { /* TODO: delete account */ } }} className="underline">Supprimer le compte</button>
          </div>
        </div>
      </div>
      {showChangeModal && (
        <Modal
          isOpen={showChangeModal}
          onClose={handleClose}
          title="Changer le mot de passe"
          ariaLabel="Changer le mot de passe"
        >
          <p className="text-sm text-gray-600 mb-4">Entrez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé.</p>

          <div className="space-y-3">
            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  const v = e.target.value;
                  setNewPassword(v);
                  const { score, errors } = validatePassword(v);
                  setPwStrength(score);
                  setPwErrors(errors);
                }}
                className="w-full border rounded px-3 py-2"
              />

              <div className="mt-2">
                <PasswordStrengthBar score={pwStrength} />
                <ul className="mt-2 text-sm text-gray-600">
                  {pwErrors.map((err, i) => (
                    <li key={i} className="text-red-600">• {err}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

            <div className="mt-4 flex items-center justify-end gap-2">
            <button onClick={handleClose} className="px-3 py-2 border rounded">Annuler</button>
            <button
              onClick={async () => {
                setError(null);
                setSuccess(null);
                if (!currentPassword || !newPassword || !confirmPassword) { setError('Remplissez tous les champs.'); return; }
                if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
                // ensure new password is different from current password
                if (newPassword === currentPassword) { setError("Le nouveau mot de passe doit être différent de l'actuel."); return; }
                // enforce client-side password rules
                const { errors } = validatePassword(newPassword);
                if (errors.length > 0) { setError('Le nouveau mot de passe ne respecte pas les critères.'); setPwErrors(errors); return; }
                setLoading(true);
                try {
                  await authApi.changePassword({ currentPassword, newPassword });
                  setSuccess('Mot de passe changé avec succès.');
                  setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPwErrors([]); setPwStrength(0);
                  // auto-close after short delay
                  setTimeout(() => { setShowChangeModal(false); setSuccess(null); }, 1200);
                } catch (e: any) {
                    if (e instanceof ApiError) {
                      // Prefer server-provided error codes/messages
                      const serverError = e.data?.error || e.data || null;
                      const code = serverError?.code || serverError?.errorCode || null;
                      // const srvMsg = serverError?.message || e.message;
                      if (code === 'INVALID_PASSWORD' || e.status === 401) {
                        setError('Mot de passe actuel incorrect.');
                      } else if (code === 'PASSWORD_SAME_AS_OLD') {
                        setError("Le nouveau mot de passe doit être différent de l'actuel.");
                      } else if (code === 'VALIDATION_ERROR' || e.status === 400) {
                        // validation error: prefer structured message
                        const fieldMsg = serverError?.message || serverError?.errors || e.message;
                        setError(typeof fieldMsg === 'string' ? fieldMsg : JSON.stringify(fieldMsg));
                      } else {
                        const msg = serverError?.message || e.message || 'Une erreur est survenue.';
                        setError(msg);
                      }
                    } else {
                      setError(e?.message || 'Une erreur est survenue.');
                    }
                } finally {
                  setLoading(false);
                }
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || pwErrors.length > 0}
            >
              {loading ? 'En cours...' : 'Enregistrer'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between p-3 border rounded">
      <div>
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-10 h-6 appearance-none bg-gray-200 rounded-full relative cursor-pointer outline-none checked:bg-blue-600"
        />
      </div>
    </label>
  );
}

function validatePassword(pw: string): { score: number; errors: string[] } {
  const errors: string[] = [];
  let score = 0;
  if (pw.length >= 8) { score += 1; } else { errors.push('Au moins 8 caractères'); }
  if (/[A-Z]/.test(pw)) { score += 1; } else { errors.push('Inclure au moins une majuscule'); }
  if (/[0-9]/.test(pw)) { score += 1; } else { errors.push('Inclure au moins un chiffre'); }
  if (/[^A-Za-z0-9]/.test(pw)) { score += 1; } else { errors.push('Inclure au moins un caractère spécial'); }
  return { score, errors };
}

function PasswordStrengthBar({ score }: { score: number }) {
  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const colors = ['bg-red-400', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
  const pct = Math.min(4, Math.max(0, score));
  return (
    <div>
      <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
        <div className={`${colors[pct]} h-2`} style={{ width: `${(pct / 4) * 100}%` }} />
      </div>
      <div className="text-xs text-gray-500 mt-1">{labels[pct]}</div>
    </div>
  );
}
