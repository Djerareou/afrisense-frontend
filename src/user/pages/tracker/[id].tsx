import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Battery, 
  Signal, 
  Clock, 
  Activity,
  Gauge,
  Navigation,
  Zap,
  TrendingUp,
  Calendar,
  Settings,
  Edit,
  Trash2,
  Download,
  Play,
  MapPinned,
  Route,
  BarChart3,
  Bell,
  Shield
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Trip {
  id: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  maxSpeed: number;
  avgSpeed: number;
  stops: number;
}

interface ActivityEvent {
  id: string;
  time: string;
  type: 'position' | 'geofence_entry' | 'geofence_exit' | 'speed' | 'battery' | 'engine_on' | 'engine_off';
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export default function TrackerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'stats' | 'alerts'>('live');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  // Mock tracker data - USER'S vehicle (will be replaced with API: GET /api/user/devices/:id)
  const [tracker] = useState({
    id: id || '1',
    name: 'Toyota Camry',
    licensePlate: 'DLA-1234-AB',
    vehicleType: 'car',
    imei: '864506064501234',
    model: 'GT06N',
    status: 'active' as 'active' | 'inactive' | 'offline',
    battery: 85,
    signal: 90,
    speed: 45,
    engineOn: true,
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    location: {
      lat: 12.1348,
      lng: 15.0557,
      address: 'Avenue Charles de Gaulle, N\'Djamena',
    },
    installDate: '15 Déc 2024',
    distanceToday: 127.5,
    distanceWeek: 543.2,
    distanceMonth: 2145.8,
  });

  // Mock trip history
  const [trips] = useState<Trip[]>([
    {
      id: '1',
      startTime: '08:30',
      endTime: '09:15',
      startLocation: 'Quartier Résidentiel',
      endLocation: 'Bureau Centre-ville',
      distance: 12.5,
      duration: 45,
      maxSpeed: 80,
      avgSpeed: 42,
      stops: 2,
    },
    {
      id: '2',
      startTime: '13:00',
      endTime: '13:20',
      startLocation: 'Bureau Centre-ville',
      endLocation: 'Restaurant Farcha',
      distance: 5.8,
      duration: 20,
      maxSpeed: 60,
      avgSpeed: 35,
      stops: 1,
    },
    {
      id: '3',
      startTime: '14:30',
      endTime: '14:50',
      startLocation: 'Restaurant Farcha',
      endLocation: 'Bureau Centre-ville',
      distance: 6.2,
      duration: 20,
      maxSpeed: 65,
      avgSpeed: 38,
      stops: 0,
    },
  ]);

  // Mock activity events
  const [activities] = useState<ActivityEvent[]>([
    {
      id: '1',
      time: 'Il y a 2 minutes',
      type: 'position',
      message: 'Position mise à jour',
      severity: 'info',
    },
    {
      id: '2',
      time: 'Il y a 15 minutes',
      type: 'geofence_entry',
      message: 'Entrée dans la zone "Bureau"',
      severity: 'success',
    },
    {
      id: '3',
      time: 'Il y a 1 heure',
      type: 'speed',
      message: 'Vitesse: 120 km/h (limite dépassée)',
      severity: 'error',
    },
    {
      id: '4',
      time: 'Il y a 2 heures',
      type: 'geofence_exit',
      message: 'Sortie de la zone "Domicile"',
      severity: 'warning',
    },
    {
      id: '5',
      time: 'Il y a 3 heures',
      type: 'battery',
      message: 'Niveau batterie: 85%',
      severity: 'success',
    },
    {
      id: '6',
      time: 'Il y a 4 heures',
      type: 'engine_on',
      message: 'Moteur démarré',
      severity: 'info',
    },
  ]);

