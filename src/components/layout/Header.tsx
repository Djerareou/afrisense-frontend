export default function Header() {
  return (
    <header className="h-16 bg-[#3B6EA5] text-white flex items-center justify-between px-8 shadow-md">
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00BFA6] rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl">📡</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-['Inter']">AfriSense</h1>
          <p className="text-xs text-white/70 font-['Inter']">GPS Tracking System</p>
        </div>
      </div>

      {/* Right - Navigation */}
      <nav className="flex items-center gap-3 font-['Inter']">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#00BFA6] hover:bg-[#00a892] rounded-lg transition-all duration-200 shadow-sm">
          <span className="text-lg">🏠</span>
          <span className="font-medium">Dashboard</span>
        </button>

        <button className="flex items-center gap-2 px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200">
          <span className="text-lg">🚗</span>
          <span className="font-medium">Mes véhicules</span>
        </button>
        
        <button className="flex items-center gap-2 px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200">
          <span className="text-lg">💳</span>
          <span className="font-medium">Abonnement</span>
        </button>
        
        <button className="flex items-center gap-2 px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200">
          <span className="text-lg">📍</span>
          <span className="font-medium">Géorepérage</span>
        </button>
        
        <button className="flex items-center gap-2 px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 relative">
          <span className="text-lg">🔔</span>
          <span className="font-medium">Alertes</span>
          <span className="absolute -top-1 -right-1 bg-[#FF7F50] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            5
          </span>
        </button>
        
        <div className="w-px h-8 bg-white/20 mx-3"></div>
        
        <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Profil</div>
            <div className="text-xs text-white/60">Admin</div>
          </div>
        </button>
      </nav>
    </header>
  );
}
