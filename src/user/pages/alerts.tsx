import { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, Filter } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  tracker: string;
  timestamp: string;
  isRead: boolean;
}

export default function AlertsPage() {
  // Mock data
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Batterie faible',
      message: 'La batterie du tracker est en dessous de 15%',
      tracker: 'Toyota Camry',
      timestamp: '5 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Sortie de géofence',
      message: 'Le véhicule a quitté la zone autorisée "Bureau"',
      tracker: 'Honda Accord',
      timestamp: '15 minutes ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Entrée dans géofence',
      message: 'Le véhicule est entré dans la zone "Domicile"',
      tracker: 'Toyota Camry',
      timestamp: '1 hour ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Excès de vitesse',
      message: 'Vitesse détectée: 120 km/h (limite: 90 km/h)',
      tracker: 'Ford Transit',
      timestamp: '2 hours ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'critical',
      title: 'Tracker hors ligne',
      message: 'Aucune connexion depuis plus de 2 heures',
      tracker: 'Ford Transit',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: '6',
      type: 'success',
      title: 'Maintenance effectuée',
      message: 'La maintenance programmée a été complétée avec succès',
      tracker: 'Honda Accord',
      timestamp: '1 day ago',
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState<string>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="text-red-600" size={24} />;
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={24} />;
      case 'info':
        return <Info className="text-blue-600" size={24} />;
      case 'success':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return <Bell className="text-gray-600" size={24} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {unreadCount} non lues
            </span>
          )}
        </div>
        <p className="text-gray-600">Consultez toutes les notifications de vos trackers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{alerts.length}</p>
            </div>
            <Bell className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critiques</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {alerts.filter(a => a.type === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avertissements</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {alerts.filter(a => a.type === 'warning').length}
              </p>
            </div>
            <AlertCircle className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non lues</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{unreadCount}</p>
            </div>
            <Bell className="text-blue-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={18} />
            <span className="font-medium">Filtrer:</span>
          </div>
          
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          
          <button
            onClick={() => setFilter('critical')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'critical'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Critiques
          </button>
          
          <button
            onClick={() => setFilter('warning')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'warning'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Avertissements
          </button>
          
          <button
            onClick={() => setFilter('info')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border-2 p-6 transition-all hover:shadow-md ${
              getAlertColor(alert.type)
            } ${!alert.isRead ? 'border-l-4' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{alert.title}</h3>
                      {!alert.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{alert.tracker}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                  
                  {!alert.isRead && (
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      Marquer comme lue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Bell size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte</h3>
          <p className="text-gray-600">Aucune alerte ne correspond à ce filtre</p>
        </div>
      )}
    </div>
  );
}
