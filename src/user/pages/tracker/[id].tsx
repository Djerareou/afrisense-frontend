import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Battery, 
  Signal, 
  Clock, 
  Activity,
  Gauge
} from 'lucide-react';

export default function TrackerDetailsPage() {
  const { id } = useParams();
  
  // Mock data
  const [tracker] = useState({
    id: id || '1',
    name: 'Toyota Camry',
    imei: '864506064XXXXXX',
    model: 'GT06N',
    status: 'active',
    battery: 85,
    signal: 90,
    speed: 45,
    lastUpdate: new Date(),
    location: {
      lat: 4.0511,
      lng: 9.7679,
      address: 'Boulevard de la Liberté, Douala, Cameroun',
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/devices"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour aux trackers
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tracker.name}</h1>
            <p className="mt-2 text-gray-600">
              {tracker.model} - IMEI: {tracker.imei}
            </p>
          </div>
          
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
            {tracker.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Batterie</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tracker.battery}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Battery className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Signal</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tracker.signal}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Signal className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vitesse</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tracker.speed} km/h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gauge className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernière activité</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Il y a 2 min</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Map and Info Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Position en temps réel</h2>
          </div>
          
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Carte interactive</p>
              <p className="text-sm text-gray-500 mt-2">La carte sera intégrée prochainement</p>
              <div className="mt-4 text-left bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-900 mb-2">Position actuelle:</p>
                <p className="text-sm text-gray-600">{tracker.location.address}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {tracker.location.lat.toFixed(4)}, {tracker.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracker Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm">
                Centrer sur la carte
              </button>
              <button className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm">
                Voir l'historique
              </button>
              <button className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm">
                Créer une géofence
              </button>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Modèle</span>
                <span className="text-sm font-semibold text-gray-900">{tracker.model}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">IMEI</span>
                <span className="text-sm font-mono text-gray-900">{tracker.imei}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Statut</span>
                <span className="text-sm font-semibold text-green-600">En ligne</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Installation</span>
                <span className="text-sm text-gray-900">15 Déc 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="text-gray-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Activité récente</h2>
        </div>

        <div className="space-y-4">
          {[
            { time: 'Il y a 2 minutes', event: 'Position mise à jour', icon: <MapPin size={16} />, color: 'blue' },
            { time: 'Il y a 15 minutes', event: 'Entrée dans la zone "Bureau"', icon: <MapPin size={16} />, color: 'green' },
            { time: 'Il y a 1 heure', event: 'Vitesse: 120 km/h (limite dépassée)', icon: <Gauge size={16} />, color: 'red' },
            { time: 'Il y a 2 heures', event: 'Sortie de la zone "Domicile"', icon: <MapPin size={16} />, color: 'yellow' },
            { time: 'Il y a 3 heures', event: 'Niveau batterie: 85%', icon: <Battery size={16} />, color: 'green' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <div className={`text-${activity.color}-600`}>
                  {activity.icon}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir tout l'historique
        </button>
      </div>
    </div>
  );
}
