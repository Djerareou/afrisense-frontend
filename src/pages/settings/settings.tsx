import { useAuth } from '@/auth/auth.context';
import { Shield, Mail, User, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#00BFA6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const sessionType = localStorage.getItem('auth_token')
    ? 'Session persistante (Remember me)'
    : 'Session navigateur';

  return (
    <div className="max-w-3xl mx-auto p-6 font-['Inter']">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Paramètres du compte
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y">
        
        {/* Profil */}
        <Section title="Profil">
          <Item icon={<User />} label="Nom" value={user.name} />
          <Item icon={<Mail />} label="Email" value={user.email} />
          <Item icon={<Shield />} label="Rôle" value={user.role} />
        </Section>

        {/* Sécurité */}
        <Section title="Sécurité">
          <Item
            icon={<Shield />}
            label="Type de session"
            value={sessionType}
          />
        </Section>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-gray-400">{icon}</div>
      <span className="text-gray-500 w-32">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
