import { GatewayIntentBits } from "discord-api-types/v10";
import { Client } from "discord.js";
import { BOT_COMMANDS, DISCORD_EVENTS, SOCKET_EVENTS } from "./constants.js";
import joinBot from "./bot-commands/join-bot.js";
import getUserId from "./bot-commands/get-user-id.js";
import { removeBotInUse, setUserTalkState } from "./state-functions.js";

const channelsToAvoid = [
  "сію тобі в очі",
  "Cпєціальная ваєнная апєрація",
  "Cпілі полуниці",
  "we🔸need🔸u",
  "🔇Cвіт без русні(𝐚𝐟𝐤)",
  "🔇𝐚𝐟𝐤",
  "IT TAKES TWO",
  "___________________________",
  "🔈𝐕𝐎𝐈𝐂𝐄",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
];

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

  async function botJoin() {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const channels = await guild.channels.fetch();
    const voiceChannels = channels
      .filter(f => f.bitrate)
      .filter(f => !channelsToAvoid.includes(f.name))
      .filter(f => !f.name.toLowerCase().includes("afk"))
      .filter(f => !f.name.toLowerCase().includes("shout-skip"));

    let index = 0;
    for (const [, channel] of voiceChannels) {
      const botNumber = parseInt(botId.split(" ").pop());
      if (botNumber === index + 1 && botNumber !== 25) {
        await joinBot(botId, channel, client, socket);
      }
      index += 1;
    }
  }

  client.on(DISCORD_EVENTS.READY, async () => {
    await botJoin();
    console.log(`Bot ${botId} started!`);
  });

  client.on(DISCORD_EVENTS.VOICE_STATE_UPDATE, async (oldState, newState) => {
    // bot disconnected
    if (oldState.channelId && !newState.channelId) {
      if (newState.id === client.user.id) {
        removeBotInUse(botId, socket);
        await botJoin();
      }
    }
  });

  client.on(DISCORD_EVENTS.MESSAGE_CREATE, async message => {
    if (!message.guild) return;

    switch (message.content) {
      case BOT_COMMANDS.JOIN_BOT: {
        await joinBot(botId, message.member?.voice.channel, client, socket);
        break;
      }
      case BOT_COMMANDS.MY_ID: {
        await getUserId(botId, message, socket);
        break;
      }
    }
  });

  socket.on(
    SOCKET_EVENTS.HANDLE_TALK_BUTTON,
    ({ userId, state, targetBots }) => {
      setUserTalkState(userId, state, targetBots);
    }
  );

  return client;
};
