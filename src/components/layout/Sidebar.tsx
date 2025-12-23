import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Bell, 
  Map, 
  CreditCard, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../auth/auth.context';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/devices', icon: <Car size={20} />, label: 'Mes Trackers' },
    { to: '/alerts', icon: <Bell size={20} />, label: 'Alertes' },
    { to: '/geofences', icon: <Map size={20} />, label: 'Géofencing' },
    { to: '/payments', icon: <CreditCard size={20} />, label: 'Abonnement' },
    { to: '/profile', icon: <User size={20} />, label: 'Profil' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-lg flex items-center justify-center">
            <Car size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AfriSense</h1>
            <p className="text-xs text-gray-500">GPS Tracking</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>

      {/* User Section */}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      )}
    </aside>
  );
}
