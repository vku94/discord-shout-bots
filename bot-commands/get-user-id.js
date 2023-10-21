import {
  checkIfBotIsInUse,
  setBotInUse,
  removeBotInUse,
  checkIfBotShouldSleep
} from "../state-functions.js";

export default async function(botId, message, socket) {
  const botNumber = parseInt(botId.split(" ").pop()) || 0;
  if (botNumber !== 25) {
    return;
  }

  if (checkIfBotIsInUse(botId) || checkIfBotShouldSleep(botId)) {
    return;
  }

  setBotInUse(botId, socket);

  try {
    await message.author.send(`Your ID is: ${message.member.user.id}`);
  } catch (e) {
    console.error("shout on error", e);
  } finally {
    removeBotInUse(botId, socket);
  }
}
