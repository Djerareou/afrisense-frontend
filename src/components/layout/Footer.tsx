export default function Footer() {
  return (
    <footer className="h-12 bg-[#3B6EA5] text-white flex items-center justify-between px-8 shadow-sm border-t border-white/10 font-['Inter']">
      {/* Left - Copyright */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/60">© 2025</span>
        <span className="font-semibold">AfriSense</span>
        <span className="text-white/60">- Tous droits réservés</span>
      </div>

      {/* Center - Links */}
      <nav className="flex items-center gap-6 text-sm">
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
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00BFA6] rounded-full shadow-sm"></span>
          <span className="text-white/70">Système opérationnel</span>
        </div>
        <div className="text-white/50">v1.0.0</div>
      </div>
    </footer>
  );
}
