import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Radio, Home, Car, CreditCard, MapPin, Bell, User, Menu, X, Search, ChevronDown, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../auth/auth.context';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="min-h-[72px] bg-gradient-to-r from-[#3B6EA5] via-[#4a7db5] to-[#3B6EA5] text-white flex items-center justify-between px-4 md:px-8 shadow-2xl relative w-full shrink-0 safe-area-insets safe-area-top backdrop-blur-xl border-b border-white/10 z-[10001]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
      
      <div className="relative flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0 z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden group hover:scale-110 transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
          <Radio className="relative w-6 h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="min-w-0 max-w-[150px] sm:max-w-none">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight font-['Inter'] truncate">AfriSense</h1>
          <p className="text-[10px] md:text-xs text-white/80 font-['Inter'] hidden sm:block truncate font-semibold">GPS Tracking System</p>
        </div>
      </div>

      {/* Search field - Global search across the app */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8 relative z-10">
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:bg-white/15 transition-colors"></div>
          <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Search className="absolute left-4 w-5 h-5 text-white/60 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Rechercher un véhicule, une alerte..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden relative z-[10003] flex items-center justify-center min-w-touch min-h-touch w-10 h-10 md:w-11 md:h-11 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition-all shrink-0 border border-white/10 shadow-md"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <Menu className="w-6 h-6 md:w-7 md:h-7" />}
      </button>

      <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-['Inter'] relative z-10">
        <button className="flex items-center gap-2 px-4 xl:px-5 py-2.5 min-h-touch bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] backdrop-blur-md"
          onClick={() => navigate('/')}>
          <Home className="w-5 h-5" />
          <span className="font-bold text-sm xl:text-base">Dashboard</span>
        </button>
        <button className="flex items-center gap-2 px-4 xl:px-5 py-2.5 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg"
          onClick={() => navigate('/devices')}>
          <Car className="w-5 h-5" />
          <span className="font-semibold text-sm xl:text-base">Mes véhicules</span>
        </button>
        <button className="flex items-center gap-2 px-4 xl:px-5 py-2.5 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg"
          onClick={() => navigate('/subscriptions')}>
          <CreditCard className="w-5 h-5" />
          <span className="font-semibold text-sm xl:text-base">Abonnement</span>
        </button>
        <button 
          onClick={() => navigate('/geofences')}
          className="flex items-center gap-2 px-4 xl:px-5 py-2.5 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg">
          <MapPin className="w-5 h-5" />
          <span className="font-semibold text-sm xl:text-base">Géofences</span>
        </button>
        <button 
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-2 px-4 xl:px-5 py-2.5 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 relative whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg">
          <Bell className="w-5 h-5" />
          <span className="font-semibold text-sm xl:text-base">Alertes</span>
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FF7F50] to-[#ff6b3d] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">5</span>
        </button>
        <div className="w-px h-8 bg-white/30 mx-2 xl:mx-3"></div>
        
        {/* User Menu or Login Button */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5] border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg group"
            >
              <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-full flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <User className="relative w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#3B6EA5]"></div>
            </div>
            <div className="text-left hidden xl:block">
              <div className="font-bold text-sm">{user?.name || 'Utilisateur'}</div>
              <div className="text-xs text-white/70 font-medium">{user?.email || ''}</div>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 animate-fadeInUp">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{user?.name || 'Utilisateur'}</div>
                    <div className="text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left font-medium text-sm group">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#00BFA6] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Mon Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left font-medium text-sm group">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#00BFA6] group-hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>Paramètres</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-semibold text-sm group"
                >
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-5 xl:px-6 py-2.5 min-h-touch bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3B6EA5]"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-bold text-sm xl:text-base">Se connecter</span>
          </button>
        )}
      </nav>

      {isMobileMenuOpen && createPortal(
        <div className="lg:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-gradient-to-br from-[#3B6EA5] via-[#4a7db5] to-[#3B6EA5] backdrop-blur-xl shadow-2xl z-[99999] border-t border-white/20 font-['Inter'] overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          <div className="relative flex flex-col p-4 md:p-6 space-y-3 md:space-y-4 h-full overflow-y-auto max-w-4xl mx-auto">
            
            {/* Search removed - now only in specific pages */}
            
            {/* Navigation principale - Grille sur tablettes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <button className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] rounded-xl transition-all duration-200 shadow-lg text-left w-full focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md"
                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                <Home className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold text-sm md:text-base">Dashboard</span>
              </button>
              <button className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10 shadow-md"
                onClick={() => { navigate('/devices'); setIsMobileMenuOpen(false); }}>
                <Car className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-semibold text-sm md:text-base">Mes véhicules</span>
              </button>
              <button className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10 shadow-md"
                onClick={() => { navigate('/subscriptions'); setIsMobileMenuOpen(false); }}>
                <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-semibold text-sm md:text-base">Abonnement</span>
              </button>
              <button className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10 shadow-md">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-semibold text-sm md:text-base">Géorepérage</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/alerts');
                }}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 relative text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10 shadow-md md:col-span-2">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-semibold text-sm md:text-base">Alertes</span>
                <span className="ml-auto bg-gradient-to-r from-[#FF7F50] to-[#ff6b3d] text-white text-xs md:text-sm font-bold rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow-lg animate-pulse">5</span>
              </button>
            </div>
            
            {/* Séparateur */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-2 md:my-4"></div>
            
            {/* User section or Login button */}
            {isAuthenticated ? (
              <>
                {/* Profil utilisateur - Full width sur tablettes */}
                <button className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 min-h-touch bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10 shadow-md">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                      <User className="relative w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full ring-2 ring-[#3B6EA5]"></div>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-sm md:text-base">{user?.name || 'Utilisateur'}</div>
                <div className="text-xs md:text-sm text-white/70 font-medium">{user?.email || ''}</div>
              </div>
            </button>
            
            {/* Actions utilisateur - Grille sur tablettes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 pt-2">
              <button className="flex items-center gap-3 md:gap-2 px-4 md:px-3 py-2.5 md:py-3 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">Mon Profil</span>
              </button>
              <button className="flex items-center gap-3 md:gap-2 px-4 md:px-3 py-2.5 md:py-3 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-medium text-sm md:text-base">Paramètres</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 md:gap-2 px-4 md:px-3 py-2.5 md:py-3 bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 rounded-xl transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-red-400/30 md:col-span-1"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500/30 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-semibold text-sm md:text-base">Déconnexion</span>
              </button>
            </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 px-6 py-4 min-h-touch bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] hover:from-[#00d4b8] hover:to-[#00BFA6] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-left w-full focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
              >
                <LogIn className="w-6 h-6 md:w-7 md:h-7" />
                <span className="font-bold text-base md:text-lg">Se connecter</span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
