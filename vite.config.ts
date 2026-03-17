import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// Load environment for proxy and API base resolution. Use NODE_ENV or default to 'development'.
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');
// VITE_API_BASE_URL is used by the frontend to build request URLs. It may be
// a path like '/api' during development (when using Vite proxy). The proxy
// itself needs an absolute URL target (http://host:port). Resolve both values
// here:
const apiBase = env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || '/api';
// If apiBase is already an absolute URL, use it; otherwise fall back to a
// dedicated proxy target (VITE_PROXY_TARGET) or a sensible default host.
const apiProxyTarget = (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://')))
  ? apiBase
  : (env.VITE_PROXY_TARGET || process.env.VITE_PROXY_TARGET || 'http://localhost:3000');

// DEV debug: print resolved API base and proxy target to help diagnose proxy issues.
if (mode === 'development') {
  // eslint-disable-next-line no-console
  console.debug(`[vite.config] mode=${mode} apiBase=${apiBase} apiProxyTarget=${apiProxyTarget}`);
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        // Keep the /api prefix when proxying to the backend. The backend
        // in this project exposes routes under /api (for example
        // POST /api/auth/register). Stripping /api caused 404s because the
        // backend received /auth/register instead.
        rewrite: (path: string) => path,
      },
    },
  },
})