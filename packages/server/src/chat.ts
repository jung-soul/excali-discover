import Anthropic from '@anthropic-ai/sdk';
import { WebSocket } from 'ws';

console.log('ANTHROPIC_API_KEY loaded:', !!process.env.ANTHROPIC_API_KEY);

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an AI assistant that can both chat AND draw diagrams on an Excalidraw canvas.

When the user asks you to draw, explain, or visualize something, respond with BOTH:
1. A conversational text explanation
2. Excalidraw drawing elements in a special JSON block

Format your drawing elements inside <elements> tags like this:
<elements>
[
  { "type": "rectangle", "id": "unique-id", "x": 100, "y": 100, "width": 200, "height": 80, "strokeColor": "#4a9eed", "backgroundColor": "#a5d8ff", "fillStyle": "solid", "roundness": { "type": 3 }, "label": { "text": "Label", "fontSize": 20 } }
]
</elements>

ELEMENT TYPES you can use:
- rectangle: { type, id, x, y, width, height, strokeColor, backgroundColor, fillStyle, roundness, label }
- ellipse: { type, id, x, y, width, height, strokeColor, backgroundColor, fillStyle, label }
- diamond: { type, id, x, y, width, height, strokeColor, backgroundColor, fillStyle, label }
- text: { type, id, x, y, text, fontSize, fontFamily }
- arrow: { type, id, x, y, width, height, points, strokeColor, endArrowhead, startBinding, endBinding }
- line: { type, id, x, y, width, height, points, strokeColor }

COLOR PALETTE:
- Blue: stroke #4a9eed, fill #a5d8ff
- Green: stroke #22c55e, fill #b2f2bb
- Amber: stroke #f59e0b, fill #ffd8a8
- Purple: stroke #8b5cf6, fill #d0bfff
- Red: stroke #ef4444, fill #ffc9c9

IMPORTANT RULES:
- Each element MUST have a unique "id" string
- Use the color palette above for visual variety
- Position elements logically (left-to-right, top-to-bottom flows)
- For arrows connecting boxes, set points as [[0,0],[dx,dy]] where dx/dy is the arrow length
- Add labels to shapes using the "label" property
- Space elements with ~50px gaps minimum
- For system architectures, use rectangles for services, arrows for connections
- For flowcharts, use diamonds for decisions, rectangles for steps
- Keep drawings within x:0-1200, y:0-800 range
- Generate elements ONE BY ONE or in small groups to enable progressive rendering
- Put each element or small group in its own <elements> block throughout your response
- Spread your <elements> blocks throughout your text response, not all at the end

When the user just wants to chat without drawing, respond normally without <elements> blocks.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function handleChat(ws: WebSocket, messages: Message[], customPrompt?: string) {
  if (ws.readyState !== WebSocket.OPEN) return;

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: customPrompt || SYSTEM_PROMPT,
    messages,
  });

  let buffer = '';
  let textBuffer = '';
  
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      const chunk = event.delta.text;
      buffer += chunk;
      textBuffer += chunk;
      
      // Check for complete <elements> blocks
      while (buffer.includes('<elements>') && buffer.includes('</elements>')) {
        const start = buffer.indexOf('<elements>');
        const end = buffer.indexOf('</elements>') + '</elements>'.length;
        
        // Send any text before the elements block
        const textBefore = buffer.substring(0, start);
        if (textBefore.trim()) {
          ws.send(JSON.stringify({ type: 'text', content: textBefore }));
        }
        
        // Parse and send elements
        const elementsStr = buffer.substring(start + '<elements>'.length, end - '</elements>'.length);
        try {
          const elements = JSON.parse(elementsStr);
          ws.send(JSON.stringify({ type: 'elements', elements }));
        } catch (e) {
          console.error('Failed to parse elements:', elementsStr.substring(0, 100));
        }
        
        buffer = buffer.substring(end);
      }
      
      // Send text chunks that aren't part of an elements block (if no open tag pending)
      if (!buffer.includes('<elements>') && buffer.length > 0) {
        // Only send if we have accumulated enough text or it's been a while
        if (buffer.length > 20 || chunk.includes('\n')) {
          ws.send(JSON.stringify({ type: 'text', content: buffer }));
          buffer = '';
        }
      }
    }
  }
  
  // Send any remaining buffer
  if (buffer.trim() && !buffer.includes('<elements>')) {
    ws.send(JSON.stringify({ type: 'text', content: buffer }));
  }
  
  ws.send(JSON.stringify({ type: 'done' }));
}
