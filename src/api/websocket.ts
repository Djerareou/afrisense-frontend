import { API_CONFIG } from './config';
import { io, Socket } from 'socket.io-client';

// ==================== Types ====================

export interface LivePositionMessage {
  trackerId: string;
  latitude: number;
  longitude: number;
  speed: number;
  eventType: string;
  timestamp: string;
}

export interface GeofenceEventMessage {
  trackerId: string;
  geofenceId: string;
  eventType: 'enter' | 'exit';
  timestamp: string;
}

export interface SubscribeMessage {
  type: 'subscribe';
  trackerId: string;
}

export interface UnsubscribeMessage {
  type: 'unsubscribe';
  trackerId: string;
}

export type WebSocketMessage = LivePositionMessage | GeofenceEventMessage;

// ==================== WebSocket Client ====================

export class LiveWebSocket {
  private socket: Socket | null = null;
  private messageHandlers: Set<(message: WebSocketMessage) => void> = new Set();
  private errorHandlers: Set<(error: Event) => void> = new Set();
  private closeHandlers: Set<() => void> = new Set();
  private openHandlers: Set<() => void> = new Set();
  private subscribedTrackers: Set<string> = new Set();

  constructor() {
    this.connect();
  }

  /**
   * Establish WebSocket connection
   */
  private connect(): void {
    const token = this.getAuthToken();
    if (!token) {
      console.error('No auth token found. Cannot connect to Socket.io.');
      return;
    }

    this.socket = io(API_CONFIG.WS_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      // Resubscribe to all trackers
      this.subscribedTrackers.forEach((trackerId) => {
        this.subscribe(trackerId);
      });
      this.openHandlers.forEach((handler) => handler());
    });

    this.socket.on('POSITION_UPDATE', (payload: any) => {
      const msg: LivePositionMessage = {
        trackerId: payload.trackerId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speed: payload.speed ?? 0,
        eventType: payload.eventType ?? 'position',
        timestamp: payload.timestamp,
      };
      this.messageHandlers.forEach((handler) => handler(msg));
    });

    this.socket.on('ALERT', (payload: any) => {
      // Map geofence alerts to GeofenceEventMessage when possible
      if (payload.geofenceId && (payload.eventType === 'enter' || payload.eventType === 'exit')) {
        const ev: GeofenceEventMessage = {
          trackerId: payload.trackerId,
          geofenceId: payload.geofenceId,
          eventType: payload.eventType,
          timestamp: payload.timestamp,
        };
        this.messageHandlers.forEach((handler) => handler(ev));
      }
    });

    this.socket.on('disconnect', () => {
      this.closeHandlers.forEach((handler) => handler());
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Socket.io error:', err);
      this.errorHandlers.forEach((handler) => handler(err));
    });
  }

  /**
   * Ensure a connection exists once a token is available.
   * Safe to call multiple times.
   */
  public ensureConnected(): void {
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Subscribe to a tracker's live updates
   */
  public subscribe(trackerId: string): void {
    // Attempt connection if not yet connected but token may now exist
    if (!this.socket) {
      this.ensureConnected();
    }

    if (this.socket?.connected) {
      this.socket.emit('subscribeTracker', { trackerId });
      this.subscribedTrackers.add(trackerId);
    } else {
      console.warn('Socket.io not connected. Subscription will be attempted on reconnect.');
      this.subscribedTrackers.add(trackerId);
    }
  }

  /**
   * Unsubscribe from a tracker's live updates
   */
  public unsubscribe(trackerId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribeTracker', { trackerId });
    }
    this.subscribedTrackers.delete(trackerId);
  }

  /**
   * Register a message handler
   */
  public onMessage(handler: (message: WebSocketMessage) => void): () => void {
    this.messageHandlers.add(handler);
    // Return unsubscribe function
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register an error handler
   */
  public onError(handler: (error: Event) => void): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Register a close handler
   */
  public onClose(handler: () => void): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }

  /**
   * Register an open handler
   */
  public onOpen(handler: () => void): () => void {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return !!this.socket?.connected;
  }

  /**
   * Close WebSocket connection
   */
  public disconnect(): void {
    this.subscribedTrackers.clear();
    this.socket?.disconnect();
    this.socket = null;
  }

  /**
   * Get list of subscribed tracker IDs
   */
  public getSubscribedTrackers(): string[] {
    return Array.from(this.subscribedTrackers);
  }
}

// Export singleton instance
export const liveWebSocket = new LiveWebSocket();
