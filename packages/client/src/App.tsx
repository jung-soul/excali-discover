import React, { useState, useCallback, useEffect, useRef } from 'react';
import ChatPanel from './components/ChatPanel';
import Canvas from './components/Canvas';
import { useWebSocket } from './hooks/useWebSocket';
import { convertElements } from './lib/excalidraw-utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [elements, setElements] = useState<any[]>([]);
  const streamTextRef = useRef('');
  const { connected, send, onMessage } = useWebSocket();

  useEffect(() => {
    onMessage((msg) => {
      switch (msg.type) {
        case 'text':
          streamTextRef.current += msg.content || '';
          setStreamingText(streamTextRef.current);
          break;
        case 'elements':
          if (msg.elements) {
            const converted = convertElements(msg.elements);
            setElements((prev) => [...prev, ...converted]);
          }
          break;
        case 'done':
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: streamTextRef.current },
          ]);
          streamTextRef.current = '';
          setStreamingText('');
          setStreaming(false);
          break;
        case 'error':
          setStreaming(false);
          streamTextRef.current = '';
          setStreamingText('');
          break;
      }
    });
  }, [onMessage]);

  const handleSend = useCallback(
    (text: string) => {
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: 'user', content: text },
      ];
      setMessages(newMessages);
      setStreaming(true);
      streamTextRef.current = '';
      setStreamingText('');
      send({
        type: 'chat',
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
    },
    [messages, send]
  );

  return (
    <div className="h-screen w-screen flex bg-slate-950">
      {/* Chat Panel */}
      <div className="w-[380px] min-w-[320px] flex-shrink-0">
        <ChatPanel
          messages={messages}
          streaming={streaming}
          streamingText={streamingText}
          onSend={handleSend}
          connected={connected}
        />
      </div>
      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas elements={elements} onElementsChange={setElements} />
      </div>
    </div>
  );
}
