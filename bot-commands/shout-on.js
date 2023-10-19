import {
  attachVoiceTrafficProxy,
  connectToChannel,
  destroyConnection,
  getUserActiveBotId,
  syncState,
} from '../state-functions.js';
import {
  checkUserHasActiveSubscription,
  checkIfBotIsInUse,
  setUserSubscription,
  removeUserSubscription,
  setUserCode,
} from '../state-functions.js';
import { checkPermission } from '../permissions.js';
import { BOT_NAME } from '../constants.js';

export default async function(botId, message, socket, listenOnly) {
  await syncState(botId);

  const userId = message.member.id;

  if (checkIfBotIsInUse(botId) && getUserActiveBotId(userId) === botId) {
    await message.reply('You already have a dedicated listener! Finish the session first.');
    return;
  }

  if (checkUserHasActiveSubscription(userId) || checkIfBotIsInUse(botId)) {
    return;
  }

  setUserSubscription(botId, userId, socket);

  try {
    const voiceChannel = message.member?.voice.channel;

    if (voiceChannel) {
      if (!listenOnly && !checkPermission(message.member.user.username)) {
        await message.reply('You do not have permissions to shout.');
        removeUserSubscription(botId, socket);
        return;
      }

      if (voiceChannel.members.map(m => m.user.username).some(name => name.includes(BOT_NAME))) {
        await message.reply('Only one bot per channel allowed!');
        removeUserSubscription(botId, socket);
        return;
      }

      await destroyConnection(voiceChannel.guild.id, voiceChannel.id);
      await connectToChannel(voiceChannel);
      attachVoiceTrafficProxy(message, listenOnly, socket);
      await message.reply('Listening now!');

      if (!listenOnly) {
        const code = String(+new Date()).slice(-6);
        setUserCode(botId, code, socket);
        message.author.send(`Your code to connect with shout app: ${code}`);
      }

      // Disconnect bot on process exit
      ['SIGTERM', 'SIGINT'].forEach(event => {
        process.on(event, async () => {
          destroyConnection(voiceChannel.guild.id, voiceChannel.id);
          removeUserSubscription(botId, socket);
        });
      });
      return;
    }

    await message.reply('Join a voice channel then try again!');
  } catch (e) {
    console.error('shout on error', e);
    removeUserSubscription(botId, socket);
  }
}
