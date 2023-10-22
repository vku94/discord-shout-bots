import axios from "axios";
import {
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  getVoiceConnection
} from "@discordjs/voice";
import { SOCKET_EVENTS, STREAM_EVENTS } from "./constants.js";

let state = {
  activeBots: [],
  usersState: {}
};

const wait = async ms => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

// Local functions
export function checkIfBotIsInUse(botId) {
  return state.activeBots.includes(botId);
}

export function checkIfBotShouldSleep(botId) {
  const botNumber = parseInt(botId.split(" ").pop()) || 0;
  return state.activeBots.length + 1 >= botNumber;
}

export function setUserTalkState(userId, talkState, targetBots) {
  state.usersState[userId] = {
    ...(state.usersState?.[userId] || {}),
    talk: talkState,
    targetBots
  };
}

export function getUserTalkState(userId) {
  return {
    talk: state.usersState?.[userId]?.talk,
    targetBots: state.usersState?.[userId]?.targetBots
  };
}

// Remote functions
export async function syncState(botId) {
  const botNumber = parseInt(botId.split(" ").pop()) || 0;
  await wait(200 * botNumber);

  const { data } = await axios.get(`${process.env.SOCKET_SERVER}/state`);
  state = data;
}

export function setBotInUse(botId, socket) {
  state.activeBots.push(botId);
  socket.emit(SOCKET_EVENTS.SYNC_BOT_STATE, {
    botId
  });
}

export function setBotChannelNameMap(botId, channelName, socket) {
  socket.emit(SOCKET_EVENTS.SYNC_BOT_CHANNEL_MAP, {
    botId,
    channelName
  });
}

export function removeBotChannelNameMap(botId, socket) {
  socket.emit(SOCKET_EVENTS.SYNC_BOT_CHANNEL_MAP, {
    botId,
    remove: true
  });
}

export function removeBotInUse(botId, socket) {
  const index = state.activeBots.indexOf(botId);
  if (index >= 0) {
    state.activeBots.splice(index, 1);
  }
  socket.emit(SOCKET_EVENTS.SYNC_BOT_STATE, { botId, remove: true });
}

// Discord api functions
export async function connectToChannel(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
  } catch (error) {
    console.error("connectToChannel error: ", error);
  }
}

export async function destroyConnection(guildId) {
  const connection = getVoiceConnection(guildId);
  if (connection) {
    connection.destroy();
  }
}

var buffer = {};

function mergeAudio(buffers) {
  if (buffers.length === 1) {
    return buffers[0];
  }
  // Calculate the total length of the combined buffer
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);

  // Create a new buffer to hold the combined audio data
  return Buffer.concat(buffers, totalLength);
}

export async function attachVoiceTrafficProxy(botId, guildId, client, socket) {
  const connection = getVoiceConnection(guildId);

  if (connection) {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const members = await guild.members.fetch();
    // possibly check discord role
    const users = members.map(r => r.user).filter(u => u.bot === false);

    const receiverUserIdMap = users.map(user => ({
      receiver: connection.receiver.subscribe(user.id),
      userId: user.id
    }));

    receiverUserIdMap.forEach(({ receiver }) => {
      receiver.on(STREAM_EVENTS.END, () => {
        connection.destroy();
      });
    });

    if (socket) {
      receiverUserIdMap.forEach(({ receiver, userId }) =>
        receiver.on(STREAM_EVENTS.DATA, chunk => {
          const { talk, targetBots } = getUserTalkState(userId);
          if (process.env.PUSH_TO_TALK_ENABLED === "true" ? talk : true) {
            socket.emit(SOCKET_EVENTS.SPEAKING_CHUNK, {
              stream: chunk,
              targetBots,
              userId
            });
          }
        })
      );

      socket.on(
        SOCKET_EVENTS.PLAYING_CHUNK,
        ({ stream, targetBots, userId }) => {
          const botNumber = parseInt(botId.split(" ").pop()) || 0;
          if (!targetBots || targetBots?.includes(botNumber)) {
            const bufferLength = (buffer[userId]?.length || 0) + stream.length;
            const buffArray = buffer[userId]
              ? [buffer[userId], stream]
              : [stream];
            buffer[userId] = Buffer.concat(buffArray, bufferLength);
          }
        }
      );

      setInterval(() => {
        if (Object.keys(buffer).length) {
          const buffers = Object.keys(buffer).map(k => buffer[k]);
          const resultBuffer = mergeAudio(buffers);
          connection.prepareAudioPacket(resultBuffer);
          connection.dispatchAudio();
          buffer = {};
        }
      }, 20);
    }
  }
}
