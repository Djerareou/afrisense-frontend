/**
 * Example: Using AfriSense API in React Components
 * 
 * This file demonstrates how to integrate the API layer
 * in your React components.
 */

import { useEffect, useState } from 'react';
import { 
  authApi, 
  devicesApi, 
  positionsApi,
  alertsApi,
  geofencesApi,
  paymentsApi,
  liveWebSocket 
} from '../api';
import { useLiveTracking } from '../hooks/useLiveTracking';
import type { Device, Position, Alert, Geofence } from '../api';

// ==================== Example 1: Authentication ====================

export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      
      // Store token
      localStorage.setItem('auth_token', response.accessToken);
      
      // Store user data
      localStorage.setItem('user_data', JSON.stringify({
        id: response.id,
        name: response.fullName,
        email: response.email,
      }));

      // Navigate to dashboard
      window.location.href = '/';
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ==================== Example 2: Device Management ====================

export function DevicesList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await devicesApi.getAll();
      setDevices(data);
    } catch (err) {
      setError('Failed to load devices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async (imei: string, model: string, simNumber: string) => {
    try {
      const newDevice = await devicesApi.create({ imei, model, simNumber });
      setDevices([...devices, newDevice]);
    } catch (err) {
      console.error('Failed to add device:', err);
    }
  };

  if (loading) return <div>Loading devices...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>My Devices ({devices.length})</h2>
      {devices.map(device => (
        <div key={device.id} className="device-card">
          <h3>{device.model}</h3>
          <p>IMEI: {device.imei}</p>
          <p>SIM: {device.simNumber}</p>
          <span className={`status ${device.status}`}>{device.status}</span>
        </div>
      ))}
    </div>
  );
}

// ==================== Example 3: Live Tracking with Hook ====================

