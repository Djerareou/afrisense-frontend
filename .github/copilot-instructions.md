# AfriSense Frontend — Copilot Instructions for AI Agents

Use this guide to work effectively in this React + TypeScript + Vite codebase. Keep changes small, follow existing patterns, and prefer the provided abstractions.

## Big picture
- App is organized under `src/`:
  - `app/` Router/bootstrap and layouts; `App.tsx` wires all routes.
  - `auth/` Auth context + route guards; tokens live in local/session storage.
  - `api/` HTTP and WebSocket layers (+ endpoint modules).
  - `ws/` Placeholder for future WS store/handlers (not used yet; prefer `api/websocket.ts`).
  - `user/` and `admin/` feature pages; shared UI in `components/`.
- Path alias `@` maps to `./src` (see `vite.config.ts` + `tsconfig.app.json`), e.g. `import { devicesApi } from '@/api'`.

## Dev workflow
- Scripts (see `package.json`): `npm run dev` (opens on port 3001), `npm run build`, `npm run preview`, `npm run lint`.
- Env vars (see README + `api/config.ts`):
  - `VITE_API_BASE_URL` (default `http://localhost:8000`)
  - `VITE_WS_URL` (default `ws://localhost:8000`)
- Tailwind is configured in `tailwind.config.js`; use utility classes as in existing components.

## HTTP layer conventions (`src/api/`)
- Use the prebuilt client and modules; avoid raw `fetch/axios` in components:
  - `http.ts` provides `httpClient` with 10s timeout and automatic `Authorization` header from `auth_token`.
  - Centralize paths in `API_ENDPOINTS` via `config.ts` (e.g., `DEVICES`, `DEVICE_BY_ID(id)`).
  - Modules expose typed methods: `auth.api.ts`, `devices.api.ts`, `positions.api.ts`, `alerts.api.ts`, `payments.api.ts`, `geofences.api.ts`.
- Error handling: catch `ApiError` from `httpClient`.
- Example:
  - `const devices = await devicesApi.getAll();`
  - `try { await authApi.login({ email, password }); } catch (e) { /* ApiError */ }`

## WebSocket conventions (`src/api/websocket.ts`)
- Uses Socket.io client attached to `VITE_WS_URL` (default `http://localhost:3000`).
- Auth token is sent via `auth: { token }` in the handshake, not as a URL param.
- Events handled: `POSITION_UPDATE` (mapped to position messages), `ALERT` (geofence enter/exit mapped to geofence events).
- Auto-reconnects (up to 5 attempts) and re-subscribes tracked IDs.
- APIs: `subscribe(id)`, `unsubscribe(id)`, `onMessage(handler)`, `onOpen/OnClose/OnError`, `isConnected()`, `disconnect()`.
- Integration: prefer `hooks/useLiveTracking.ts` for positions + geofence events and connection state.

- `auth.context.tsx` manages `user`, `login`, `logout`, token storage (`auth_token`, `user_data`). Uses `authApi.login()` to get `data.token`, then `authApi.getProfile()` for `{ id, fullName, email, role }`.
- `ProtectedRoute.tsx` redirects unauthenticated users. Note: it navigates to `/` while `App.tsx` declares `/login` — verify desired behavior when guarding pages.

## Routing & pages (`src/app/App.tsx`)
- Routes declared here: `/`, `/login`, `/register`, `/alerts`, `/geofences`, `/devices`, `/subscriptions`, `/tracker/:id`.
- When adding pages, update `App.tsx`; for protected content, wrap with `ProtectedRoute`.

## UI & components (`src/components/`)
- Map: `components/map/MapView.tsx` + `react-leaflet`.
- Trackers list: `components/tracking/TrackerList.tsx`.
- Alerts panel: `components/alerts/AlertsPanel.tsx`.
- Layout: `components/layout/Header.tsx`, `Footer.tsx`.
- Follow existing Tailwind usage and responsive patterns (mobile tabs in Dashboard).

## Types & data
- Most response/request types live beside API modules (e.g., `Device`, `Position`, `Alert`). Reuse these; avoid duplicating types under `src/types/` unless they’re shared across modules.

## Patterns to follow
- Prefer `@/api` exports (`index.ts`) for imports: `authApi`, `devicesApi`, `positionsApi`, `alertsApi`, `paymentsApi`, `geofencesApi`, `liveWebSocket`.
- Keep side effects inside hooks/context (e.g., `useLiveTracking`, `AuthProvider`), not in presentational components.
- Store tokens only via `auth.context.tsx` and let `httpClient` inject them.

## Gotchas
- Dev server is set to port 3001 in `vite.config.ts` (not Vite default).
- Some `ws/*` files are placeholders; don’t implement parallel WS clients — use `liveWebSocket`.
- Interceptors module (`api/interceptors.ts`) exists but is empty; HTTP behavior is in `http.ts`.

## Quick references
- Example: live tracking
  ```ts
  import { useLiveTracking } from '@/hooks/useLiveTracking';
  const { positions, isConnected } = useLiveTracking(['tracker-1']);
  ```
- Example: devices
  ```ts
  import { devicesApi } from '@/api';
  const devices = await devicesApi.getAll();
  ```
