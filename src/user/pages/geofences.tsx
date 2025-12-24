import { useState } from 'react';
import { MapPin, Plus, Circle, Edit, Trash2, Zap, Bell, TrendingUp, Calendar, Shield, ChevronDown, ChevronUp, Wifi, CheckCircle, PauseCircle, Target } from 'lucide-react';
import { MapContainer, TileLayer, Circle as LeafletCircle, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Geofence {
  id: string;
  name: string;
  tracker: string;
  type: 'circle';
  center: { lat: number; lng: number };
  radius: number;
  status: 'active' | 'inactive';
  color: string;
  alertOnEntry: boolean;
  alertOnExit: boolean;
  devicesInside: number;
  lastEvent: string;
  createdAt: string;
}

export default function GeofencesPage() {
  const [expandedGeofence, setExpandedGeofence] = useState<string | null>(null);
  
  // Mock data
  const [geofences] = useState<Geofence[]>([
    {
      id: '1',
      name: 'Bureau N\'Djamena',
      tracker: 'Toyota Camry',
      type: 'circle',
      center: { lat: 12.1348, lng: 15.0557 },
      radius: 2000,
      status: 'active',
      color: '#00BFA6',
      alertOnEntry: true,
      alertOnExit: false,
      devicesInside: 2,
      lastEvent: 'Entrée il y a 2h',
      createdAt: '15 Déc 2024',
    },
    {
      id: '2',
      name: 'Zone Résidentielle',
      tracker: 'Honda Civic',
      type: 'circle',
      center: { lat: 12.1089, lng: 15.0444 },
      radius: 1500,
      status: 'active',
      color: '#3B6EA5',
      alertOnEntry: true,
      alertOnExit: true,
      devicesInside: 1,
      lastEvent: 'Sortie il y a 5h',
      createdAt: '10 Déc 2024',
    },
    {
      id: '3',
      name: 'Entrepôt Farcha',
      tracker: 'Mercedes Sprinter',
      type: 'circle',
      center: { lat: 12.1567, lng: 15.0789 },
      radius: 3000,
      status: 'active',
      color: '#FF6B6B',
      alertOnEntry: true,
      alertOnExit: true,
      devicesInside: 0,
      lastEvent: 'Sortie il y a 1j',
      createdAt: '05 Déc 2024',
    },
    {
      id: '4',
      name: 'Zone Aéroport',
      tracker: 'Ford Transit',
      type: 'circle',
      center: { lat: 12.1337, lng: 15.0340 },
      radius: 5000,
      status: 'inactive',
      color: '#FFC107',
      alertOnEntry: false,
      alertOnExit: false,
      devicesInside: 0,
      lastEvent: 'Aucun événement',
      createdAt: '01 Déc 2024',
    },
  ]);

  const activeGeofences = geofences.filter(g => g.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with breadcrumb */}
        <div className="mb-8 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 animate-fadeInUp">
            <span className="hover:text-[#00BFA6] transition-colors cursor-pointer">Tableau de bord</span>
            <span>›</span>
            <span className="text-[#00BFA6] font-semibold">Géo-clôtures</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="relative z-10">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00BFA6] via-[#3B6EA5] to-[#00BFA6] bg-clip-text text-transparent">
                Géofencing
              </h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Créez des zones virtuelles intelligentes et recevez des alertes en temps réel
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-xl hover:border-[#00BFA6] hover:text-[#00BFA6] transition-all duration-300 font-semibold hover:scale-105 group">
                <MapPin size={20} className="group-hover:animate-bounce" />
                Voir la carte
              </button>
              <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold shadow-lg shadow-[#00BFA6]/30">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Nouvelle zone
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Zones */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Zones</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{geofences.length}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp size={14} />
                  <span className="font-semibold">+2 cette semaine</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Active Zones */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Zones Actives</p>
                <p className="text-4xl font-extrabold text-green-600 mt-2">{activeGeofences}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">En surveillance</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <Circle className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Événements 24h</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] bg-clip-text text-transparent mt-2">12</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-orange-600">
                  <Bell size={14} />
                  <span className="font-semibold">3 alertes actives</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00BFA6]/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map with Geofences */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden group">
          <div className="p-4 bg-gradient-to-r from-[#00BFA6]/5 to-[#3B6EA5]/5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin size={20} className="text-[#00BFA6]" />
                Carte interactive des géofences
              </h3>
              <p className="text-xs text-gray-500 mt-1">Visualisation en temps réel • {geofences.length} zone(s) affichée(s)</p>
            </div>
            <button className="px-4 py-2 bg-white border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg hover:bg-[#00BFA6] hover:text-white transition-all duration-300 text-sm font-semibold">
              Plein écran
            </button>
          </div>
          <div className="h-[500px] relative">
            <MapContainer
              center={[12.1348, 15.0557]}
              zoom={6}
              className="h-full w-full"
              style={{ zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Render all geofences as circles */}
              {geofences.map((geofence) => (
                <LeafletCircle
                  key={geofence.id}
                  center={[geofence.center.lat, geofence.center.lng]}
                  radius={geofence.radius}
                  pathOptions={{
                    color: geofence.color,
                    fillColor: geofence.color,
                    fillOpacity: 0.2,
                    weight: 3,
                    opacity: geofence.status === 'active' ? 0.8 : 0.4,
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: geofence.color }}
                        ></div>
                        <h4 className="font-bold text-gray-900">{geofence.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Tracker:</span> {geofence.tracker}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Rayon:</span> {geofence.radius}m
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Appareils:</span> {geofence.devicesInside}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                          geofence.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {geofence.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </Popup>
                </LeafletCircle>
              ))}

              {/* Render markers at center of each geofence */}
              {geofences.map((geofence) => (
                <Marker
                  key={`marker-${geofence.id}`}
                  position={[geofence.center.lat, geofence.center.lng]}
                >
                  <Popup>
                    <div className="p-1">
                      <h4 className="font-bold text-sm">{geofence.name}</h4>
                      <p className="text-xs text-gray-600">{geofence.tracker}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher une zone par nom ou tracker..."
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#00BFA6] focus:outline-none transition-all duration-300 focus:shadow-lg"
              />
              <MapPin size={20} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00BFA6] transition-colors" />
            </div>
            <div className="relative">
              <select className="pl-11 pr-8 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#00BFA6] focus:outline-none transition-all duration-300 bg-white cursor-pointer hover:border-gray-300 font-medium appearance-none">
                <option value="all">Toutes les zones</option>
                <option value="active">Actives uniquement</option>
                <option value="inactive">Inactives uniquement</option>
              </select>
              <Target size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="pl-11 pr-8 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#00BFA6] focus:outline-none transition-all duration-300 bg-white cursor-pointer hover:border-gray-300 font-medium appearance-none">
                <option value="all">Tous les types</option>
                <option value="circle">Cercles</option>
                <option value="polygon">Polygones</option>
              </select>
              <Circle size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Enhanced Geofences List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#00BFA6]/5 to-[#3B6EA5]/5 p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Liste des zones</h2>
              <p className="text-sm text-gray-600 mt-1">{geofences.length} zone(s) configurée(s) • {activeGeofences} active(s)</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 hover:bg-white rounded-lg transition-colors border-2 border-transparent hover:border-[#00BFA6] group" title="Vue liste">
                <svg className="w-5 h-5 text-[#00BFA6]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 5h14a1 1 0 110 2H3a1 1 0 110-2z"/>
                </svg>
              </button>
              <button className="p-2.5 hover:bg-white rounded-lg transition-colors border-2 border-transparent hover:border-gray-300 group" title="Vue grille">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3h6v6H3V3zm0 8h6v6H3v-6zm8-8h6v6h-6V3zm0 8h6v6h-6v-6z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {geofences.map((geofence, index) => (
              <div 
                key={geofence.id} 
                className="transition-all duration-300"
                style={{animationDelay: `${index * 50}ms`}}
              >
                {/* Main Geofence Row */}
                <div 
                  className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-300 group cursor-pointer"
                  onClick={() => setExpandedGeofence(expandedGeofence === geofence.id ? null : geofence.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Enhanced Color Indicator */}
                      <div className="relative">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 shadow-lg group-hover:scale-125 transition-transform duration-300"
                          style={{ backgroundColor: geofence.color }}
                        ></div>
                        {geofence.status === 'active' && (
                          <div
                            className="absolute inset-0 w-5 h-5 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: geofence.color }}
                          ></div>
                        )}
                      </div>

                      {/* Geofence Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#00BFA6] transition-colors">
                            {geofence.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                              geofence.status === 'active'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {geofence.status === 'active' ? '● Active' : 'Inactive'}
                          </span>
                          {geofence.devicesInside > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 animate-pulse">
                              {geofence.devicesInside} appareil{geofence.devicesInside > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin size={14} className="text-[#00BFA6]" />
                            {geofence.tracker}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                            <Circle size={14} className="text-purple-500" />
                            Rayon: {geofence.radius}m
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {geofence.center.lat.toFixed(4)}, {geofence.center.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2.5 hover:bg-blue-50 rounded-lg transition-all duration-200 text-blue-600 hover:scale-110"
                          title="Modifier"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-600 hover:scale-110"
                          title="Supprimer"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="w-px h-8 bg-gray-200 mx-2"></div>
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                          {expandedGeofence === geofence.id ? (
                            <ChevronUp size={20} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedGeofence === geofence.id && (
                  <div className="px-6 pb-6 bg-gray-50/50 animate-slideDown">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      {/* Shape Info */}
                      <div className="bg-white p-4 rounded-xl border-2 border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield size={18} className="text-purple-600" />
                          <h4 className="font-bold text-gray-800">Forme</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Type: <span className="font-semibold">{geofence.type === 'circle' ? 'Cercle' : 'Polygone'}</span></p>
                        <p className="text-sm text-gray-600 mb-1">Rayon: <span className="font-semibold">{geofence.radius}m</span></p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Couleur:</span>
                          <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: geofence.color }}></div>
                        </div>
                      </div>

                      {/* Devices Info */}
                      <div className="bg-white p-4 rounded-xl border-2 border-blue-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <Wifi size={18} className="text-blue-600" />
                          <h4 className="font-bold text-gray-800">Appareils</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Dans la zone: <span className="font-semibold">{geofence.devicesInside}</span></p>
                        <p className="text-sm text-gray-600 mb-1">Tracker: <span className="font-semibold">{geofence.tracker}</span></p>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${geofence.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {geofence.status === 'active' ? 'Connecté' : 'Déconnecté'}
                          </span>
                        </div>
                      </div>

                      {/* Alerts Info */}
                      <div className="bg-white p-4 rounded-xl border-2 border-orange-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <Bell size={18} className="text-orange-600" />
                          <h4 className="font-bold text-gray-800">Alertes</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Entrée: <span className={`font-semibold ${geofence.alertOnEntry ? 'text-green-600' : 'text-gray-400'}`}>
                            {geofence.alertOnEntry ? 'Activée' : 'Désactivée'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Sortie: <span className={`font-semibold ${geofence.alertOnExit ? 'text-green-600' : 'text-gray-400'}`}>
                            {geofence.alertOnExit ? 'Activée' : 'Désactivée'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{geofence.lastEvent}</p>
                      </div>

                      {/* History Info */}
                      <div className="bg-white p-4 rounded-xl border-2 border-teal-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar size={18} className="text-teal-600" />
                          <h4 className="font-bold text-gray-800">Historique</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Créé le: <span className="font-semibold">{geofence.createdAt}</span></p>
                        <p className="text-sm text-gray-600 mb-1">Dernier événement: <span className="font-semibold">{geofence.lastEvent}</span></p>
                        <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-semibold mt-2 inline-block">
                          Voir l'historique →
                        </a>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                        Voir sur la carte
                      </button>
                      <button className="flex-1 px-4 py-2.5 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg hover:bg-[#00BFA6] hover:text-white transition-all font-semibold">
                        Configurer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced How it Works with Blue Theme */}
        <div className="mt-8 relative rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Blue gradient background like register page */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6] via-[#3B6EA5] to-[#00d4b8]"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-extrabold text-white mb-3">Comment ça marche ?</h3>
              <p className="text-white/90 text-lg">Sécurisez vos actifs en 3 étapes simples</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:-translate-y-2 border border-white/20 hover:shadow-2xl">
                <div className="w-16 h-16 bg-white text-[#00BFA6] rounded-2xl flex items-center justify-center font-extrabold text-2xl mb-4 shadow-xl group-hover:scale-110 transition-transform">
                  1
                </div>
                <h4 className="font-bold text-xl text-white mb-3">Créez une zone</h4>
                <p className="text-white/90 leading-relaxed">
                  Définissez un périmètre virtuel en choisissant un point central et un rayon personnalisé
                </p>
                <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                  <Circle size={16} className="text-white/70" />
                  <span>Cercles ou polygones</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:-translate-y-2 border border-white/20 hover:shadow-2xl" style={{animationDelay: '100ms'}}>
                <div className="w-16 h-16 bg-white text-[#3B6EA5] rounded-2xl flex items-center justify-center font-extrabold text-2xl mb-4 shadow-xl group-hover:scale-110 transition-transform">
                  2
                </div>
                <h4 className="font-bold text-xl text-white mb-3">Associez un tracker</h4>
                <p className="text-white/90 leading-relaxed">
                  Liez la zone à un ou plusieurs trackers GPS pour surveiller leurs déplacements en temps réel
                </p>
                <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                  <MapPin size={16} className="text-white/70" />
                  <span>Suivi en temps réel</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:-translate-y-2 border border-white/20 hover:shadow-2xl" style={{animationDelay: '200ms'}}>
                <div className="w-16 h-16 bg-white text-[#00d4b8] rounded-2xl flex items-center justify-center font-extrabold text-2xl mb-4 shadow-xl group-hover:scale-110 transition-transform">
                  3
                </div>
                <h4 className="font-bold text-xl text-white mb-3">Recevez des alertes</h4>
                <p className="text-white/90 leading-relaxed">
                  Soyez notifié instantanément par SMS, email ou push lorsqu'un tracker entre ou sort de la zone
                </p>
                <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                  <Bell size={16} className="text-white/70" />
                  <span>Notifications instantanées</span>
                </div>
              </div>
            </div>

            {/* Additional Info Banner */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center gap-3 text-white">
                <Zap size={20} className="text-white/90" />
                <span className="font-semibold">Configuration simple et rapide</span>
                <span className="text-white/60">•</span>
                <span className="font-semibold">Alertes en temps réel</span>
                <span className="text-white/60">•</span>
                <span className="font-semibold">Historique complet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
