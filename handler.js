import { GatewayIntentBits } from "discord-api-types/v10";
import { Client } from "discord.js";
import { BOT_COMMANDS, DISCORD_EVENTS, SOCKET_EVENTS } from "./constants.js";
import joinBot from "./bot-commands/join-bot.js";
import getUserId from "./bot-commands/get-user-id.js";
import { removeBotInUse, setUserTalkState } from "./state-functions.js";

export const getClient = (botId, socket) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.AutoModerationConfiguration,
      GatewayIntentBits.AutoModerationExecution
    ]
  });

  client.on(DISCORD_EVENTS.READY, async () => {
    console.log(`Bot ${botId} started!`);
  });

  client.on(DISCORD_EVENTS.VOICE_STATE_UPDATE, (oldState, newState) => {
    // bot disconnected
    if (oldState.channelId && !newState.channelId) {
      if (newState.id === client.user.id) {
        removeBotInUse(client.user.username, socket);
      }
    }
  });

  client.on(DISCORD_EVENTS.MESSAGE_CREATE, async message => {
    if (!message.guild) return;

    switch (message.content) {
      case BOT_COMMANDS.JOIN_BOT: {
        await joinBot(botId, message, client, socket);
        break;
      }
      case BOT_COMMANDS.MY_ID: {
        await getUserId(botId, message, socket);
        break;
      }
    }
  });

  socket.on(SOCKET_EVENTS.HANDLE_TALK_BUTTON, ({ userId, state }) => {
    setUserTalkState(userId, state);
  });

  return client;
};
