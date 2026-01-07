import { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Battery, 
  Gauge, 
  MapPin, 
  Radio, 
  WifiOff,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Trash2,
  MapPinned,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Types
interface Alert {
  id: string;
  type: 'battery' | 'speed' | 'geofence_enter' | 'geofence_exit' | 'sos' | 'offline' | 'gps_weak';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  deviceId: string;
  deviceName: string;
  timestamp: string;
  location?: string;
  isRead: boolean;
  isResolved: boolean;
  value?: string | number;
}

type TimeGroup = 'today' | 'yesterday' | 'thisWeek' | 'older';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Expandable filter sections
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<'severity' | 'type' | 'status' | null>(null);

  // Mock data - Replace with API call later
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'battery',
        title: 'Batterie Faible',
        description: 'La batterie du dispositif est inférieure à 15%',
        severity: 'high',
        deviceId: 'car1',
        deviceName: 'Car 1',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        location: 'Douala, Cameroun',
        isRead: false,
        isResolved: false,
        value: '15%'
      },
      {
        id: '2',
        type: 'speed',
        title: 'Excès de Vitesse',
        description: 'Vitesse limite dépassée de 30 km/h',
        severity: 'critical',
        deviceId: 'truck1',
        deviceName: 'Truck 01',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        location: 'Yaoundé, Cameroun',
        isRead: false,
        isResolved: false,
        value: '120 km/h'
      },
      {
        id: '3',
        type: 'geofence_exit',
        title: 'Zone Quittée',
        description: 'Le véhicule a quitté la zone autorisée',
        severity: 'high',
        deviceId: 'car1',
        deviceName: 'Car 1',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        location: 'Zone Bureau',
        isRead: true,
        isResolved: false
      },
      {
        id: '4',
        type: 'offline',
        title: 'Dispositif Hors Ligne',
        description: 'Perte de connexion avec le dispositif',
        severity: 'medium',
        deviceId: 'bike1',
        deviceName: 'Bike 01',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        isRead: true,
        isResolved: false
      },
      {
        id: '5',
        type: 'geofence_enter',
        title: 'Zone Entrée',
        description: 'Le véhicule est entré dans la zone sécurisée',
        severity: 'low',
        deviceId: 'truck1',
        deviceName: 'Truck 01',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        location: 'Zone Maison',
        isRead: true,
        isResolved: true
      },
      {
        id: '6',
        type: 'sos',
        title: 'Signal SOS',
        description: 'Bouton SOS activé par le conducteur',
        severity: 'critical',
        deviceId: 'car1',
        deviceName: 'Car 1',
        timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
        location: 'Route Douala-Yaoundé',
        isRead: true,
        isResolved: true
      }
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 800);
  }, []);

  // Alert icon mapping
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'battery': return Battery;
      case 'speed': return Gauge;
      case 'geofence_enter':
      case 'geofence_exit': return MapPin;
      case 'sos': return AlertTriangle;
      case 'offline': return WifiOff;
      case 'gps_weak': return Radio;
      default: return Bell;
    }
  };

  // Severity color mapping
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
    }
  };

  const getSeverityBorder = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
    }
  };

  // Time grouping
  const getTimeGroup = (timestamp: string): TimeGroup => {
    const now = new Date();
    const alertDate = new Date(timestamp);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) return 'today';
    if (diffHours < 48) return 'yesterday';
    if (diffHours < 168) return 'thisWeek';
    return 'older';
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const alertDate = new Date(timestamp);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return alertDate.toLocaleDateString('fr-FR');
  };

  // Filter alerts - Combined with AND logic
  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterStatus === 'unread' && alert.isRead) return false;
    if (filterStatus === 'read' && !alert.isRead) return false;
    if (filterStatus === 'resolved' && !alert.isResolved) return false;
    if (filterStatus === 'active' && alert.isResolved) return false;
    return true;
  });

  // Group alerts by time
  const groupedAlerts = filteredAlerts.reduce((groups, alert) => {
    const group = getTimeGroup(alert.timestamp);
    if (!groups[group]) groups[group] = [];
    groups[group].push(alert);
    return groups;
  }, {} as Record<TimeGroup, Alert[]>);

  // Statistics
  const stats = {
    total: alerts.filter(a => getTimeGroup(a.timestamp) === 'today').length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.isResolved).length,
    unread: alerts.filter(a => !a.isRead).length
  };

  // Actions
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isResolved: true } : a));
    if (selectedAlert?.id === id) setSelectedAlert(null);
  };

  const clearResolved = () => {
    setAlerts(alerts.filter(a => !a.isResolved));
  };

  const resetFilters = () => {
    setFilterSeverity('all');
    setFilterType('all');
    setFilterStatus('all');
    setExpandedCategory(null);
  };

  // Toggle category selection
  const toggleCategory = (category: 'severity' | 'type' | 'status', value: string) => {
    if (category === 'severity') {
      setFilterSeverity(filterSeverity === value ? 'all' : value);
      setExpandedCategory(filterSeverity === value ? null : null);
    } else if (category === 'type') {
      setFilterType(filterType === value ? 'all' : value);
      setExpandedCategory(filterType === value ? null : null);
    } else if (category === 'status') {
      setFilterStatus(filterStatus === value ? 'all' : value);
      setExpandedCategory(filterStatus === value ? null : null);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = filterSeverity !== 'all' || filterType !== 'all' || filterStatus !== 'all';

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Inter']">
      <Header />

      <main className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Left Sidebar - Blue Zone (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex lg:w-[35%] xl:w-[30%] lg:h-full bg-gradient-to-br from-[#3B6EA5] via-[#4a7db5] to-[#3B6EA5] text-white p-6 lg:p-8 shrink-0 shadow-2xl relative flex-col overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA6] rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00BFA6] rounded-full filter blur-3xl opacity-10"></div>
          
          <div className="relative z-10 flex flex-col space-y-6">
            {/* Title Section */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <Bell className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">Centre d'Alertes</h1>
                <p className="text-white/70 text-xs font-medium">Événements en temps réel</p>
              </div>
            </div>

            {/* Action Buttons Row - Horizontal */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg hover:scale-105 ${
                  showFilters
                    ? 'bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
              <button
                onClick={markAllAsRead}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20 font-bold text-sm shadow-lg hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                Tout lu
              </button>
              <button
                onClick={clearResolved}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20 font-bold text-sm shadow-lg hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl mb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Sévérité Section */}
                <div>
                  <button
                    onClick={() => {
                      if (filterSeverity !== 'all') {
                        setFilterSeverity('all');
                      } else {
                        setExpandedCategory(expandedCategory === 'severity' ? null : 'severity');
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl transition-all flex items-center justify-between font-bold text-sm shadow-lg ${
                      filterSeverity !== 'all'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critique</span>
                    </div>
                    {filterSeverity !== 'all' && (
                      <XCircle className="w-4 h-4" onClick={(e) => {
                        e.stopPropagation();
                        setFilterSeverity('all');
                      }} />
                    )}
                  </button>
                  
                  {expandedCategory === 'severity' && (
                    <div className="mt-2 ml-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {[
                        { value: 'critical', label: '🔴 Critique', color: 'from-red-600 to-red-500' },
                        { value: 'high', label: '🟠 Haute', color: 'from-orange-600 to-orange-500' },
                        { value: 'medium', label: '🟡 Moyenne', color: 'from-yellow-600 to-yellow-500' },
                        { value: 'low', label: '🔵 Basse', color: 'from-blue-600 to-blue-500' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => toggleCategory('severity', option.value)}
                          className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${
                            filterSeverity === option.value
                              ? `bg-gradient-to-r ${option.color} text-white shadow-lg scale-105`
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Type Section */}
                <div>
                  <button
                    onClick={() => {
                      if (filterType !== 'all') {
                        setFilterType('all');
                      } else {
                        setExpandedCategory(expandedCategory === 'type' ? null : 'type');
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl transition-all flex items-center justify-between font-bold text-sm shadow-lg ${
                      filterType !== 'all'
                        ? 'bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white'
                        : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      <span>Batterie</span>
                    </div>
                    {filterType !== 'all' && (
                      <XCircle className="w-4 h-4" onClick={(e) => {
                        e.stopPropagation();
                        setFilterType('all');
                      }} />
                    )}
                  </button>
                  
                  {expandedCategory === 'type' && (
                    <div className="mt-2 ml-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {[
                        { value: 'battery', label: '🔋 Batterie' },
                        { value: 'speed', label: '⚡ Vitesse' },
                        { value: 'geofence_enter', label: '📍 Entrée zone' },
                        { value: 'geofence_exit', label: '🚪 Sortie zone' },
                        { value: 'sos', label: '🆘 SOS' },
                        { value: 'offline', label: '📴 Hors ligne' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => toggleCategory('type', option.value)}
                          className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${
                            filterType === option.value
                              ? 'bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white shadow-lg scale-105'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Statut Section */}
                <div>
                  <button
                    onClick={() => {
                      if (filterStatus !== 'all') {
                        setFilterStatus('all');
                      } else {
                        setExpandedCategory(expandedCategory === 'status' ? null : 'status');
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl transition-all flex items-center justify-between font-bold text-sm shadow-lg ${
                      filterStatus !== 'all'
                        ? 'bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white'
                        : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span>Non lue</span>
                    </div>
                    {filterStatus !== 'all' && (
                      <XCircle className="w-4 h-4" onClick={(e) => {
                        e.stopPropagation();
                        setFilterStatus('all');
                      }} />
                    )}
                  </button>
                  
                  {expandedCategory === 'status' && (
                    <div className="mt-2 ml-4 space-y-2 animate-in fade-in-from-top-1 duration-200">
                      {[
                        { value: 'unread', label: '🔔 Non lues' },
                        { value: 'read', label: '✓ Lues' },
                        { value: 'active', label: '⚡ Actives' },
                        { value: 'resolved', label: '✅ Résolues' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => toggleCategory('status', option.value)}
                          className={`w-full px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${
                            filterStatus === option.value
                              ? 'bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white shadow-lg scale-105'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-400/30 font-bold text-sm shadow-lg hover:scale-105 mt-4"
                  >
                    <XCircle className="w-4 h-4" />
                    Réinitialiser tous les filtres
                  </button>
                )}
              </div>
            )}

            {/* Statistics - Below filters and actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white/90 mb-3">Statistiques</h2>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl relative overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-[#00BFA6]" />
                    <span className="text-sm font-semibold text-white/90">Aujourd'hui</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white">{stats.total}</div>
                  <div className="text-xs text-white/70 mt-1">Nouvelles alertes</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl relative overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-300" />
                    <span className="text-sm font-semibold text-white/90">Critiques</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white">{stats.critical}</div>
                  <div className="text-xs text-white/70 mt-1">Nécessitent attention</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl relative overflow-hidden group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-6 h-6 text-[#00BFA6]" />
                    <span className="text-sm font-semibold text-white/90">Non lues</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white">{stats.unread}</div>
                  <div className="text-xs text-white/70 mt-1">À consulter</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area - Alert List + Details (Full width on mobile, remaining space on desktop) */}
        <div className="flex-1 w-full min-w-0 flex bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          {/* Alert List - Takes all available space or 70% if details open */}
          <div className="flex-1 w-full min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-md border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#00BFA6]/10 to-[#00d4b8]/10 rounded-3xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                  <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#00BFA6] relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune alerte</h3>
                <p className="text-gray-500 text-lg max-w-md">
                  {hasActiveFilters
                    ? 'Aucune alerte ne correspond à vos critères de recherche'
                    : '🎉 Tous vos véhicules fonctionnent parfaitement !'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {(['today', 'yesterday', 'thisWeek', 'older'] as TimeGroup[]).map(timeGroup => {
                  const groupAlerts = groupedAlerts[timeGroup];
                  if (!groupAlerts || groupAlerts.length === 0) return null;

                  const groupTitle = {
                    today: 'Aujourd\'hui',
                    yesterday: 'Hier',
                    thisWeek: 'Cette semaine',
                    older: 'Plus ancien'
                  }[timeGroup];

                  return (
                    <div key={timeGroup} className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                          {groupTitle}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      </div>
                      <div className="space-y-3">
                        {groupAlerts.map(alert => {
                          const Icon = getAlertIcon(alert.type);
                          return (
                            <div
                              key={alert.id}
                              onClick={() => {
                                setSelectedAlert(alert);
                                setShowMobileModal(true);
                                if (!alert.isRead) markAsRead(alert.id);
                              }}
                              className={`group bg-white rounded-2xl p-5 border-l-4 ${getSeverityBorder(alert.severity)} cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl relative overflow-hidden ${
                                !alert.isRead ? 'ring-2 ring-[#00BFA6]/50' : ''
                              } ${selectedAlert?.id === alert.id ? 'shadow-2xl ring-2 ring-[#00BFA6] scale-[1.02]' : 'hover:scale-[1.01]'}`}
                            >
                              {/* Gradient overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-[#00BFA6]/0 to-[#00BFA6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              
                              <div className="relative z-10 flex items-start gap-4">
                                <div className={`w-12 h-12 ${getSeverityColor(alert.severity)} rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform`}>
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                                  <Icon className="w-6 h-6 text-white relative z-10" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-bold text-gray-900 text-lg truncate">{alert.title}</h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full font-medium">
                                      {formatRelativeTime(alert.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{alert.description}</p>
                                  <div className="flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1.5 font-semibold text-[#3B6EA5] bg-blue-50 px-3 py-1.5 rounded-lg">
                                      <Radio className="w-3.5 h-3.5" />
                                      {alert.deviceName}
                                    </span>
                                    {alert.location && (
                                      <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {alert.location}
                                      </span>
                                    )}
                                    {alert.value && (
                                      <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg">{alert.value}</span>
                                    )}
                                  </div>
                                </div>
                                {!alert.isRead && (
                                  <div className="w-3 h-3 bg-[#00BFA6] rounded-full shrink-0 shadow-lg animate-pulse"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Alert Details Panel - Enhanced & Responsive */}
          {selectedAlert && (
            <div className="hidden lg:block lg:w-[30%] lg:max-w-[420px] bg-gradient-to-br from-white via-gray-50 to-white border-l border-gray-200 overflow-y-auto p-6 shrink-0 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Détails de l'alerte</h3>
                  <p className="text-sm text-gray-500 mt-1">Informations complètes</p>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-red-50 rounded-xl transition-all hover:scale-110 group"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Severity Badge */}
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg ${getSeverityColor(selectedAlert.severity)} hover:scale-105 transition-transform`}>
                    {selectedAlert.severity === 'critical' ? 'Critique' : 
                     selectedAlert.severity === 'high' ? 'Haute' :
                     selectedAlert.severity === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  {selectedAlert.isResolved && (
                    <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:scale-105 transition-transform">
                      ✓ Résolue
                    </span>
                  )}
                </div>

                {/* Alert Info */}
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{selectedAlert.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedAlert.description}</p>
                </div>

                {/* Device Info */}
                <div className="group relative p-5 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-right-4 delay-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B6EA5]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Radio className="w-5 h-5 text-[#3B6EA5]" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Dispositif</span>
                    </div>
                    <p className="text-gray-900 font-bold text-lg">{selectedAlert.deviceName}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="group relative p-5 bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-2xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-right-4 delay-150">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Date et heure</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{new Date(selectedAlert.timestamp).toLocaleString('fr-FR')}</p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">{formatRelativeTime(selectedAlert.timestamp)}</p>
                  </div>
                </div>

                {/* Location */}
                {selectedAlert.location && (
                  <div className="group relative p-5 bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-2xl border border-teal-100 shadow-md hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-right-4 delay-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-teal-100 rounded-lg group-hover:scale-110 transition-transform">
                          <MapPinned className="w-5 h-5 text-[#00BFA6]" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Localisation</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{selectedAlert.location}</p>
                    </div>
                  </div>
                )}

                {/* Value */}
                {selectedAlert.value && (
                  <div className="group relative p-5 bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-right-4 delay-250">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Valeur</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{selectedAlert.value}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-right-4 delay-300">
                  <button className="w-full px-5 py-3.5 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    <MapPinned className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Voir sur la carte
                  </button>
                  <button className="w-full px-5 py-3.5 bg-gradient-to-r from-[#3B6EA5] to-[#4a7db5] text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Voir le dispositif
                  </button>
                  {!selectedAlert.isResolved && (
                    <button
                      onClick={() => dismissAlert(selectedAlert.id)}
                      className="w-full px-5 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Résoudre et supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Modal for Alert Details */}
      {showMobileModal && selectedAlert && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Détails de l'alerte</h3>
                <p className="text-sm text-gray-500 mt-1">Informations complètes</p>
              </div>
              <button
                onClick={() => setShowMobileModal(false)}
                className="p-2 hover:bg-red-50 rounded-xl transition-all hover:scale-110 group shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-5">
                {/* Severity Badge */}
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg ${getSeverityColor(selectedAlert.severity)} hover:scale-105 transition-transform`}>
                    {selectedAlert.severity === 'critical' ? 'Critique' : 
                     selectedAlert.severity === 'high' ? 'Haute' :
                     selectedAlert.severity === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  {selectedAlert.isResolved && (
                    <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:scale-105 transition-transform">
                      ✓ Résolue
                    </span>
                  )}
                </div>

                {/* Alert Info */}
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">{selectedAlert.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedAlert.description}</p>
                </div>

                {/* Device Info */}
                <div className="group relative p-4 sm:p-5 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B6EA5]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Radio className="w-5 h-5 text-[#3B6EA5]" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Dispositif</span>
                    </div>
                    <p className="text-gray-900 font-bold text-lg">{selectedAlert.deviceName}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="group relative p-4 sm:p-5 bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-2xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Date et heure</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{new Date(selectedAlert.timestamp).toLocaleString('fr-FR')}</p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">{formatRelativeTime(selectedAlert.timestamp)}</p>
                  </div>
                </div>

                {/* Location */}
                {selectedAlert.location && (
                  <div className="group relative p-4 sm:p-5 bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-2xl border border-teal-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-teal-100 rounded-lg group-hover:scale-110 transition-transform">
                          <MapPinned className="w-5 h-5 text-[#00BFA6]" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Localisation</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{selectedAlert.location}</p>
                    </div>
                  </div>
                )}

                {/* Value */}
                {selectedAlert.value && (
                  <div className="group relative p-4 sm:p-5 bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Valeur</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedAlert.value}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <button className="w-full px-5 py-3.5 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    <MapPinned className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Voir sur la carte
                  </button>
                  <button className="w-full px-5 py-3.5 bg-gradient-to-r from-[#3B6EA5] to-[#4a7db5] text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Voir le dispositif
                  </button>
                  {!selectedAlert.isResolved && (
                    <button
                      onClick={() => {
                        dismissAlert(selectedAlert.id);
                        setShowMobileModal(false);
                      }}
                      className="w-full px-5 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Résoudre et supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
