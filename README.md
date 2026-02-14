# Excali-Discover ✦

Interactive AI drawing assistant — chat with Claude and watch it draw diagrams on an Excalidraw canvas in real-time.

![Demo](https://img.shields.io/badge/AI-Drawing-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![React](https://img.shields.io/badge/React-18-61dafb)

## What it does

You chat with an AI assistant in a sidebar. When you ask it to visualize something — a system architecture, a flowchart, a concept — it responds with text AND progressively draws the diagram on an Excalidraw canvas. Elements appear one by one as the AI streams its response.

## Quick Start

```bash
# Clone
git clone git@github.com:jung-soul/excali-discover.git
cd excali-discover

# Configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Install & run
pnpm install
pnpm dev
```

Open http://localhost:5173

## Architecture

```
packages/
  client/   → React + Vite + Excalidraw + Tailwind (port 5173)
  server/   → Express + WebSocket + Anthropic Claude (port 3001)
```

- **WebSocket** streams AI responses with interleaved text and drawing elements
- **Excalidraw elements** appear progressively on the canvas as Claude generates them
- **Dark theme** throughout with a polished chat UI

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `LIVEKIT_URL` | No | LiveKit server URL (voice mode) |
| `LIVEKIT_API_KEY` | No | LiveKit API key |
| `LIVEKIT_API_SECRET` | No | LiveKit API secret |
| `PORT` | No | Server port (default: 3001) |

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Excalidraw, Tailwind CSS
- **Backend:** Express, WebSocket, Anthropic SDK
- **AI:** Claude Sonnet (streaming)
- **Voice (optional):** LiveKit

## License

MIT
