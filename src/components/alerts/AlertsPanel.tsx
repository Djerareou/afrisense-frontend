interface Alert {
  id: string;
  type: 'battery' | 'speed' | 'geofence';
  title: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onViewAll: () => void;
}

export default function AlertsPanel({ alerts, onViewAll }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-[#00BFA6] text-white'; // Teal for low - informational
      case 'medium':
        return 'bg-[#FF7F50] text-white'; // Orange for medium - warning
      case 'high':
        return 'bg-[#E53935] text-white'; // Red for high - urgent
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Bas';
      case 'medium':
        return 'Moyen';
      case 'high':
        return 'Haute';
      default:
        return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'battery':
        return '🔋';
      case 'speed':
        return '🚨';
      case 'geofence':
        return '✅';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white h-full flex flex-col border-l border-gray-200 font-['Inter']">
      {/* Header */}
      <div className="p-4 md:p-4 border-b border-white/10 bg-[#F5F7FA]">
        <h2 className="text-base md:text-lg font-bold text-gray-800">Panneau d'alertes</h2>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F5F7FA]">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getSeverityColor(alert.severity)} p-4 rounded-lg shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="text-2xl">{getIcon(alert.type)}</div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <div className="mt-2 text-sm opacity-75">
                  {getSeverityLabel(alert.severity)} - {alert.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
        <button
          onClick={onViewAll}
          className="w-full px-4 py-2.5 md:py-3 bg-[#3B6EA5] text-white rounded-lg hover:bg-[#00a892] transition-all shadow-sm font-semibold text-sm md:text-base"
        >
          Afficher tout
        </button>
      </div>
    </div>
  );
}