  // Mock route path for display
  const routePath: [number, number][] = [
    [12.1348, 15.0557],
    [12.1365, 15.0543],
    [12.1382, 15.0529],
    [12.1399, 15.0515],
    [12.1416, 15.0501],
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'position': return MapPin;
      case 'geofence_entry':
      case 'geofence_exit': return MapPinned;
      case 'speed': return Gauge;
      case 'battery': return Battery;
      case 'engine_on':
      case 'engine_off': return Zap;
      default: return Activity;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En ligne';
      case 'inactive': return 'Inactif';
      case 'offline': return 'Hors ligne';
      default: return status;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${tracker.name} ?`)) {
      // In production: DELETE /api/user/devices/:id
      navigate('/devices');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span 
              onClick={() => navigate('/')} 
              className="hover:text-[#00BFA6] transition-colors cursor-pointer"
            >
              Tableau de bord
            </span>
            <span>›</span>
            <span 
              onClick={() => navigate('/devices')} 
              className="hover:text-[#00BFA6] transition-colors cursor-pointer"
            >
              Mes véhicules
            </span>
            <span>›</span>
            <span className="text-[#00BFA6] font-semibold">{tracker.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00BFA6] via-[#3B6EA5] to-[#00BFA6] bg-clip-text text-transparent">
                  {tracker.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(tracker.status)}`}>
                  {tracker.status === 'active' && <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>}
                  {getStatusLabel(tracker.status)}
                </span>
              </div>
              <p className="text-gray-600 flex items-center gap-4 flex-wrap">
                <span className="font-semibold">{tracker.licensePlate}</span>
                <span className="text-gray-400">•</span>
                <span>{tracker.model}</span>
                <span className="text-gray-400">•</span>
                <span className="font-mono text-sm">{tracker.imei}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/devices`)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                <Edit size={18} />
                <span className="hidden sm:inline">Modifier</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {/* Battery */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${tracker.battery > 20 ? 'bg-green-100' : 'bg-red-100'} rounded-xl flex items-center justify-center`}>
                <Battery className={tracker.battery > 20 ? 'text-green-600' : 'text-red-600'} size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Batterie</p>
            <p className="text-3xl font-extrabold text-gray-900">{tracker.battery}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${tracker.battery > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${tracker.battery}%` }}
              />
            </div>
          </div>

          {/* Signal */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Signal className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Signal</p>
            <p className="text-3xl font-extrabold text-gray-900">{tracker.signal}%</p>
            <p className="text-xs text-gray-500 mt-1">Excellente connexion</p>
          </div>

          {/* Speed */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gauge className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Vitesse</p>
            <p className="text-3xl font-extrabold text-gray-900">{tracker.speed}</p>
            <p className="text-xs text-gray-500 mt-1">km/h</p>
          </div>

          {/* Engine Status */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${tracker.engineOn ? 'bg-green-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                <Zap className={tracker.engineOn ? 'text-green-600' : 'text-gray-400'} size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Moteur</p>
            <p className={`text-xl font-extrabold ${tracker.engineOn ? 'text-green-600' : 'text-gray-400'}`}>
              {tracker.engineOn ? 'ON' : 'OFF'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{tracker.engineOn ? 'En marche' : 'Arrêté'}</p>
          </div>

          {/* Last Update */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Dernière MAJ</p>
            <p className="text-lg font-extrabold text-gray-900">Il y a 2min</p>
            <p className="text-xs text-gray-500 mt-1">{tracker.lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          {/* Distance Today */}
          <div className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Navigation className="text-orange-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Aujourd'hui</p>
            <p className="text-2xl font-extrabold text-gray-900">{tracker.distanceToday}</p>
            <p className="text-xs text-gray-500 mt-1">km parcourus</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-200 px-2 sm:px-6">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
              {[
                { id: 'live', label: 'Position en direct', shortLabel: 'Position', icon: MapPin },
                { id: 'history', label: 'Historique des trajets', shortLabel: 'Historique', icon: Route },
                { id: 'stats', label: 'Statistiques', shortLabel: 'Stats', icon: BarChart3 },
                { id: 'alerts', label: 'Alertes', shortLabel: 'Alertes', icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'border-[#00BFA6] text-[#00BFA6]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Live Tab */}
            {activeTab === 'live' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Map */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                      <div className="h-[500px]">
                        <MapContainer
                          center={[tracker.location.lat, tracker.location.lng]}
                          zoom={14}
                          style={{ height: '100%', width: '100%' }}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          
                          {/* Route path */}
                          <Polyline
                            positions={routePath}
                            pathOptions={{
                              color: '#00BFA6',
                              weight: 4,
                              opacity: 0.7,
                            }}
                          />
                          
                          {/* Current position marker */}
                          <Marker position={[tracker.location.lat, tracker.location.lng]}>
                            <Popup>
                              <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">{tracker.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{tracker.location.address}</p>
                                <p className="text-xs text-gray-500">
                                  Vitesse: {tracker.speed} km/h
                                </p>
                                <p className="text-xs text-gray-500">
                                  Batterie: {tracker.battery}%
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    {/* Current Location */}
                    <div className="bg-gradient-to-br from-[#00BFA6]/10 to-[#3B6EA5]/10 rounded-xl p-6 border-2 border-[#00BFA6]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-[#00BFA6]" size={20} />
                        <h3 className="font-bold text-gray-900">Position actuelle</h3>
                      </div>
                      <p className="text-gray-900 font-semibold mb-2">{tracker.location.address}</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {tracker.location.lat.toFixed(6)}, {tracker.location.lng.toFixed(6)}
                      </p>
                      <button className="mt-4 w-full py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00a896] transition-colors font-medium text-sm">
                        Partager la position
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-gray-600" />
                        Actions rapides
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center gap-2">
                          <Play size={16} />
                          Revoir le trajet
                        </button>
                        <button 
                          onClick={() => navigate('/geofences')}
                          className="w-full py-2.5 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          <Shield size={16} />
                          Gérer les géofences
                        </button>
                        <button className="w-full py-2.5 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm flex items-center gap-2">
                          <Download size={16} />
                          Exporter les données
                        </button>
                      </div>
                    </div>

                    {/* Device Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Modèle</span>
                          <span className="text-sm font-semibold text-gray-900">{tracker.model}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">IMEI</span>
                          <span className="text-xs font-mono text-gray-900">{tracker.imei}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Type</span>
                          <span className="text-sm font-semibold text-gray-900 capitalize">{tracker.vehicleType}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Installation</span>
                          <span className="text-sm text-gray-900">{tracker.installDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-gray-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Activité récente</h2>
                  </div>

                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      const color = getActivityColor(activity.severity);
                      
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                          <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`text-${color}-600`} size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock size={12} />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className="w-full mt-4 py-2.5 text-sm text-[#00BFA6] hover:text-[#00a896] font-semibold"
                  >
                    Voir tout l'historique →
                  </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Period Selector */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Trajets effectués</h2>
                  <div className="flex gap-2">
                    {['today', 'week', 'month'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period as any)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedPeriod === period
                            ? 'bg-[#00BFA6] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {period === 'today' ? 'Aujourd\'hui' : period === 'week' ? 'Cette semaine' : 'Ce mois'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="text-blue-600" size={20} />
                      <p className="text-sm font-semibold text-blue-900">Trajets</p>
                    </div>
                    <p className="text-3xl font-extrabold text-blue-900">{trips.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="text-green-600" size={20} />
                      <p className="text-sm font-semibold text-green-900">Distance</p>
                    </div>
                    <p className="text-3xl font-extrabold text-green-900">
                      {selectedPeriod === 'today' ? tracker.distanceToday : selectedPeriod === 'week' ? tracker.distanceWeek : tracker.distanceMonth} km
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="text-purple-600" size={20} />
                      <p className="text-sm font-semibold text-purple-900">Vitesse max</p>
                    </div>
                    <p className="text-3xl font-extrabold text-purple-900">80 km/h</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-orange-600" size={20} />
                      <p className="text-sm font-semibold text-orange-900">Temps total</p>
                    </div>
                    <p className="text-3xl font-extrabold text-orange-900">
                      {formatDuration(trips.reduce((sum, t) => sum + t.duration, 0))}
                    </p>
                  </div>
                </div>

                {/* Usage Hours Bar Chart */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Heures d'utilisation</h3>
                  <p className="text-sm text-gray-500 mb-6">Nombre de trajets par heure de la journée</p>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
                        datasets: [
                          {
                            label: 'Nombre de trajets',
                            data: [0, 0, 0, 0, 1, 3, 8, 12, 15, 10, 8, 6, 5, 4, 7, 9, 11, 14, 12, 8, 4, 2, 1, 0],
                            backgroundColor: (context: any) => {
                              const value = context.parsed.y;
                              if (value === 0) return 'rgba(209, 213, 219, 0.5)';
                              if (value < 5) return 'rgba(0, 191, 166, 0.4)';
                              if (value < 10) return 'rgba(0, 191, 166, 0.7)';
                              return '#00BFA6';
                            },
                            borderRadius: 6,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: '#1F2937',
                            padding: 12,
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#00BFA6',
                            borderWidth: 2,
                            displayColors: false,
                            callbacks: {
                              title: (context: any) => `${context[0].label}`,
                              label: (context: any) => {
                                const value = context.parsed.y;
                                return `${value} trajet${value > 1 ? 's' : ''}`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                              stepSize: 5,
                              callback: (value: any) => value,
                              font: {
                                size: 11,
                              },
                            },
                            title: {
                              display: true,
                              text: 'Nombre de trajets',
                              font: {
                                size: 12,
                                weight: 'bold' as const,
                              },
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              font: {
                                size: 10,
                              },
                              maxRotation: 0,
                              minRotation: 0,
                            },
                            title: {
                              display: true,
                              text: 'Heure de la journée',
                              font: {
                                size: 12,
                                weight: 'bold' as const,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm text-blue-900">
                      <strong>💡 Insight:</strong> Utilisation maximale entre <strong>8h-10h</strong> (15 trajets) et <strong>17h-18h</strong> (14 trajets) — trajets domicile-travail
                    </p>
                  </div>
                </div>

                {/* Trips List */}
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#00BFA6] hover:shadow-lg transition-all">
                      <div className="flex flex-col lg:flex-row items-start justify-between mb-4 gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Route className="text-white" size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">{trip.startLocation}</p>
                              <p className="text-sm text-gray-500">{trip.startTime}</p>
                            </div>
                          </div>
                          
                          <div className="ml-14 my-2">
                            <div className="w-0.5 h-8 bg-gray-300 ml-1"></div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="text-green-600" size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">{trip.endLocation}</p>
                              <p className="text-sm text-gray-500">{trip.endTime}</p>
                            </div>
                          </div>
                        </div>

                        {/* Speed Sparkline - Hidden on mobile, shown on desktop */}
                        <div className="hidden lg:block lg:ml-4 lg:w-48 flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-2 font-semibold">Vitesse pendant le trajet</p>
                          <div className="h-16">
                            <Line
                              data={{
                                labels: Array.from({ length: 10 }, (_, i) => `${i}`),
                                datasets: [
                                  {
                                    data: (() => {
                                      // Generate realistic speed data based on trip stats
                                      const points = 10;
                                      const speeds = [];
                                      for (let i = 0; i < points; i++) {
                                        const variation = Math.random() * 20 - 10;
                                        speeds.push(Math.max(0, Math.min(trip.maxSpeed, trip.avgSpeed + variation)));
                                      }
                                      return speeds;
                                    })(),
                                    borderColor: '#00BFA6',
                                    backgroundColor: 'rgba(0, 191, 166, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 0,
                                    borderWidth: 2,
                                  },
                                ],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { display: false },
                                  tooltip: { enabled: false },
                                },
                                scales: {
                                  x: { display: false },
                                  y: { display: false },
                                },
                              }}
                            />
                          </div>
                        </div>

                        <button className="w-full lg:w-auto px-4 py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00a896] transition-colors font-medium text-sm flex items-center justify-center gap-2 flex-shrink-0">
                          <Play size={16} />
                          Revoir
                        </button>
                      </div>

                      {/* Mobile Sparkline - Full width on mobile */}
                      <div className="lg:hidden mb-4 pb-4 border-b border-gray-200">
                        <p className="text-xs text-gray-500 mb-2 font-semibold">Vitesse pendant le trajet</p>
                        <div className="h-16 w-full">
                          <Line
                            data={{
                              labels: Array.from({ length: 10 }, (_, i) => `${i}`),
                              datasets: [
                                {
                                  data: (() => {
                                    // Generate realistic speed data based on trip stats
                                    const points = 10;
                                    const speeds = [];
                                    for (let i = 0; i < points; i++) {
                                      const variation = Math.random() * 20 - 10;
                                      speeds.push(Math.max(0, Math.min(trip.maxSpeed, trip.avgSpeed + variation)));
                                    }
                                    return speeds;
                                  })(),
                                  borderColor: '#00BFA6',
                                  backgroundColor: 'rgba(0, 191, 166, 0.1)',
                                  tension: 0.4,
                                  fill: true,
                                  pointRadius: 0,
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                                tooltip: { enabled: false },
                              },
                              scales: {
                                x: { display: false },
                                y: { display: false },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Distance</p>
                          <p className="text-sm font-bold text-gray-900">{trip.distance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Durée</p>
                          <p className="text-sm font-bold text-gray-900">{formatDuration(trip.duration)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Vitesse max</p>
                          <p className="text-sm font-bold text-gray-900">{trip.maxSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Vitesse moy</p>
                          <p className="text-sm font-bold text-gray-900">{trip.avgSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Arrêts</p>
                          <p className="text-sm font-bold text-gray-900">{trip.stops}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {trips.length === 0 && (
                  <div className="text-center py-16">
                    <Route size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun trajet</h3>
                    <p className="text-gray-500">Aucun trajet enregistré pour cette période</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Distance Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Distance parcourue - 7 derniers jours</h3>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: ['Lun 18 Déc', 'Mar 19 Déc', 'Mer 20 Déc', 'Jeu 21 Déc', 'Ven 22 Déc', 'Sam 23 Déc', 'Dim 24 Déc'],
                        datasets: [
                          {
                            label: 'Distance (km)',
                            data: [45.2, 67.8, 89.3, 34.5, 78.9, 123.4, 56.7],
                            borderColor: '#00BFA6',
                            backgroundColor: 'rgba(0, 191, 166, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: '#00BFA6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: '#1F2937',
                            padding: 12,
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#00BFA6',
                            borderWidth: 2,
                            displayColors: false,
                            callbacks: {
                              label: (context) => `${context.parsed.y} km parcourus`,
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                              callback: (value) => `${value} km`,
                              font: {
                                size: 12,
                              },
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              font: {
                                size: 12,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Grid with Battery Chart and Time Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Battery Evolution Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution de la batterie</h3>
                    <div className="h-64">
                      <Line
                        data={{
                          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                          datasets: [
                            {
                              label: 'Batterie (%)',
                              data: [100, 95, 87, 78, 92, 85, 90],
                              borderColor: '#3B6EA5',
                              backgroundColor: 'rgba(59, 110, 165, 0.1)',
                              tension: 0.4,
                              fill: true,
                              pointRadius: 5,
                              pointHoverRadius: 7,
                              pointBackgroundColor: '#3B6EA5',
                              pointBorderColor: '#fff',
                              pointBorderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              backgroundColor: '#1F2937',
                              padding: 12,
                              displayColors: false,
                              callbacks: {
                                label: (context) => `Niveau: ${context.parsed.y}%`,
                              },
                            },
                          },
                          scales: {
                            y: {
                              min: 0,
                              max: 100,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                              },
                              ticks: {
                                callback: (value) => `${value}%`,
                                font: {
                                  size: 11,
                                },
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                font: {
                                  size: 11,
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Time Distribution Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition du temps</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Doughnut
                        data={{
                          labels: ['En mouvement', 'Arrêts', 'Stationné'],
                          datasets: [
                            {
                              data: [60, 25, 15],
                              backgroundColor: [
                                '#00BFA6',
                                '#FFA726',
                                '#EF5350',
                              ],
                              borderColor: '#fff',
                              borderWidth: 3,
                              hoverOffset: 10,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 15,
                                font: {
                                  size: 13,
                                  weight: 'bold' as const,
                                },
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                            tooltip: {
                              backgroundColor: '#1F2937',
                              padding: 12,
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || '';
                                  const value = context.parsed;
                                  return `${label}: ${value}%`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <Calendar className="text-blue-600 mb-3" size={32} />
                    <p className="text-sm font-semibold text-blue-900 mb-2">Cette semaine</p>
                    <p className="text-3xl font-extrabold text-blue-900">{tracker.distanceWeek} km</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <TrendingUp className="text-purple-600 mb-3" size={32} />
                    <p className="text-sm font-semibold text-purple-900 mb-2">Ce mois</p>
                    <p className="text-3xl font-extrabold text-purple-900">{tracker.distanceMonth} km</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <Gauge className="text-green-600 mb-3" size={32} />
                    <p className="text-sm font-semibold text-green-900 mb-2">Vitesse moyenne</p>
                    <p className="text-3xl font-extrabold text-green-900">42 km/h</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Toutes les alertes</h2>
                  <button className="px-4 py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00a896] transition-colors font-medium text-sm">
                    Configurer les alertes
                  </button>
                </div>

                <div className="space-y-3">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const color = getActivityColor(activity.severity);
                    
                    return (
                      <div key={activity.id} className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-[#00BFA6] transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`text-${color}-600`} size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <p className="font-bold text-gray-900">{activity.message}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700 whitespace-nowrap`}>
                                {activity.severity === 'error' ? 'Critique' : activity.severity === 'warning' ? 'Attention' : activity.severity === 'success' ? 'Succès' : 'Info'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activities.length === 0 && (
                  <div className="text-center py-16">
                    <Bell size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune alerte</h3>
                    <p className="text-gray-500">Aucune alerte enregistrée</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
