// Lightweight dev overlay — no React namespace required in JSX with modern tooling
import { useAuth } from '@/auth/auth.context';

export default function DevInfo() {
  // Only render in development builds (Vite exposes import.meta.env.DEV)
  // Still protect runtime access in case this file is included in prod by mistake.
  const isDev = Boolean(import.meta.env.DEV);
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || '(not set)';
  const turnstile = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string) || '(not set)';
  const { isAuthenticated, user } = useAuth() as any;

  if (!isDev) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 text-xs text-gray-700">
      <div className="bg-white/90 border rounded shadow p-2 w-64">
        <div className="font-medium text-sm mb-1">Dev info</div>
        <div className="text-[11px] text-gray-600">API: <span className="font-mono">{apiBase}</span></div>
        <div className="text-[11px] text-gray-600">Turnstile: <span className="font-mono">{turnstile ? '●●●●●' : '(not set)'}</span></div>
        <div className="text-[11px] text-gray-600">Auth: <span className="font-mono">{isAuthenticated ? 'authenticated' : 'anonymous'}</span></div>
        {user && (
          <div className="mt-1 text-[11px]">User: <span className="font-mono">{user?.email || user?.id}</span></div>
        )}
      </div>
    </div>
  );
}
