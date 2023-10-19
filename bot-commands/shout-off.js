import {
  checkUserHasActiveSubscription,
  checkIfBotIsInUse,
  removeUserSubscription,
  destroyConnection,
  syncState,
  getUserActiveBotId,
} from '../state-functions.js';
import { SOCKET_EVENTS } from '../constants.js';

export default async function(botId, message, socket) {
  await syncState(botId);

  const userId = message.member.id;

  const userActiveBot = getUserActiveBotId(userId);

  if (userActiveBot !== botId) {
    return;
  }

  if (!checkUserHasActiveSubscription(userId) || !checkIfBotIsInUse(botId)) {
    return;
  }
  await destroyConnection(message.guild.id);
  socket.off(SOCKET_EVENTS.PLAYING_CHUNK);
  await message.reply('Stop listening!');
  removeUserSubscription(botId, socket);
}
