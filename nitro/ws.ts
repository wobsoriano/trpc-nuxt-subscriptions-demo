import { applyWSSHandler } from '@trpc/server/adapters/ws';
import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
import { appRouter } from '~/server/api/trpc/[trpc]';

export default defineNitroPlugin((nitro) => {
  const WebSocketServer = WebSocket.Server || WSWebSocketServer;
  const wss = new WebSocketServer({
    port: 3002,
  });

  const handler = applyWSSHandler({ wss, router: appRouter });

  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });
  
  console.log('✅ WebSocket Server listening on ws://localhost:3002');

  nitro.hooks.hookOnce('close', async () => {
    handler.broadcastReconnectNotification();
    wss.close();
  })
})
