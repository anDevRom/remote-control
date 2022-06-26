import { httpServer } from './http_server/index';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { Duplex } from 'stream';
import { handleCommand } from './handleCommand';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: 8080,
  
});

wss.on('headers', (headers) => {
  console.log('\n' + 'New websocket connection params:');
  headers.forEach(header => {
    console.log(' ' + header);
  });
});

wss.on('connection', (ws) => {
  const wsStream = createWebSocketStream(ws, { decodeStrings: false });

  wsStream.on('data', (chunk) => {
    const handler = new Duplex({
      read() {},
      write(chunk) {
        this.push(chunk);
      }
    });

    handler.write(chunk.toString('utf-8'));

    handler.on('data', async (chunk) => {
      const command = chunk.toString('utf-8');

      console.log(`\nReceived: ${command}`);
      const msg = await handleCommand(command);
      console.log(`Sended: ${msg}\n`);

      wsStream.write(msg);
    });
  });
});

process.on('SIGINT', () => {
  wss.clients.forEach(client => {
    client.terminate();
  });
  
  process.exit();
});
