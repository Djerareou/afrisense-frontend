# AfriSense Frontend - API Integration Guide

## 📁 API Structure

The API layer is organized in `/src/api/` with the following structure:

```
src/api/
├── config.ts           # API base URLs and endpoints
├── http.ts             # HTTP client with interceptors
├── auth.api.ts         # Authentication endpoints
├── devices.api.ts      # Device/Tracker management
├── positions.api.ts    # Position history
├── alerts.api.ts       # Alerts and notifications
├── payments.api.ts     # Payment processing
├── geofences.api.ts    # Geofencing management
├── websocket.ts        # WebSocket live tracking
└── index.ts            # Central exports
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Development
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Production
# VITE_API_BASE_URL=https://api.afrisense.com
# VITE_WS_URL=wss://api.afrisense.com
```

### API Configuration

The `config.ts` file centralizes all API endpoints:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  TIMEOUT: 10000,
};
```

## 🔐 Authentication

### Register New User

```typescript
import { authApi } from '@/api';

const handleRegister = async () => {
  try {
    const response = await authApi.register({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
    });
    // Response includes: id, fullName, email, accessToken
    console.log('Registered:', response);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Login

```typescript
import { authApi } from '@/api';

const handleLogin = async () => {
  try {
    const response = await authApi.login({
      email: 'john@example.com',
      password: 'SecurePass123',
    });
    // Store the accessToken
    localStorage.setItem('auth_token', response.accessToken);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Get User Profile

```typescript
import { authApi } from '@/api';

const fetchProfile = async () => {
  try {
    const profile = await authApi.getProfile();
    // Returns: id, fullName, email, role
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

## 🚗 Devices Management

### Get All Devices

```typescript
import { devicesApi } from '@/api';

const fetchDevices = async () => {
  try {
    const devices = await devicesApi.getAll();
    console.log('Devices:', devices);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
  }
};
```

### Create New Device

```typescript
import { devicesApi } from '@/api';

const addDevice = async () => {
  try {
    const newDevice = await devicesApi.create({
      imei: '864506064XXXXXX',
      model: 'GT06N',
      simNumber: '+237699000000',
    });
    console.log('Device created:', newDevice);
  } catch (error) {
    console.error('Failed to create device:', error);
  }
};
```

## 📍 Positions & Tracking

### Get Position History

```typescript
import { positionsApi } from '@/api';

const fetchHistory = async (trackerId: string) => {
  try {
    const positions = await positionsApi.getHistory(trackerId, {
      from: '2025-12-20T00:00:00Z',
      to: '2025-12-23T23:59:59Z',
    });
    console.log('Position history:', positions);
  } catch (error) {
    console.error('Failed to fetch history:', error);
  }
};
```

### Live Tracking (WebSocket)

```typescript
import { liveWebSocket } from '@/api';

// Subscribe to tracker updates
liveWebSocket.subscribe('tracker-uuid-here');

// Listen for position updates
const unsubscribe = liveWebSocket.onMessage((message) => {
  if ('latitude' in message) {
    console.log('New position:', {
      trackerId: message.trackerId,
      lat: message.latitude,
      lng: message.longitude,
      speed: message.speed,
    });
  }
  
  if ('geofenceId' in message) {
    console.log('Geofence event:', {
      trackerId: message.trackerId,
      geofenceId: message.geofenceId,
      eventType: message.eventType, // 'enter' or 'exit'
    });
  }
});

// Clean up when component unmounts
return () => {
  liveWebSocket.unsubscribe('tracker-uuid-here');
  unsubscribe();
};
```

## 🔔 Alerts

### Get Tracker Alerts

```typescript
import { alertsApi } from '@/api';

const fetchAlerts = async (trackerId: string) => {
  try {
    const alerts = await alertsApi.getByTracker(trackerId);
    alerts.forEach(alert => {
      console.log(`${alert.severity}: ${alert.type} at ${alert.timestamp}`);
    });
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
  }
};
```

## 💳 Payments

### Initiate Payment

```typescript
import { paymentsApi } from '@/api';

const processPayment = async () => {
  try {
    const payment = await paymentsApi.initiate({
      method: 'MobileMoney',
      amount: 2000,
    });
    console.log('Payment initiated:', payment);
    // Returns: paymentId, status ('pending'), amount
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

## 🗺️ Geofencing

### Create Geofence

```typescript
import { geofencesApi } from '@/api';

const createGeofence = async (trackerId: string) => {
  try {
    const geofence = await geofencesApi.create({
      trackerId,
      name: 'Home',
      type: 'circle',
      coordinates: {
        latitude: 12.3456,
        longitude: 15.6789,
        radius: 100, // meters
      },
    });
    console.log('Geofence created:', geofence);
  } catch (error) {
    console.error('Failed to create geofence:', error);
  }
};
```

### Get Tracker Geofences

```typescript
import { geofencesApi } from '@/api';

const fetchGeofences = async (trackerId: string) => {
  try {
    const geofences = await geofencesApi.getByTracker(trackerId);
    console.log('Geofences:', geofences);
  } catch (error) {
    console.error('Failed to fetch geofences:', error);
  }
};
```

## 🔄 HTTP Client Features

### Automatic Token Injection

The HTTP client automatically includes the auth token in all requests:

```typescript
// Token is automatically added to Authorization header
// No need to manually add it to each request
const devices = await devicesApi.getAll();
```

### Error Handling

```typescript
import { ApiError } from '@/api';

try {
  await authApi.login({ email, password });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
  }
}
```

### Request Timeout

All requests have a 10-second timeout by default. This can be configured in `config.ts`:

```typescript
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
};
```

## 🌐 WebSocket Features

### Connection Management

The WebSocket automatically:
- ✅ Connects with auth token
- ✅ Reconnects on disconnect (up to 5 attempts)
- ✅ Resubscribes to trackers after reconnection
- ✅ Handles connection errors

### Event Handlers

```typescript
import { liveWebSocket } from '@/api';

// Connection opened
liveWebSocket.onOpen(() => {
  console.log('WebSocket connected');
});

// Connection closed
liveWebSocket.onClose((event) => {
  console.log('WebSocket closed:', event.reason);
});

// Connection error
liveWebSocket.onError((error) => {
  console.error('WebSocket error:', error);
});

// Check connection status
if (liveWebSocket.isConnected()) {
  console.log('WebSocket is connected');
}
```

### Cleanup

```typescript
// When component unmounts or user logs out
liveWebSocket.disconnect();
```

## 🎯 React Integration Example

### Complete Component Example

```typescript
import { useEffect, useState } from 'react';
import { devicesApi, liveWebSocket } from '@/api';
import type { Device, LivePositionMessage } from '@/api';

export function TrackerMap() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [positions, setPositions] = useState<Map<string, LivePositionMessage>>(new Map());

  useEffect(() => {
    // Fetch devices
    const loadDevices = async () => {
      try {
        const data = await devicesApi.getAll();
        setDevices(data);
        
        // Subscribe to live updates for each device
        data.forEach(device => {
          liveWebSocket.subscribe(device.id);
        });
      } catch (error) {
        console.error('Failed to load devices:', error);
      }
    };

    loadDevices();

    // Listen for position updates
    const unsubscribe = liveWebSocket.onMessage((message) => {
      if ('latitude' in message) {
        setPositions(prev => new Map(prev).set(message.trackerId, message));
      }
    });

    // Cleanup
    return () => {
      devices.forEach(device => {
        liveWebSocket.unsubscribe(device.id);
      });
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Live Tracker Map</h2>
      {devices.map(device => {
        const position = positions.get(device.id);
        return (
          <div key={device.id}>
            <h3>{device.model} ({device.imei})</h3>
            {position && (
              <p>
                Position: {position.latitude}, {position.longitude}
                Speed: {position.speed} km/h
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Update `.env` with production API URLs
- [ ] Enable HTTPS (wss:// for WebSocket)
- [ ] Configure CORS on backend
- [ ] Implement token refresh mechanism
- [ ] Add request retry logic
- [ ] Enable error reporting (Sentry, etc.)
- [ ] Add request rate limiting
- [ ] Implement offline mode handling
- [ ] Add analytics tracking
- [ ] Test WebSocket reconnection

## 📝 Notes

- All API calls require authentication except `/auth/register` and `/auth/login`
- Tokens are stored in localStorage (Remember Me) or sessionStorage
- WebSocket automatically reconnects up to 5 times
- All timestamps are in ISO 8601 format
- All IDs are UUIDs
- All payloads are JSON only

## 🐛 Troubleshooting

### CORS Issues
Add backend CORS configuration to allow frontend origin.

### WebSocket Not Connecting
- Check `VITE_WS_URL` in `.env`
- Verify auth token exists
- Check browser console for errors

### 401 Unauthorized
- Token may be expired
- Implement token refresh logic
- Check token storage (localStorage/sessionStorage)

### Network Timeout
- Increase timeout in `config.ts`
- Check backend response time
- Verify network connectivity
