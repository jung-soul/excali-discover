import { useRef, useCallback, useEffect, useState } from 'react';

export interface WSMessage {
  type: 'text' | 'elements' | 'done' | 'error';
  content?: string;
  elements?: any[];
  message?: string;
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef<((msg: WSMessage) => void) | null>(null);

  const connect = useCallback(() => {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 2000);
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WSMessage;
        handlersRef.current?.(msg);
      } catch {}
    };
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const send = useCallback((data: any) => {
    wsRef.current?.send(JSON.stringify(data));
  }, []);

  const onMessage = useCallback((handler: (msg: WSMessage) => void) => {
    handlersRef.current = handler;
  }, []);

  return { connected, send, onMessage };
}
