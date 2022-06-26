import { WebSocketServer } from 'ws';
import { handleCommand } from './handleCommand.js';

const wss = new WebSocketServer({
  port: 8080
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const command = data.toString('utf-8');

    handleCommand(ws, command);
  });
});