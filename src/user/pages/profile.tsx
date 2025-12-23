import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save } from 'lucide-react';
import { useAuth } from '../../auth/auth.context';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    fullName: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+237 699 000 000',
    address: 'Douala, Cameroun',
    city: 'Douala',
    country: 'Cameroun',
    joinDate: '15 Décembre 2024',
    company: 'AfriSense Cameroun',
    bio: 'Gestionnaire de flotte automobile passionné par la technologie GPS et la sécurité des véhicules.',
  });

  const handleSave = () => {
    console.log('Profile updated:', profile);
    // TODO: Save to backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="mt-2 text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-[#00BFA6]">
              {profile.fullName.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Camera size={16} className="text-[#00BFA6]" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-1">{profile.fullName}</h2>
            <p className="text-white/80 mb-3">{profile.email}</p>
            <div className="flex items-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Membre depuis {profile.joinDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {profile.city}, {profile.country}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-white/80">Trackers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-white/80">Géofences</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">45</p>
              <p className="text-sm text-white/80">Alertes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Parlez-nous un peu de vous..."
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sécurité</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Modifier le mot de passe
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions du compte</h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Télécharger mes données
          </button>
          
          <button className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
            Supprimer le compte
          </button>
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
