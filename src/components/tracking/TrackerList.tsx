import { Car, Bike, Plus, Zap, Battery } from 'lucide-react';
import TrackerSkeleton from './TrackerSkeleton';

interface Tracker {
  id: string;
  name: string;
  status: 'online' | 'offline';
  speed?: number;
  battery?: number;
  lastSeen?: string;
}

interface TrackerListProps {
  trackers: Tracker[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddTracker: () => void;
  isLoading?: boolean;
}

export default function TrackerList({ trackers, selectedId, onSelect, onAddTracker, isLoading = false }: TrackerListProps) {
  return (
    <div className="w-full lg:w-72 xl:w-80 2xl:w-96 3xl:w-[26rem] bg-white h-full flex flex-col border-r border-gray-200 font-['Inter'] overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 md:p-7 lg:p-8 border-b-2 border-gray-100 bg-gradient-to-br from-[#F8FAFB] to-[#F5F7FA] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 truncate tracking-tight">
            Mes Traqueurs
          </h2>
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 bg-gradient-to-r from-[#00BFA6] to-[#00a892] text-white text-sm font-bold rounded-full shadow-sm shrink-0">
            {trackers.length}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">Gérez vos véhicules en temps réel</p>
      </div>

      {/* Tracker List - Scrollable with dynamic height */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-7 bg-gradient-to-b from-gray-50/50 to-white">
        {isLoading ? (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {[1, 2, 3].map((i) => (
              <TrackerSkeleton key={i} />
            ))}
          </div>
        ) : trackers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 sm:p-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-5 sm:mb-6">
              <Car className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg text-gray-900 font-bold mb-2">
              Aucun traqueur disponible
            </p>
            <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xs">
              Ajoutez votre premier traqueur pour commencer
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {trackers.map((tracker, index) => (
              <div
                key={tracker.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  onClick={() => onSelect(tracker.id)}
                  className={`relative p-4 sm:p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 min-h-touch group overflow-hidden ${
                    selectedId === tracker.id
                      ? 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-[#00BFA6]/30 scale-[1.02] ring-2 ring-[#00BFA6]/50'
                      : 'bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] hover:bg-white/90'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedId === tracker.id}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(tracker.id);
                    }
                  }}
                >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  selectedId === tracker.id 
                    ? 'opacity-100 bg-gradient-to-br from-[#00BFA6]/20 via-transparent to-[#00BFA6]/10' 
                    : 'opacity-0 group-hover:opacity-100 bg-gradient-to-br from-gray-200/30 via-transparent to-gray-300/20'
                }`} style={{ zIndex: -1 }}></div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>

                <div className="relative flex items-start gap-4 sm:gap-5">
                  {/* Icon with Floating Status Badge */}
                  <div className="relative shrink-0">
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-[#00BFA6] via-[#00d4b8] to-[#00a892] rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 overflow-hidden" aria-hidden="true">
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                      {/* Animated pulse ring for online status */}
                      {tracker.status === 'online' && (
                        <div className="absolute inset-0 rounded-2xl bg-[#00BFA6] animate-ping opacity-20"></div>
                      )}
                      {tracker.name.toLowerCase().includes('car') || tracker.name.toLowerCase().includes('voiture') ? (
                        <Car className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white drop-shadow-2xl" />
                      ) : (
                        <Bike className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white drop-shadow-2xl" />
                      )}
                    </div>
                    
                    {/* Floating Status Badge */}
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white ${
                      tracker.status === 'online' 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <div className={`w-2.5 h-2.5 bg-white rounded-full ${tracker.status === 'online' ? 'animate-pulse-strong' : ''}`}></div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 truncate mb-2">
                        {tracker.name}
                      </h3>
                      
                      {tracker.status === 'online' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white text-xs font-bold rounded-full shadow-md backdrop-blur-sm relative overflow-hidden">
                          {/* Glass shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          <span className="relative w-2 h-2 bg-white rounded-full animate-pulse-strong shadow-lg shadow-white/50" aria-hidden="true"></span>
                          <span className="relative">EN LIGNE</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold rounded-full shadow-md backdrop-blur-sm">
                          <span className="w-2 h-2 bg-white/70 rounded-full" aria-hidden="true"></span>
                          <span>HORS LIGNE</span>
                        </div>
                      )}
                    </div>
                    
                    {tracker.status === 'online' ? (
                      <div className="space-y-2 sm:space-y-3">
                        {tracker.speed !== undefined && (
                          <div className="flex items-center gap-3 text-gray-700 bg-gradient-to-br from-white via-yellow-50/30 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border border-yellow-100/50">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                              <Zap className="relative w-5 h-5 text-white drop-shadow" aria-label="Vitesse" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Vitesse</p>
                              <p className="text-lg font-extrabold text-gray-900">{tracker.speed} km/h</p>
                            </div>
                          </div>
                        )}
                        {tracker.battery !== undefined && (
                          <div className="relative">
                            {/* Battery Card */}
                            <div className={`flex items-center gap-3 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border ${
                              tracker.battery < 20 ? 'bg-gradient-to-br from-white via-red-50/30 to-white border-red-100/50' : 
                              tracker.battery < 50 ? 'bg-gradient-to-br from-white via-orange-50/30 to-white border-orange-100/50' : 
                              'bg-gradient-to-br from-white via-green-50/30 to-white border-green-100/50'
                            }`}>
                              <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg relative overflow-hidden ${
                                tracker.battery < 20 ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                                tracker.battery < 50 ? 'bg-gradient-to-br from-orange-500 to-amber-600' : 
                                'bg-gradient-to-br from-green-500 to-emerald-600'
                              }`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                                <Battery className="relative w-5 h-5 text-white drop-shadow" aria-label="Batterie" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Batterie</p>
                                <p className={`text-lg font-extrabold ${
                                  tracker.battery < 20 ? 'text-red-600' : 
                                  tracker.battery < 50 ? 'text-orange-600' : 
                                  'text-green-600'
                                }`}>{tracker.battery}%</p>
                              </div>
                            </div>
                            
                            {/* Battery Progress Bar */}
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full relative overflow-hidden ${
                                  tracker.battery < 20 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                                  tracker.battery < 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 
                                  'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}
                                style={{ width: `${tracker.battery}%` }}
                              >
                                {/* Animated shine effect on progress bar */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tracker.lastSeen && (
                          <p className="text-xs text-gray-500 font-medium">
                            {tracker.lastSeen}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Tracker Button */}
      <div className="p-5 sm:p-6 md:p-7 lg:p-8 border-t-2 border-gray-100 bg-gradient-to-br from-[#F8FAFB] to-[#F5F7FA] shrink-0">
        <button
          onClick={onAddTracker}
          className="w-full flex items-center justify-center gap-3 px-5 sm:px-6 py-4 sm:py-4.5 md:py-5 min-h-touch bg-gradient-to-r from-[#3B6EA5] to-[#2d5a85] text-white rounded-2xl hover:from-[#2d5a85] hover:to-[#1e4565] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:ring-offset-2"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          <span>Ajouter un Traqueur</span>
        </button>
      </div>
    </div>
  );
}
