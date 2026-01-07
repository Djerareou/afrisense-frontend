import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, Plus, MapPin, Battery, Signal, MoreVertical, 
  Search, Trash2, Edit, Eye, Map as MapIcon,
  TrendingUp, Activity, Radio, X, Check, AlertCircle,
  Truck, Bike
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Device {
  id: string;
  name: string;
  imei: string;
  model: string;
  vehicleType: 'car' | 'truck' | 'motorcycle' | 'van';
  licensePlate: string;
  status: 'active' | 'inactive' | 'offline';
  battery: number;
  signal: number;
  speed: number;
  lastUpdate: string;
  location: string;
  distanceToday: number;
}

export default function DevicesPage() {
  const navigate = useNavigate();
  
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'offline'>('all');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  
  // New device form state
  const [newDevice, setNewDevice] = useState({
    name: '',
    licensePlate: '',
    vehicleType: 'car' as 'car' | 'truck' | 'motorcycle' | 'van',
    imei: '',
    model: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock data - USER'S vehicles only (will be replaced with API: GET /api/user/devices)
  // In production, this will fetch only the authenticated user's vehicles
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Toyota Camry',
      licensePlate: 'DLA-1234-AB',
      vehicleType: 'car',
      imei: '864506064501234',
      model: 'GT06N',
      status: 'active',
      battery: 85,
      signal: 90,
      speed: 45,
      lastUpdate: 'Il y a 2 min',
      location: 'Avenue de la Liberté, N\'Djamena',
      distanceToday: 127.5,
    },
    {
      id: '2',
      name: 'Honda Civic',
      licensePlate: 'DLA-5678-CD',
      vehicleType: 'car',
      imei: '864506064505678',
      model: 'GT06N',
      status: 'active',
      battery: 92,
      signal: 75,
      speed: 0,
      lastUpdate: 'Il y a 5 min',
      location: 'Rond-Point Farcha, N\'Djamena',
      distanceToday: 89.3,
    },
    {
      id: '3',
      name: 'Mercedes Sprinter',
      licensePlate: 'DLA-9012-EF',
      vehicleType: 'van',
      imei: '864506064509012',
      model: 'GT06N',
      status: 'active',
      battery: 78,
      signal: 85,
      speed: 62,
      lastUpdate: 'Il y a 1 min',
      location: 'Route de Moundou, N\'Djamena',
      distanceToday: 234.7,
    },
    {
      id: '4',
      name: 'Ford Transit',
      licensePlate: 'DLA-3456-GH',
      vehicleType: 'truck',
      imei: '864506064503456',
      model: 'GT06N',
      status: 'offline',
      battery: 15,
      signal: 0,
      speed: 0,
      lastUpdate: 'Il y a 2h',
      location: 'Marché Central, N\'Djamena',
      distanceToday: 45.2,
    },
    {
      id: '5',
      name: 'Nissan Patrol',
      licensePlate: 'DLA-7890-IJ',
      vehicleType: 'car',
      imei: '864506064507890',
      model: 'Coban GPS306',
      status: 'inactive',
      battery: 100,
      signal: 95,
      speed: 0,
      lastUpdate: 'Il y a 30 min',
      location: 'Quartier Résidentiel, N\'Djamena',
      distanceToday: 0,
    },
    {
      id: '6',
      name: 'Yamaha XTZ',
      licensePlate: 'DLA-2468-KL',
      vehicleType: 'motorcycle',
      imei: '864506064502468',
      model: 'GT06N',
      status: 'active',
      battery: 65,
      signal: 70,
      speed: 38,
      lastUpdate: 'Il y a 3 min',
      location: 'Avenue Charles de Gaulle, N\'Djamena',
      distanceToday: 56.8,
    },
  ]);

  // Computed values
  const activeDevices = devices.filter(d => d.status === 'active').length;
  const movingDevices = devices.filter(d => d.status === 'active' && d.speed > 0).length;
  const totalDistance = devices.reduce((sum, d) => sum + d.distanceToday, 0);

  // Filter devices
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.imei.includes(searchQuery) ||
                         device.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return Car;
      case 'truck': return Truck;
      case 'motorcycle': return Bike;
      case 'van': return Truck;
      default: return Car;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'offline':
        return 'Hors ligne';
      default:
        return status;
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!newDevice.name.trim()) {
      newErrors.name = 'Le nom du véhicule est requis';
    }
    if (!newDevice.licensePlate.trim()) {
      newErrors.licensePlate = 'La plaque d\'immatriculation est requise';
    }
    if (!newDevice.imei.trim()) {
      newErrors.imei = 'Le numéro IMEI est requis';
    } else if (newDevice.imei.length < 15) {
      newErrors.imei = 'Le numéro IMEI doit contenir au moins 15 chiffres';
    } else if (devices.some(d => d.imei === newDevice.imei)) {
      newErrors.imei = 'Ce numéro IMEI est déjà enregistré';
    }
    if (!newDevice.model.trim()) {
      newErrors.model = 'Le modèle du tracker est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler functions
  const handleAddDevice = () => {
    if (!validateForm()) return;
    
    const device: Device = {
      id: Date.now().toString(),
      name: newDevice.name,
      licensePlate: newDevice.licensePlate,
      vehicleType: newDevice.vehicleType,
      imei: newDevice.imei,
      model: newDevice.model,
      status: 'inactive',
      battery: 100,
      signal: 0,
      speed: 0,
      lastUpdate: 'Jamais',
      location: 'En attente de connexion',
      distanceToday: 0,
    };
    
    setDevices([...devices, device]);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewDevice({
      name: '',
      licensePlate: '',
      vehicleType: 'car',
      imei: '',
      model: '',
    });
    setErrors({});
  };

  const handleDeleteDevice = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tracker ?')) {
      setDevices(devices.filter(d => d.id !== id));
      setShowActionMenu(null);
    }
  };

  const toggleDeviceSelection = (id: string) => {
    setSelectedDevices(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedDevices.length} tracker(s) ?`)) {
      setDevices(devices.filter(d => !selectedDevices.includes(d.id)));
      setSelectedDevices([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* Header with breadcrumb */}
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
            <span className="text-[#00BFA6] font-semibold">Véhicules & Trackers</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00BFA6] via-[#3B6EA5] to-[#00BFA6] bg-clip-text text-transparent">
                Mes Véhicules
              </h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Suivez et gérez vos véhicules en temps réel
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold shadow-lg shadow-[#00BFA6]/30"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Ajouter un tracker
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Devices */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Mes Trackers</p>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{devices.length}</p>
                <p className="text-xs text-gray-500 mt-1">Véhicules enregistrés</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <Car className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Active Devices */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Actifs</p>
                <p className="text-4xl font-extrabold text-green-600 mt-2">{activeDevices}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">En ligne</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <Radio className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Moving Devices */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">En mouvement</p>
                <p className="text-4xl font-extrabold text-purple-600 mt-2">{movingDevices}</p>
                <p className="text-xs text-gray-500 mt-1">Véhicules en déplacement</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <Activity className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Distance Today */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Distance aujourd'hui</p>
                <p className="text-4xl font-extrabold text-orange-600 mt-2">{totalDistance.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Km parcourus</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vue d'ensemble de ma flotte</h2>
            <p className="text-gray-500">Distance parcourue aujourd'hui par véhicule</p>
          </div>
          <div className="h-80">
            <Bar
              data={{
                labels: devices.map(d => d.name),
                datasets: [
                  {
                    label: 'Distance (km)',
                    data: devices.map(d => d.distanceToday),
                    backgroundColor: devices.map((_, i) => {
                      const colors = ['#00BFA6', '#3B6EA5', '#FFA726', '#EF5350', '#9C27B0', '#4CAF50'];
                      return colors[i % colors.length];
                    }),
                    borderRadius: 8,
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
                      title: (context) => {
                        const device = devices[context[0].dataIndex];
                        return `${device.name} (${device.licensePlate})`;
                      },
                      label: (context) => `Distance: ${context.parsed.y} km`,
                      afterLabel: (context) => {
                        const device = devices[context.dataIndex];
                        return `Statut: ${getStatusLabel(device.status)}`;
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
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded flex-shrink-0"></div>
              <span className="text-gray-600 text-center sm:text-left">Top performer: <strong className="break-words">{devices.reduce((max, d) => d.distanceToday > max.distanceToday ? d : max).name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0"></div>
              <span className="text-gray-600">Total flotte: <strong>{totalDistance.toFixed(1)} km</strong></span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher parmi mes véhicules..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00BFA6] focus:outline-none transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#00BFA6] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setStatusFilter('offline')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === 'offline'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hors ligne
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDevices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {selectedDevices.length} sélectionné(s)
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 text-[#00BFA6] border-gray-300 rounded focus:ring-[#00BFA6] cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Vitesse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Batterie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Signal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevices.map((device) => {
                  const VehicleIcon = getVehicleIcon(device.vehicleType);
                  
                  return (
                    <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDevices.includes(device.id)}
                          onChange={() => toggleDeviceSelection(device.id)}
                          className="w-4 h-4 text-[#00BFA6] border-gray-300 rounded focus:ring-[#00BFA6] cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/tracker/${device.id}`} className="flex items-center gap-3 group">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <VehicleIcon size={24} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-[#00BFA6] transition-colors">
                              {device.name}
                            </p>
                            <p className="text-sm text-gray-500">{device.licensePlate}</p>
                            <p className="text-xs text-gray-400">{device.model} • {device.imei}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(device.status)}`}>
                          {device.status === 'active' && <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>}
                          {getStatusLabel(device.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {device.speed > 0 ? (
                          <div className="flex items-center gap-2">
                            <Activity size={18} className="text-purple-600" />
                            <span className="text-sm font-bold text-gray-900">{device.speed} km/h</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Battery 
                            size={20} 
                            className={device.battery > 20 ? 'text-green-600' : 'text-red-600'} 
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{device.battery}%</span>
                            </div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${device.battery > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${device.battery}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Signal 
                            size={18} 
                            className={device.signal > 50 ? 'text-green-600' : device.signal > 0 ? 'text-yellow-600' : 'text-red-600'} 
                          />
                          <span className="text-sm font-medium text-gray-900">{device.signal}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-gray-900 font-medium truncate">{device.location}</p>
                            <p className="text-xs text-gray-500">{device.lastUpdate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">{device.distanceToday} km</p>
                          <p className="text-xs text-gray-500">Aujourd'hui</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/tracker/${device.id}`}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Voir les détails"
                          >
                            <Eye size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                          </Link>
                          <button
                            onClick={() => navigate(`/tracker/${device.id}`)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Localiser"
                          >
                            <MapIcon size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === device.id ? null : device.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                            title="Plus d'actions"
                          >
                            <MoreVertical size={18} className="text-gray-600" />
                            
                            {/* Dropdown Menu */}
                            {showActionMenu === device.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-10 overflow-hidden">
                                <button
                                  onClick={() => {
                                    navigate(`/tracker/${device.id}`);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                                >
                                  <Edit size={16} className="text-blue-600" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteDevice(device.id)}
                                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-medium text-red-600 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredDevices.length === 0 && (
              <div className="text-center py-16">
                <Car size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'Aucun véhicule trouvé' : 'Aucun véhicule'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Ajoutez votre premier véhicule pour commencer le suivi'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                  >
                    Ajouter mon premier véhicule
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Ajouter un véhicule</h2>
                <p className="text-sm text-white/90 mt-1">Enregistrez un nouveau tracker GPS pour votre véhicule</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Car size={20} className="text-[#00BFA6]" />
                  Informations du véhicule
                </h3>
                
                <div className="space-y-4">
                  {/* Vehicle Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom du véhicule *
                    </label>
                    <input
                      type="text"
                      value={newDevice.name}
                      onChange={(e) => {
                        setNewDevice({ ...newDevice, name: e.target.value });
                        setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Ex: Ma Toyota Camry"
                      className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:border-[#00BFA6] focus:outline-none transition-colors`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* License Plate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plaque d'immatriculation *
                    </label>
                    <input
                      type="text"
                      value={newDevice.licensePlate}
                      onChange={(e) => {
                        setNewDevice({ ...newDevice, licensePlate: e.target.value.toUpperCase() });
                        setErrors({ ...errors, licensePlate: '' });
                      }}
                      placeholder="Ex: DLA-1234-AB"
                      className={`w-full px-4 py-3 border-2 ${errors.licensePlate ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:border-[#00BFA6] focus:outline-none transition-colors font-mono uppercase`}
                    />
                    {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type de véhicule *
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'car', label: 'Voiture', icon: Car },
                        { value: 'truck', label: 'Camion', icon: Truck },
                        { value: 'van', label: 'Fourgon', icon: Truck },
                        { value: 'motorcycle', label: 'Moto', icon: Bike },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNewDevice({ ...newDevice, vehicleType: value as any })}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            newDevice.vehicleType === value
                              ? 'border-[#00BFA6] bg-[#00BFA6]/10 text-[#00BFA6]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <Icon size={24} />
                          <span className="text-xs font-semibold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracker Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Radio size={20} className="text-[#00BFA6]" />
                  Informations du tracker
                </h3>
                
                <div className="space-y-4">
                  {/* IMEI */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro IMEI *
                    </label>
                    <input
                      type="text"
                      value={newDevice.imei}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setNewDevice({ ...newDevice, imei: value });
                        setErrors({ ...errors, imei: '' });
                      }}
                      placeholder="Ex: 864506064501234"
                      maxLength={15}
                      className={`w-full px-4 py-3 border-2 ${errors.imei ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:border-[#00BFA6] focus:outline-none transition-colors font-mono`}
                    />
                    <div className="flex items-start justify-between mt-1">
                      {errors.imei && <p className="text-red-500 text-sm">{errors.imei}</p>}
                      <p className="text-xs text-gray-500 ml-auto">{newDevice.imei.length}/15</p>
                    </div>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 flex items-start gap-2">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>L'IMEI est le numéro unique de identification de votre tracker GPS. Vous le trouverez sur l'appareil ou dans sa documentation.</span>
                      </p>
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Modèle du tracker *
                    </label>
                    <select
                      value={newDevice.model}
                      onChange={(e) => {
                        setNewDevice({ ...newDevice, model: e.target.value });
                        setErrors({ ...errors, model: '' });
                      }}
                      className={`w-full px-4 py-3 border-2 ${errors.model ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:border-[#00BFA6] focus:outline-none transition-colors appearance-none bg-white cursor-pointer`}
                    >
                      <option value="">Sélectionnez un modèle</option>
                      <option value="GT06N">GT06N</option>
                      <option value="Coban GPS306">Coban GPS306</option>
                      <option value="TK103">TK103</option>
                      <option value="TK104">TK104</option>
                      <option value="ST940">ST940</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleAddDevice}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                <Check size={20} />
                Ajouter mon véhicule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
