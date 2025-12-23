import { Radio, Shield, FileText, HelpCircle, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#3B6EA5] via-[#4a7db5] to-[#3B6EA5] text-white font-['Inter'] relative overflow-hidden border-t border-white/10 backdrop-blur-xl shrink-0">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
      
      <div className="relative px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 max-w-7xl mx-auto">
          
          {/* Left - Brand & Copyright */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00BFA6] to-[#00d4b8] rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
              <Radio className="relative w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs">
              <span className="font-bold text-white/90">AfriSense</span>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="text-white/60">© 2025 Tous droits réservés</span>
            </div>
          </div>

          {/* Center - Quick Links (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs">
            <a href="#" className="flex items-center gap-1.5 text-white/70 hover:text-[#00BFA6] transition-colors group">
              <HelpCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">À propos</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 text-white/70 hover:text-[#00BFA6] transition-colors group">
              <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Documentation</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 text-white/70 hover:text-[#00BFA6] transition-colors group">
              <Shield className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Confidentialité</span>
            </a>
          </nav>

          {/* Right - Status & Version */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2 h-2 bg-[#00BFA6] rounded-full animate-ping opacity-75"></span>
                <Activity className="relative w-3 h-3 text-[#00BFA6]" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-white/80 hidden sm:inline">En ligne</span>
            </div>
            
            {/* Version Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] md:text-xs">
              <span className="text-white/50 font-medium">v</span>
              <span className="font-bold text-white/80">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
