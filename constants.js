export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  SPEAKING_CHUNK: "speakingChunk",
  PLAYING_CHUNK: "playingChunk",
  TALK_BUTTON: "talkButton",
  HANDLE_TALK_BUTTON: "handleTalkButton",
  APP_CONNECTED: "appConnected",
  SYNC_BOT_STATE: "botState",
  SYNC_BOT_CHANNEL_MAP: "botChannelMap",
  FETCH_BOT_CHANNEL_MAP: "fetchBotChannelMap",
  SEND_BOT_CHANNEL_MAP: "sendBotChannelMap"
};

export const STREAM_EVENTS = {
  DATA: "data",
  READY: "ready",
  END: "end"
};

export const DISCORD_EVENTS = {
  MESSAGE_CREATE: "messageCreate",
  READY: "ready",
  VOICE_STATE_UPDATE: "voiceStateUpdate"
};

export const BOT_COMMANDS = {
  MY_ID: "!myid",
  JOIN_BOT: "!attach"
};

export const BOT_NAME = "Shout Bot";
