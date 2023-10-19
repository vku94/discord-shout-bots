import { GatewayIntentBits } from 'discord-api-types/v10';
import { Client } from 'discord.js';
import { BOT_COMMANDS, DISCORD_EVENTS, SOCKET_EVENTS } from './constants.js';
import shoutOn from './bot-commands/shout-on.js';
import shoutOff from './bot-commands/shout-off.js';
import { removeUserSubscription, setUserTalkState } from './state-functions.js';

export const getClient = (botId, socket) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on(DISCORD_EVENTS.READY, () => {
    console.log(`Bot ${botId} started!`);
  });

  client.on(DISCORD_EVENTS.VOICE_STATE_UPDATE, (oldState, newState) => {
    // bot disconnected
    if (oldState.channelId && !newState.channelId) {
      if (newState.id === client.user.id) {
        removeUserSubscription(client.user.username, socket);
      }
    }
  });

  client.on(DISCORD_EVENTS.MESSAGE_CREATE, async message => {
    if (!message.guild) return;

    switch (message.content) {
      case BOT_COMMANDS.SHOUT_ON: {
        await shoutOn(botId, message, socket);
        break;
      }
      case BOT_COMMANDS.SHOUT_OFF: {
        await shoutOff(botId, message, socket);
        break;
      }
      case BOT_COMMANDS.SHOUT_JOIN: {
        await shoutOn(botId, message, socket, true);
        break;
      }
    }
  });

  socket.on(SOCKET_EVENTS.HANDLE_TALK_BUTTON, ({ botId: bId, state }) => {
    if (botId === bId) {
      setUserTalkState(botId, state);
    }
  });

  return client;
};
