import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { authApi } from '@/api';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  // loadingProfile intentionally omitted — we show inline state via buttons/messages
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const p = await authApi.getProfile();
        if (!mounted) return;
        setProfile({ fullName: p.fullName || '', email: p.email || '' });
      } catch (err) {
        // Log as an error for diagnostics (no development-only debug output)
        console.error('Could not load profile', err);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      if (profile.fullName || profile.email) {
        const updated = await authApi.updateProfile({ fullName: profile.fullName, email: profile.email });
        setProfile({ fullName: updated.fullName, email: updated.email });
      }
  // TODO: persist client settings to storage/backend as required
      setSaveMessage('Enregistré');
    } catch (err) {
      console.error('Save failed', err);
      setSaveMessage("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-sm text-gray-600">Mettez à jour votre profil et préférences.</p>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Profil</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nom complet</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Notifications (local)</h2>
        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">Notifications par email</div>
            <div className="text-sm text-gray-500">Recevoir les alertes par e-mail</div>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
          />
        </label>
      </section>

      <div className="flex justify-end items-center gap-4">
        {saveMessage && <div className="text-sm text-green-600">{saveMessage}</div>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          <Save size={16} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
