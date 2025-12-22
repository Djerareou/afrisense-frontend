export default function Footer() {
  return (
    <footer className="min-h-12 md:h-12 bg-[#3B6EA5] text-white flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-0 shadow-sm border-t border-white/10 font-['Inter'] gap-3 md:gap-0">
      {/* Left - Copyright */}
      <div className="flex items-center gap-2 text-xs md:text-sm">
        <span className="text-white/60">© 2025</span>
        <span className="font-semibold">AfriSense</span>
        <span className="text-white/60 hidden sm:inline">- Tous droits réservés</span>
      </div>

      {/* Center - Links */}
      <nav className="flex items-center gap-4 md:gap-8 text-xs md:text-sm flex-wrap justify-center">
        <a href="#" className="text-white/70 hover:text-[#00BFA6] transition-colors">
          À propos
        </a>
        <a href="#" className="text-white/70 hover:text-[#00BFA6] transition-colors">
          Support
        </a>
        <a href="#" className="text-white/70 hover:text-[#00BFA6] transition-colors">
          Documentation
        </a>
        <a href="#" className="text-white/70 hover:text-[#00BFA6] transition-colors">
          Confidentialité
        </a>
      </nav>

      {/* Right - Version & Status */}
      <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00BFA6] rounded-full shadow-sm"></span>
          <span className="text-white/70 hidden sm:inline">Système opérationnel</span>
          <span className="text-white/70 sm:hidden">En ligne</span>
        </div>
        <div className="text-white/50 hidden md:block">v1.0.0</div>
      </div>
    </footer>
  );
}
