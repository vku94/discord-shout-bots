import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { BOT_NAME, SOCKET_EVENTS } from './constants.js';

const app = express();

let state = {};

app.get('/state', (req, res) => {
  res.status(200).send(state);
});

const server = http.createServer(app);
const ioServer = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
});

ioServer.on(SOCKET_EVENTS.CONNECTION, socket => {
  socket.on(SOCKET_EVENTS.SPEAKING_CHUNK, message => {
    socket.broadcast.emit(SOCKET_EVENTS.PLAYING_CHUNK, message);
  });

  socket.on(SOCKET_EVENTS.SYNC_BOT_STATE, message => {
    const { botId, botState, remove } = message;
    if (remove) {
      delete state[botId];
    } else {
      state[botId] = botState;
    }
  });

  socket.on(SOCKET_EVENTS.TALK_BUTTON, ({ code, state: talkState, socketId }) => {
    const botId = Object.keys(state).find(key => state[key]?.code === code);

    if (botId) {
      socket.broadcast.emit(SOCKET_EVENTS.HANDLE_TALK_BUTTON, {
        botId,
        state: talkState,
      });
      socket.emit(SOCKET_EVENTS.APP_CONNECTED, { success: true, socketId });
    } else {
      socket.emit(SOCKET_EVENTS.APP_CONNECTED, { success: false, socketId });
    }
  });
});

server.listen(3111, () => {
  console.log('listening on *:3111');
});
