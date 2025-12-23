import { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Lock, 
  Moon, 
  Mail, 
  Smartphone,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertSounds: true,
    
    // Language & Display
    language: 'fr',
    timezone: 'Africa/Douala',
    darkMode: false,
    
    // Privacy & Security
    twoFactorAuth: false,
    shareLocation: true,
    dataRetention: '90',
    
    // Alerts Configuration
    batteryLowThreshold: 20,
    speedLimitDefault: 90,
    offlineAlertDelay: 30,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // TODO: Save to backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">
          Personnalisez votre expérience AfriSense
        </p>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Gérez comment vous recevez les alertes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Notifications SMS</p>
                <p className="text-sm text-gray-500">Recevoir les alertes critiques par SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Notifications push</p>
                <p className="text-sm text-gray-500">Recevoir les notifications sur l'appareil</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Sons d'alerte</p>
              <p className="text-sm text-gray-500">Activer les sons pour les alertes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alertSounds}
                onChange={(e) => setSettings({ ...settings, alertSounds: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Language & Display Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Globe className="text-purple-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Langue et affichage</h2>
            <p className="text-sm text-gray-600">Personnalisez l'interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Africa/Douala">Afrique/Douala (GMT+1)</option>
              <option value="Africa/Yaounde">Afrique/Yaoundé (GMT+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Mode sombre</p>
                <p className="text-sm text-gray-500">Activer le thème sombre</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Lock className="text-red-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Confidentialité et sécurité</h2>
            <p className="text-sm text-gray-600">Protégez vos données</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-500">Sécurité renforcée pour votre compte</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rétention des données (jours)
            </label>
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="180">180 jours</option>
              <option value="365">1 an</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="text-yellow-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Configuration des alertes</h2>
            <p className="text-sm text-gray-600">Définissez les seuils d'alerte</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seuil batterie faible (%)
            </label>
            <input
              type="number"
              value={settings.batteryLowThreshold}
              onChange={(e) => setSettings({ ...settings, batteryLowThreshold: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="10"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite de vitesse par défaut (km/h)
            </label>
            <input
              type="number"
              value={settings.speedLimitDefault}
              onChange={(e) => setSettings({ ...settings, speedLimitDefault: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="30"
              max="150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai alerte hors ligne (minutes)
            </label>
            <input
              type="number"
              value={settings.offlineAlertDelay}
              onChange={(e) => setSettings({ ...settings, offlineAlertDelay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="5"
              max="120"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          <Save size={20} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
