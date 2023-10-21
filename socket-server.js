import { Server } from "socket.io";
import express from "express";
import http from "http";
import { SOCKET_EVENTS } from "./constants.js";

const app = express();

let state = {
  activeBots: [],
  usersState: {},
  botChannelMap: {}
};

app.get("/state", (req, res) => {
  res.status(200).send({
    activeBots: state.activeBots,
    usersState: state.usersState
  });
});

app.get("/health-check", (req, res) => {
  res.status(200).send({ health: true, timestamp: +new Date() });
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

  socket.on(SOCKET_EVENTS.SYNC_BOT_CHANNEL_MAP, message => {
    const { botId, channelName, remove } = message;
    if (remove) {
      delete state.botChannelMap[botId];
    } else {
      state.botChannelMap[botId] = channelName;
    }
  });

  socket.on(SOCKET_EVENTS.FETCH_BOT_CHANNEL_MAP, ({ socketId }) => {
    socket.emit(SOCKET_EVENTS.SEND_BOT_CHANNEL_MAP, {
      array: Object.keys(state.botChannelMap).map(k => {
        const botNumber = parseInt(k.split(" ").pop()) || 0;
        return {
          botNumber,
          channelName: state.botChannelMap?.[k]
        };
      }),
      socketId
    });
  });

  socket.on(
    SOCKET_EVENTS.TALK_BUTTON,
    ({ userId, state: talkState, socketId, targetBots }) => {
      state.usersState[userId] = {
        ...(state.usersState?.[userId] || {}),
        talk: talkState,
        targetBots
      };
      socket.broadcast.emit(SOCKET_EVENTS.HANDLE_TALK_BUTTON, {
        userId,
        state: talkState,
        targetBots
      });
      socket.emit(SOCKET_EVENTS.APP_CONNECTED, { success: true, socketId });
    }
  );
});

server.listen(3111, () => {
  console.log("listening on *:3111");
});
