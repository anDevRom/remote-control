import { httpServer } from './http_server/index';
import { WebSocketServer } from 'ws';
import { handleCommand } from './handleCommand';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({
  port: 8080
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const command = data.toString('utf-8');

    handleCommand(ws, command);
  });
});
