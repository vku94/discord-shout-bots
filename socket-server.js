import { Server } from "socket.io";
import express from "express";
import http from "http";
import { SOCKET_EVENTS } from "./constants.js";

const app = express();

let state = {
  activeBots: [],
  usersState: {}
};

app.get("/state", (req, res) => {
  res.status(200).send(state);
});

const server = http.createServer(app);
const ioServer = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true
  },
  allowEIO3: true
});

ioServer.on(SOCKET_EVENTS.CONNECTION, socket => {
  socket.on(SOCKET_EVENTS.SPEAKING_CHUNK, message => {
    socket.broadcast.emit(SOCKET_EVENTS.PLAYING_CHUNK, message);
  });

  socket.on(SOCKET_EVENTS.SYNC_BOT_STATE, message => {
    const { botId, remove } = message;
    if (remove) {
      const index = state.activeBots.indexOf(botId);
      if (index >= 0) {
        state.activeBots.splice(index, 1);
      }
    } else {
      state.activeBots.push(botId);
    }
  });

  socket.on(
    SOCKET_EVENTS.TALK_BUTTON,
    ({ userId, state: talkState, socketId }) => {
      state.usersState[userId] = {
        ...(state.usersState[userId] || {}),
        talk: state
      };
      socket.broadcast.emit(SOCKET_EVENTS.HANDLE_TALK_BUTTON, {
        userId,
        state: talkState
      });
      socket.emit(SOCKET_EVENTS.APP_CONNECTED, { success: true, socketId });
    }
  );
});

server.listen(3111, () => {
  console.log("listening on *:3111");
});
