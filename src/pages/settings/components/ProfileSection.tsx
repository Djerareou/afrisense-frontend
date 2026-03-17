import { User, Mail, Camera } from 'lucide-react';
import { useRef } from 'react';

type Profile = { fullName: string; email: string; language?: string; avatarUrl?: string };

export default function ProfileSection({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickAvatar = () => {
    fileRef.current?.click();
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4">Profil</h2>

      <div className="flex items-center gap-6 mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="text-gray-400" />
          )}
        </div>
        <div>
          <button onClick={onPickAvatar} className="inline-flex items-center gap-2 px-3 py-2 border rounded">
            <Camera size={16} /> Modifier la photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // For now create local preview (upload handled on save)
              const url = URL.createObjectURL(file);
              setProfile({ ...profile, avatarUrl: url });
            }
          }} />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 border px-3 py-2 rounded"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email (lecture seule)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 border px-3 py-2 rounded bg-gray-50"
              value={profile.email}
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Langue</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={profile.language || 'fr'}
            onChange={(e) => setProfile({ ...profile, language: e.target.value })}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </section>
  );
}
