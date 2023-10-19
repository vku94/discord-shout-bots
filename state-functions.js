import axios from 'axios';
import {
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  getVoiceConnection,
} from '@discordjs/voice';
import { SOCKET_EVENTS, STREAM_EVENTS } from './constants.js';

let botUserSubscriptions = {};

const wait = async ms => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

// Local functions
export function checkUserHasActiveSubscription(userId) {
  return Object.values(botUserSubscriptions)
    .map(({ userId }) => userId)
    .includes(userId);
}

export function checkIfBotIsInUse(botId) {
  return Object.keys(botUserSubscriptions).includes(botId);
}

export function setUserTalkState(botId, state) {
  botUserSubscriptions[botId] = {
    ...botUserSubscriptions[botId],
    talk: state,
  };
}

export function getUserActiveBotId(userId) {
  let botId = null;
  Object.keys(botUserSubscriptions).forEach(key => {
    if (botUserSubscriptions[key].userId === userId) {
      botId = key;
    }
  });
  return botId;
}

// Remote functions
export async function syncState(botId) {
  const botNumber = parseInt(botId.split(' ').pop()) || 0;
  await wait(200 * botNumber);

  const { data } = await axios.get(`${process.env.SOCKET_SERVER}/state`);
  botUserSubscriptions = data;
}

export function setUserSubscription(botId, userId, socket) {
  botUserSubscriptions[botId] = {
    userId,
    talk: false,
  };
  socket.emit(SOCKET_EVENTS.SYNC_BOT_STATE, {
    botId,
    botState: botUserSubscriptions[botId],
  });
}

export function setUserCode(botId, code, socket) {
  botUserSubscriptions[botId] = {
    ...botUserSubscriptions[botId],
    code,
  };
  socket.emit(SOCKET_EVENTS.SYNC_BOT_STATE, {
    botId,
    botState: botUserSubscriptions[botId],
  });
}

export function removeUserSubscription(botId, socket) {
  delete botUserSubscriptions[botId];
  socket.emit(SOCKET_EVENTS.SYNC_BOT_STATE, { botId, remove: true });
}

// Discord api functions
export async function connectToChannel(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
  } catch (error) {
    console.error('connectToChannel error: ', error);
  }
}

export async function destroyConnection(guildId) {
  const connection = getVoiceConnection(guildId);
  if (connection) {
    connection.destroy();
  }
}

let buffer;

export function attachVoiceTrafficProxy(message, listenOnly, socket) {
  const connection = getVoiceConnection(message.guild.id);

  const userId = message.member.id;
  if (connection) {
    const receiver = connection.receiver.subscribe(userId);

    receiver.on(STREAM_EVENTS.END, () => {
      connection.destroy();
    });

    if (socket) {
      if (!listenOnly) {
        receiver.on(STREAM_EVENTS.DATA, chunk => {
          const botId = getUserActiveBotId(userId);
          if (
            process.env.PUSH_TO_TALK_ENABLED === 'true' ? botUserSubscriptions[botId]?.talk : true
          ) {
            socket.emit(SOCKET_EVENTS.SPEAKING_CHUNK, { stream: chunk, user: userId });
          }
        });
      }

      socket.on(SOCKET_EVENTS.PLAYING_CHUNK, message => {
        connection.playOpusPacket(message.stream);
      });
    }
  }
}
