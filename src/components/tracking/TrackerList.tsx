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
}

export default function TrackerList({ trackers, selectedId, onSelect, onAddTracker }: TrackerListProps) {
  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-gray-200 font-['Inter']">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-[#F5F7FA]">
        <h2 className="text-lg font-bold text-gray-800">Liste des traqueurs</h2>
      </div>

      {/* Tracker List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
        {trackers.map((tracker) => (
          <div
            key={tracker.id}
            onClick={() => onSelect(tracker.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${
              selectedId === tracker.id
                ? 'border-[#00BFA6] bg-[#00BFA6]/5'
                : 'border-gray-200 bg-white hover:border-[#00BFA6]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="text-3xl">
                {tracker.name.includes('Car') ? '🚗' : '🏍️'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{tracker.name}</h3>
                
                {tracker.status === 'online' ? (
                  <div className="text-sm space-y-1 mt-1">
                    <div className="flex items-center gap-1 text-[#00BFA6]">
                      <span className="w-2 h-2 bg-[#00BFA6] rounded-full shadow-sm"></span>
                      <span className="font-medium">En ligne</span>
                    </div>
                    {tracker.speed !== undefined && (
                      <div className="text-gray-600">⚡ {tracker.speed} km/h</div>
                    )}
                    {tracker.battery !== undefined && (
                      <div className="text-gray-600">🔋 {tracker.battery}%</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm space-y-1 mt-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span>Hors ligne</span>
                    </div>
                    {tracker.lastSeen && (
                      <div className="text-gray-400 text-xs">{tracker.lastSeen}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tracker Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={onAddTracker}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3B6EA5] text-white rounded-lg hover:bg-[#00a892] transition-all shadow-md font-medium"
        >
          <span className="text-xl">+</span>
          <span>Ajouter un traqueur</span>
        </button>
      </div>
    </div>
  );
}
