import { Battery, AlertTriangle, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import AlertSkeleton from './AlertSkeleton';

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
  onDismiss?: (id: string) => void;
  onView?: (id: string) => void;
  isLoading?: boolean;
}

export default function AlertsPanel({ alerts, onViewAll, onDismiss, onView, isLoading = false }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] text-white border-[#00BFA6] shadow-lg shadow-[#00BFA6]/30';
      case 'medium':
        return 'bg-gradient-to-br from-[#FF7F50] to-[#ff9068] text-white border-[#FF7F50] shadow-lg shadow-[#FF7F50]/30';
      case 'high':
        return 'bg-gradient-to-br from-[#E53935] to-[#ef5350] text-white border-[#E53935] shadow-lg shadow-[#E53935]/30';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white border-gray-500 shadow-lg';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'INFO';
      case 'medium':
        return 'ATTENTION';
      case 'high':
        return 'URGENT';
      default:
        return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'battery':
        return <Battery className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'speed':
        return <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />;
      case 'geofence':
        return <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />;
      default:
        return <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />;
    }
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 2xl:w-[28rem] 3xl:w-[30rem] bg-white h-full flex flex-col border-l border-gray-200 font-['Inter'] overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 md:p-7 lg:p-8 border-b-2 border-gray-100 bg-gradient-to-br from-[#F8FAFB] to-[#F5F7FA] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 truncate tracking-tight">
              Alertes Actives
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">Notifications en temps réel</p>
          </div>
          <div className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3.5 bg-gradient-to-r from-[#FF7F50] to-[#ff6b3d] text-white text-base font-bold rounded-full shadow-lg shrink-0 animate-pulse">
            {alerts.length}
          </div>
        </div>
      </div>

      {/* Alerts List - Scrollable with dynamic height */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-7 bg-gradient-to-b from-gray-50/50 to-white">
        {isLoading ? (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {[1, 2, 3].map((i) => (
              <AlertSkeleton key={i} />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 sm:p-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-5 sm:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <p className="text-base sm:text-lg text-gray-900 font-bold mb-2">
              Aucune alerte active
            </p>
            <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xs">
              Tout fonctionne normalement
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-[1.65rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"></div>
            
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className="animate-fadeInUp relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-5 top-5 w-4 h-4 rounded-full z-10 ring-4 ring-white shadow-lg ${
                  alert.severity === 'high' ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse-strong' :
                  alert.severity === 'medium' ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                  'bg-gradient-to-br from-cyan-500 to-teal-500'
                }`}></div>
                
                <div
                  className={`relative ${getSeverityColor(alert.severity)} p-5 sm:p-6 md:p-7 ml-12 rounded-2xl transition-all duration-300 cursor-pointer min-h-touch hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 overflow-hidden group`}
                  role="article"
                  aria-label={`Alerte: ${alert.title}`}
                >
                  {/* Glass overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>

                  <div className="relative flex flex-col gap-4">
                    {/* Icon + Title Row */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 overflow-hidden ${
                        alert.severity === 'high' ? 'bg-gradient-to-br from-red-600 to-red-700' :
                        alert.severity === 'medium' ? 'bg-gradient-to-br from-orange-600 to-amber-600' :
                        'bg-gradient-to-br from-cyan-600 to-teal-600'
                      }" aria-hidden="true">
                        {/* Inner glass effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                        <div className="relative z-10">
                          {getIcon(alert.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="relative font-extrabold text-base sm:text-lg leading-tight tracking-tight drop-shadow-sm">
                          {alert.title}
                        </h3>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="relative inline-flex items-center px-3 py-1.5 rounded-full bg-white/30 backdrop-blur-md font-extrabold text-xs tracking-wider whitespace-nowrap shadow-md overflow-hidden">
                        {/* Badge shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <span className="relative">{getSeverityLabel(alert.severity)}</span>
                      </span>
                      <span className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md font-bold text-xs whitespace-nowrap shadow-md">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <time>{alert.time}</time>
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(alert.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 rounded-xl transition-all duration-200 font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white"
                          aria-label={`Voir l'alerte ${alert.title}`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir</span>
                        </button>
                      )}
                      {onDismiss && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(alert.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 rounded-xl transition-all duration-200 font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white"
                          aria-label={`Ignorer l'alerte ${alert.title}`}
                        >
                          <EyeOff className="w-4 h-4" />
                          <span>Ignorer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
        )}
      </div>

      {/* View All Button */}
      <div className="p-5 sm:p-6 md:p-7 lg:p-8 border-t-2 border-gray-100 bg-gradient-to-br from-[#F8FAFB] to-[#F5F7FA] shrink-0">
        <button
          onClick={onViewAll}
          className="w-full flex items-center justify-center gap-3 px-5 sm:px-6 py-4 sm:py-4.5 md:py-5 min-h-touch bg-gradient-to-r from-[#3B6EA5] to-[#2d5a85] text-white rounded-2xl hover:from-[#2d5a85] hover:to-[#1e4565] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:ring-offset-2"
        >
          <Eye className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          <span>Voir Toutes les Alertes</span>
        </button>
      </div>
    </div>
  );
}
