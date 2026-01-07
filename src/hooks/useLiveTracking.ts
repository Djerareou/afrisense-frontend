import { useEffect, useState, useCallback } from 'react';
import { liveWebSocket } from '../api';
import type { LivePositionMessage, GeofenceEventMessage } from '../api';

export interface LivePosition {
  trackerId: string;
  latitude: number;
  longitude: number;
  speed: number;
  eventType: string;
  timestamp: string;
}

export interface GeofenceEvent {
  trackerId: string;
  geofenceId: string;
  eventType: 'enter' | 'exit';
  timestamp: string;
}

export function useLiveTracking(trackerIds: string[]) {
  const [positions, setPositions] = useState<Map<string, LivePosition>>(new Map());
  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((message: LivePositionMessage | GeofenceEventMessage) => {
    // Position update
    if ('latitude' in message) {
      setPositions(prev => {
        const updated = new Map(prev);
        updated.set(message.trackerId, message);
        return updated;
      });
    }
    
    // Geofence event
    if ('geofenceId' in message) {
      setGeofenceEvents(prev => [...prev, message]);
    }
  }, []);

  // Subscribe to trackers
  useEffect(() => {
    // Ensure socket connection (after login token is set)
    liveWebSocket.ensureConnected();

    // Subscribe to all tracker IDs
    trackerIds.forEach(id => {
      liveWebSocket.subscribe(id);
    });

    // Set up message handler
    const unsubscribeMessage = liveWebSocket.onMessage(handleMessage);

    // Set up connection status handlers
    const unsubscribeOpen = liveWebSocket.onOpen(() => {
      setIsConnected(true);
    });

    const unsubscribeClose = liveWebSocket.onClose(() => {
      setIsConnected(false);
    });

    // Update initial connection status
    setIsConnected(liveWebSocket.isConnected());

    // Cleanup
    return () => {
      trackerIds.forEach(id => {
        liveWebSocket.unsubscribe(id);
      });
      unsubscribeMessage();
      unsubscribeOpen();
      unsubscribeClose();
    };
  }, [trackerIds, handleMessage]);

  return {
    positions,
    geofenceEvents,
    isConnected,
  };
}
