import { API_CONFIG, API_ENDPOINTS } from './config';

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
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Set<(message: WebSocketMessage) => void> = new Set();
  private errorHandlers: Set<(error: Event) => void> = new Set();
  private closeHandlers: Set<(event: CloseEvent) => void> = new Set();
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
      console.error('No auth token found. Cannot connect to WebSocket.');
      return;
    }

    // Construct WebSocket URL with token
    const wsUrl = `${API_CONFIG.WS_URL}${API_ENDPOINTS.WS_LIVE}?token=${token}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Resubscribe to all trackers
      this.subscribedTrackers.forEach(trackerId => {
        this.subscribe(trackerId);
      });

      // Call open handlers
      this.openHandlers.forEach(handler => handler());
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorHandlers.forEach(handler => handler(error));
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.closeHandlers.forEach(handler => handler(event));
      
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        setTimeout(() => this.connect(), this.reconnectDelay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };
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
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: SubscribeMessage = {
        type: 'subscribe',
        trackerId,
      };
      this.ws.send(JSON.stringify(message));
      this.subscribedTrackers.add(trackerId);
    } else {
      console.warn('WebSocket not open. Subscription will be attempted on reconnect.');
      this.subscribedTrackers.add(trackerId);
    }
  }

  /**
   * Unsubscribe from a tracker's live updates
   */
  public unsubscribe(trackerId: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: UnsubscribeMessage = {
        type: 'unsubscribe',
        trackerId,
      };
      this.ws.send(JSON.stringify(message));
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
  public onClose(handler: (event: CloseEvent) => void): () => void {
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
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Close WebSocket connection
   */
  public disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    this.subscribedTrackers.clear();
    this.ws?.close();
    this.ws = null;
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