export function LiveMap() {
  const [trackerIds, setTrackerIds] = useState<string[]>([]);
  const { positions, geofenceEvents, isConnected } = useLiveTracking(trackerIds);

  useEffect(() => {
    // Load devices and get their IDs
    const loadTrackers = async () => {
      try {
        const devices = await devicesApi.getAll();
        setTrackerIds(devices.map(d => d.id));
      } catch (err) {
        console.error('Failed to load trackers:', err);
      }
    };

    loadTrackers();
  }, []);

  return (
    <div>
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <h2>Live Tracking</h2>
      
      {Array.from(positions.entries()).map(([trackerId, position]) => (
        <div key={trackerId} className="tracker-position">
          <h3>Tracker: {trackerId}</h3>
          <p>Latitude: {position.latitude}</p>
          <p>Longitude: {position.longitude}</p>
          <p>Speed: {position.speed} km/h</p>
          <p>Last update: {new Date(position.timestamp).toLocaleString()}</p>
        </div>
      ))}

      <h3>Recent Geofence Events</h3>
      {geofenceEvents.slice(-5).map((event, idx) => (
        <div key={idx} className="geofence-event">
          <span>{event.eventType === 'enter' ? '🟢' : '🔴'}</span>
          Tracker {event.trackerId} {event.eventType} geofence {event.geofenceId}
          <small>{new Date(event.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

// ==================== Example 4: Position History ====================

export function PositionHistory({ trackerId }: { trackerId: string }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    to: new Date().toISOString(),
  });

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await positionsApi.getHistory(trackerId, dateRange);
      setPositions(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [trackerId, dateRange]);

  return (
    <div>
      <h2>Position History</h2>
      
      <div className="date-filters">
        <input
          type="datetime-local"
          value={dateRange.from.slice(0, 16)}
          onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value).toISOString() })}
        />
        <input
          type="datetime-local"
          value={dateRange.to.slice(0, 16)}
          onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value).toISOString() })}
        />
        <button onClick={loadHistory}>Refresh</button>
      </div>

      {loading ? (
        <div>Loading positions...</div>
      ) : (
        <div className="positions-list">
          {positions.map((pos, idx) => (
            <div key={idx} className="position-item">
              <span>{new Date(pos.timestamp).toLocaleString()}</span>
              <span>{pos.latitude}, {pos.longitude}</span>
              <span>{pos.speed} km/h</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== Example 5: Alerts ====================

export function AlertsPanel({ trackerId }: { trackerId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, [trackerId]);

  const loadAlerts = async () => {
    try {
      const data = await alertsApi.getByTracker(trackerId);
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div>
      <h2>Alerts ({alerts.length})</h2>
      {alerts.map((alert, idx) => (
        <div key={idx} className="alert-item" style={{ borderLeft: `4px solid ${getSeverityColor(alert.severity)}` }}>
          <div className="alert-header">
            <span className="alert-type">{alert.type.replace('_', ' ')}</span>
            <span className="alert-severity">{alert.severity}</span>
          </div>
          <div className="alert-time">{new Date(alert.timestamp).toLocaleString()}</div>
          {alert.message && <div className="alert-message">{alert.message}</div>}
        </div>
      ))}
    </div>
  );
}

// ==================== Example 6: Geofence Management ====================

export function GeofenceManager({ trackerId }: { trackerId: string }) {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeofences();
  }, [trackerId]);

  const loadGeofences = async () => {
    try {
      const data = await geofencesApi.getByTracker(trackerId);
      setGeofences(data);
    } catch (err) {
      console.error('Failed to load geofences:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGeofence = async (name: string, lat: number, lng: number, radius: number) => {
    try {
      const newGeofence = await geofencesApi.create({
        trackerId,
        name,
        type: 'circle',
        coordinates: { latitude: lat, longitude: lng, radius },
      });
      setGeofences([...geofences, newGeofence]);
    } catch (err) {
      console.error('Failed to create geofence:', err);
    }
  };

  if (loading) return <div>Loading geofences...</div>;

  return (
    <div>
      <h2>Geofences ({geofences.length})</h2>
      {geofences.map(geofence => (
        <div key={geofence.id} className="geofence-item">
          <h3>{geofence.name}</h3>
          <p>Type: {geofence.type}</p>
          <p>Center: {geofence.coordinates.latitude}, {geofence.coordinates.longitude}</p>
          <p>Radius: {geofence.coordinates.radius}m</p>
        </div>
      ))}
    </div>
  );
}

// ==================== Example 7: Payment Processing ====================

export function PaymentForm() {
  const [amount, setAmount] = useState(2000);
  const [method, setMethod] = useState<'MobileMoney' | 'Card' | 'Cash'>('MobileMoney');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setStatus('');

    try {
      const payment = await paymentsApi.initiate({ method, amount });
      setStatus(`Payment initiated! Payment ID: ${payment.paymentId}`);
      
      // Here you would typically redirect to payment gateway
      // or show payment instructions
    } catch (err) {
      setStatus('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      
      <div className="payment-form">
        <label>
          Amount (XAF)
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="100"
          />
        </label>

        <label>
          Payment Method
          <select value={method} onChange={(e) => setMethod(e.target.value as any)}>
            <option value="MobileMoney">Mobile Money</option>
            <option value="Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
        </label>

        <button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : `Pay ${amount} XAF`}
        </button>

        {status && <div className="payment-status">{status}</div>}
      </div>
    </div>
  );
}

// ==================== Example 8: Manual WebSocket Control ====================

export function ManualWebSocketExample() {
  const [trackerId, setTrackerId] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Monitor connection status
    const unsubscribeOpen = liveWebSocket.onOpen(() => {
      setConnected(true);
      console.log('WebSocket connected');
    });

    const unsubscribeClose = liveWebSocket.onClose(() => {
      setConnected(false);
      console.log('WebSocket disconnected');
    });

    // Listen for messages
    const unsubscribeMessage = liveWebSocket.onMessage((message) => {
      setMessages(prev => [...prev.slice(-9), message]); // Keep last 10 messages
    });

    return () => {
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeMessage();
    };
  }, []);

  const handleSubscribe = () => {
    if (trackerId) {
      liveWebSocket.subscribe(trackerId);
    }
  };

  const handleUnsubscribe = () => {
    if (trackerId) {
      liveWebSocket.unsubscribe(trackerId);
    }
  };

  return (
    <div>
      <h2>WebSocket Control</h2>
      
      <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="controls">
        <input
          type="text"
          value={trackerId}
          onChange={(e) => setTrackerId(e.target.value)}
          placeholder="Tracker ID"
        />
        <button onClick={handleSubscribe} disabled={!connected}>Subscribe</button>
        <button onClick={handleUnsubscribe} disabled={!connected}>Unsubscribe</button>
      </div>

      <div className="subscribed-trackers">
        <h3>Subscribed Trackers:</h3>
        <ul>
          {liveWebSocket.getSubscribedTrackers().map(id => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>

      <div className="messages">
        <h3>Recent Messages:</h3>
        {messages.map((msg, idx) => (
          <pre key={idx}>{JSON.stringify(msg, null, 2)}</pre>
        ))}
      </div>
    </div>
  );
}
