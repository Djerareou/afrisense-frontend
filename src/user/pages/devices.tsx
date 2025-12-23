import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Plus, MapPin, Battery, Signal, MoreVertical } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  imei: string;
  model: string;
  status: 'active' | 'inactive' | 'offline';
  battery: number;
  signal: number;
  lastUpdate: string;
  location: string;
}

export default function DevicesPage() {
  // Mock data - will be replaced with real API
  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'Toyota Camry',
      imei: '864506064XXXXXX',
      model: 'GT06N',
      status: 'active',
      battery: 85,
      signal: 90,
      lastUpdate: '2 minutes ago',
      location: 'Douala, Cameroun',
    },
    {
      id: '2',
      name: 'Honda Accord',
      imei: '864506064YYYYYY',
      model: 'GT06N',
      status: 'active',
      battery: 92,
      signal: 75,
      lastUpdate: '5 minutes ago',
      location: 'Yaoundé, Cameroun',
    },
    {
      id: '3',
      name: 'Ford Transit',
      imei: '864506064ZZZZZZ',
      model: 'GT06N',
      status: 'offline',
      battery: 15,
      signal: 0,
      lastUpdate: '2 hours ago',
      location: 'Bafoussam, Cameroun',
    },
  ]);

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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Trackers</h1>
          <p className="mt-2 text-gray-600">Gérez tous vos appareils GPS en un seul endroit</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white rounded-lg hover:shadow-lg transition-all font-medium">
          <Plus size={20} />
          Ajouter un tracker
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trackers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{devices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {devices.filter(d => d.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Signal className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hors ligne</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {devices.filter(d => d.status === 'offline').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Car className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Devices List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tracker
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Batterie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Signal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dernière mise à jour
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/tracker/${device.id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Car size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#00BFA6] transition-colors">
                          {device.name}
                        </p>
                        <p className="text-sm text-gray-500">{device.model} - {device.imei}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)}`}>
                      {getStatusLabel(device.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Battery 
                        size={18} 
                        className={device.battery > 20 ? 'text-green-600' : 'text-red-600'} 
                      />
                      <span className="text-sm font-medium text-gray-900">{device.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Signal 
                        size={18} 
                        className={device.signal > 50 ? 'text-green-600' : 'text-yellow-600'} 
                      />
                      <span className="text-sm font-medium text-gray-900">{device.signal}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <div>
                        <p>{device.lastUpdate}</p>
                        <p className="text-xs text-gray-500">{device.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
