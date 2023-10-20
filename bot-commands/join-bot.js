import {
  attachVoiceTrafficProxy,
  connectToChannel,
  destroyConnection,
  syncState
} from "../state-functions.js";
import {
  checkIfBotIsInUse,
  setBotInUse,
  removeBotInUse
} from "../state-functions.js";
import { BOT_NAME } from "../constants.js";

export default async function(botId, voiceChannel, client, socket) {
  await syncState(botId);

  if (checkIfBotIsInUse(botId)) {
    return;
  }

  setBotInUse(botId, socket);

  try {
    if (voiceChannel) {
      if (
        voiceChannel.members
          ?.map?.(m => m.user.username)
          ?.some?.(name => name.includes(BOT_NAME))
      ) {
        removeBotInUse(botId, socket);
        return;
      }

      await destroyConnection(voiceChannel.guild.id);
      await connectToChannel(voiceChannel);
      await attachVoiceTrafficProxy(
        botId,
        voiceChannel.guild.id,
        client,
        socket
      );

      // Disconnect bot on process exit
      ["SIGTERM", "SIGINT"].forEach(event => {
        process.on(event, async () => {
          destroyConnection(voiceChannel.guild.id);
          removeBotInUse(botId, socket);
        });
      });
    } else {
      removeBotInUse(botId, socket);
    }
  } catch (e) {
    console.error("shout on error", e);
    removeBotInUse(botId, socket);
  }
}
