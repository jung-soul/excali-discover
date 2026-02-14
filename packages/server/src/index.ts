import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { handleChat } from './chat.js';
import { generateLiveKitToken } from './livekit.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', async (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'chat') {
        await handleChat(ws, msg.messages, msg.prompt);
      }
    } catch (e) {
      console.error('WS error:', e);
      ws.send(JSON.stringify({ type: 'error', message: String(e) }));
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

app.get('/api/livekit-token', async (req, res) => {
  try {
    const { identity } = req.query;
    const token = await generateLiveKitToken(String(identity || 'user'));
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
