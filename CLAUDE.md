# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excali-Discover is an interactive AI drawing assistant — chat with Claude and watch it draw diagrams on an Excalidraw canvas in real-time. Elements appear progressively as the AI streams its response.

## Repository Structure

```
excali-discover/
├── packages/
│   ├── client/          # React + Vite + Excalidraw + Tailwind (port 5173)
│   └── server/          # Express + WebSocket + Anthropic Claude (port 3001)
├── architecture/        # Architecture Decision Records (ADRs)
├── architecture-prd/    # Product Requirement Documents derived from ADRs
├── architecture-prd-logs/ # Implementation logs for PRD task tracking
├── .claude/
│   ├── commands/        # Custom Claude Code commands
│   └── skills/          # Design guidelines and best practices
└── pnpm-workspace.yaml  # Monorepo configuration
```

## Development Commands

### Client (packages/client/)

```bash
cd packages/client

# Install dependencies (pnpm)
pnpm install

# Dev server (http://localhost:5173, proxies /ws to server)
pnpm dev

# Build / type check
pnpm build
```

### Server (packages/server/)

```bash
cd packages/server

# Install dependencies (pnpm)
pnpm install

# Dev server with watch mode (http://localhost:3001)
pnpm dev

# Build / type check
pnpm build
```

### Full Stack (from root)

```bash
# Install all dependencies
pnpm install

# Run both client and server
pnpm dev
```

## Architecture

### Tech Stack

| Component | Technology | Role |
|-----------|------------|------|
| **Frontend** | React 18, Vite, TypeScript, Excalidraw, Tailwind CSS | Canvas + Chat UI |
| **Backend** | Express, WebSocket (ws), Anthropic SDK | AI orchestration + streaming |
| **AI** | Claude Sonnet (streaming) | Generates text + drawing elements |
| **Voice** (optional) | LiveKit | Real-time voice interaction |

### Data Flow

```
1. User types message in ChatPanel
2. App sends message history via WebSocket to server
3. Server streams Claude response with interleaved text + <elements> blocks
4. Client receives chunks:
   - "text" messages → append to streaming text in ChatPanel
   - "elements" messages → convert to Excalidraw format, add to Canvas
   - "done" message → finalize assistant message
5. Excalidraw renders elements progressively with animation
```

### Key Files

| File | Role |
|------|------|
| `packages/server/src/chat.ts` | Claude streaming + element parsing logic |
| `packages/server/src/index.ts` | Express + WebSocket server setup |
| `packages/client/src/App.tsx` | Main app — state management, WS message routing |
| `packages/client/src/components/Canvas.tsx` | Excalidraw wrapper with progressive rendering |
| `packages/client/src/components/ChatPanel.tsx` | Chat UI with message history + input |
| `packages/client/src/hooks/useWebSocket.ts` | WebSocket connection management |
| `packages/client/src/lib/excalidraw-utils.ts` | Element format conversion (simplified → Excalidraw) |

### WebSocket Protocol

Client → Server:
```json
{ "type": "chat", "messages": [{ "role": "user|assistant", "content": "..." }] }
```

Server → Client:
```json
{ "type": "text", "content": "..." }
{ "type": "elements", "elements": [...] }
{ "type": "done" }
{ "type": "error", "message": "..." }
```

## Configuration

### Environment Variables (.env in project root)

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `LIVEKIT_URL` | No | LiveKit server URL (voice mode) |
| `LIVEKIT_API_KEY` | No | LiveKit API key |
| `LIVEKIT_API_SECRET` | No | LiveKit API secret |
| `PORT` | No | Server port (default: 3001) |

### Vite Proxy

The client proxies `/ws` and `/api` to the server (port 3001) via `vite.config.ts`.

## Custom Claude Commands

- `/create-adr` — Create a new Architecture Decision Record
- `/create-prd-from-adr` — Convert an ADR into a PRD with JSON task tracking
- `/implement-prd` — Walk through PRD tasks with implementation plans and progress tracking

## Development Guidelines

- **Commit incrementally** — small, logical commits as you build. Never dump everything in one commit.
- **Design first** — consider UX and visual design before implementing
- **Test your work** — verify changes actually work before committing
- **Follow the ADR → PRD → Implementation workflow** for significant changes
