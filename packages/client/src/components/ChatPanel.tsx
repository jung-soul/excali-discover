import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: ChatMessage[];
  streaming: boolean;
  streamingText: string;
  onSend: (text: string) => void;
  connected: boolean;
}

export default function ChatPanel({ messages, streaming, streamingText, onSend, connected }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          ✦
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm">Excali-Discover</h1>
          <p className="text-slate-400 text-xs">
            {connected ? '● Connected' : '○ Connecting...'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streaming && (
          <div className="text-center mt-20">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-white font-semibold text-lg mb-2">Draw anything with AI</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Ask me to draw diagrams, architectures, flowcharts, or any visual concept. I'll draw it live on the canvas!
            </p>
            <div className="mt-6 space-y-2">
              {['Draw a microservices architecture', 'Visualize a neural network', 'Create a user login flowchart'].map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="block w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-750 hover:text-white transition-colors border border-slate-700"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg-enter ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-slate-800 text-slate-200 rounded-bl-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {streaming && streamingText && (
          <div className="msg-enter">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed bg-slate-800 text-slate-200">
              <div className="whitespace-pre-wrap">{streamingText}</div>
              <span className="inline-flex gap-1 ml-1">
                <span className="typing-dot w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" />
              </span>
            </div>
          </div>
        )}

        {streaming && !streamingText && (
          <div className="msg-enter">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 bg-slate-800">
              <span className="inline-flex gap-1">
                <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full inline-block" />
                <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full inline-block" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={streaming ? 'Thinking...' : 'Ask me to draw something...'}
            disabled={streaming}
            className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-slate-600 focus:border-blue-500 transition-colors placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
