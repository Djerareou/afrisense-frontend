import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#3B6EA5] text-white flex items-center justify-between px-4 md:px-8 shadow-md relative w-full shrink-0">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00BFA6] rounded-lg flex items-center justify-center shadow-md shrink-0">
          <span className="text-xl md:text-2xl">📡</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold tracking-tight font-['Inter'] truncate">AfriSense</h1>
          <p className="text-[10px] md:text-xs text-white/70 font-['Inter'] hidden sm:block truncate">GPS Tracking System</p>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden flex items-center justify-center w-10 h-10 hover:bg-white/10 rounded-lg transition-all shrink-0"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">☰</span>
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-['Inter'] flex-wrap">
        <button className="flex items-center gap-2 px-4 xl:px-6 py-2.5 bg-[#00BFA6] hover:bg-[#00a892] rounded-lg transition-all duration-200 shadow-sm whitespace-nowrap">
          <span className="text-lg">🏠</span>
          <span className="font-medium text-sm xl:text-base">Dashboard</span>
        </button>

        <button className="flex items-center gap-2 px-4 xl:px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap">
          <span className="text-lg">🚗</span>
          <span className="font-medium text-sm xl:text-base">Mes véhicules</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 xl:px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap">
          <span className="text-lg">💳</span>
          <span className="font-medium text-sm xl:text-base">Abonnement</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 xl:px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap">
          <span className="text-lg">📍</span>
          <span className="font-medium text-sm xl:text-base">Géorepérage</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 xl:px-6 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 relative whitespace-nowrap">
          <span className="text-lg">🔔</span>
          <span className="font-medium text-sm xl:text-base">Alertes</span>
          <span className="absolute -top-1 -right-1 bg-[#FF7F50] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            5
          </span>
        </button>
        
        <div className="w-px h-8 bg-white/20 mx-2 xl:mx-3"></div>
        
        <button className="flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-lg">👤</span>
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Profil</div>
            <div className="text-xs text-white/60">Admin</div>
          </div>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#3B6EA5] shadow-lg z-50 border-t border-white/10 font-['Inter']">
          <div className="flex flex-col p-4 space-y-2">
            <button className="flex items-center gap-3 px-4 py-3 bg-[#00BFA6] hover:bg-[#00a892] rounded-lg transition-all duration-200 shadow-sm text-left w-full">
              <span className="text-xl">🏠</span>
              <span className="font-medium">Dashboard</span>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-left w-full">
              <span className="text-xl">🚗</span>
              <span className="font-medium">Mes véhicules</span>
            </button>
            
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-left w-full">
              <span className="text-xl">💳</span>
              <span className="font-medium">Abonnement</span>
            </button>
            
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-left w-full">
              <span className="text-xl">📍</span>
              <span className="font-medium">Géorepérage</span>
            </button>
            
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-200 relative text-left w-full">
              <span className="text-xl">🔔</span>
              <span className="font-medium">Alertes</span>
              <span className="ml-auto bg-[#FF7F50] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                5
              </span>
            </button>
            
            <div className="h-px bg-white/20 my-2"></div>
            
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-left w-full">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Profil</div>
                <div className="text-xs text-white/60">Admin</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
