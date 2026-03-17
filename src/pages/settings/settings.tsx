import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/auth.context';
import NotificationsSection from './components/NotificationsSection';
import SaveBar from './components/SaveBar';
import { authApi } from '@/api';
import { ApiError } from '@/api/http';

export default function Settings() {
  const { user, isLoading } = useAuth();
  const [settings, setSettings] = useState({ emailNotifications: true, smsNotifications: false });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [timezone, setTimezone] = useState<string>('Europe/Paris');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // initialize settings from user if available
  useEffect(() => {
    if (user) {
      // attempt to read settings from user object if present
      // @ts-ignore
      const s = (user as any).settings;
      if (s) {
        setSettings({ emailNotifications: !!s.emailNotifications, smsNotifications: !!s.smsNotifications });
        if (s.theme) setTheme(s.theme);
        if (s.timezone) setTimezone(s.timezone);
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#00BFA6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const { setUserFromToken } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      // Persist notification/preferences
      await authApi.updateNotifications({ emailNotifications: settings.emailNotifications, smsNotifications: settings.smsNotifications, theme, timezone });

      // Optionally refresh user settings
      try {
        await setUserFromToken();
      } catch (e) {
        console.warn('Failed to refresh user after settings update', e);
      }

      setSaveMessage('Enregistré');
    } catch (err) {
      if (err instanceof ApiError && err.data) {
        const firstKey = Object.keys(err.data)[0];
        const firstMsg = err.data[firstKey];
        setSaveMessage(typeof firstMsg === 'string' ? firstMsg : JSON.stringify(firstMsg));
      } else {
        setSaveMessage("Erreur lors de l'enregistrement");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-['Inter']">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Paramètres du compte</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y">
        <section className="p-6">
          <h2 className="text-lg font-medium mb-2">Préférences générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Thème</span>
              <select className="mt-1 border px-3 py-2 rounded" value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Fuseau horaire</span>
              <select className="mt-1 border px-3 py-2 rounded" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </div>

          <div className="mt-4">
            <NotificationsSection settings={settings} setSettings={setSettings} />
          </div>
        </section>
      </div>

      <div className="mt-4">
        <div className="flex justify-end items-center">
          <SaveBar saving={saving} saveMessage={saveMessage} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
