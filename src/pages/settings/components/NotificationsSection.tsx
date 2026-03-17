type SettingsState = {
  emailNotifications: boolean;
  smsNotifications: boolean;
};

export default function NotificationsSection({
  settings,
  setSettings,
}: {
  settings: SettingsState;
  setSettings: (s: SettingsState) => void;
}) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4">Notifications</h2>
      <div className="space-y-4">
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

        <label className="flex items-center justify-between">
          <div>
            <div className="font-medium">Notifications SMS</div>
            <div className="text-sm text-gray-500">Recevoir les alertes critiques par SMS</div>
          </div>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
          />
        </label>
      </div>
    </section>
  );
}

