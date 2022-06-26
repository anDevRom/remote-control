"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./http_server/index");
const ws_1 = require("ws");
const handleCommand_1 = require("./handleCommand");
const HTTP_PORT = 3000;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
index_1.httpServer.listen(HTTP_PORT);
const wss = new ws_1.WebSocketServer({
    port: 8080
});
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const command = data.toString('utf-8');
        (0, handleCommand_1.handleCommand)(ws, command);
    });
});
