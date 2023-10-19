import dotenv from 'dotenv';
import spawnClient from './spawn-client.js';
import { BOT_NAME } from './constants.js';

dotenv.config();

const botsList = [
  {
    name: `${BOT_NAME} 1`,
    token: process.env.CLIENT_TOKEN1,
    // https://discord.com/api/oauth2/authorize?client_id=1162702694964805632&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 2`,
    token: process.env.CLIENT_TOKEN2,
    // https://discord.com/api/oauth2/authorize?client_id=1162789457922097204&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 3`,
    token: process.env.CLIENT_TOKEN3,
    // https://discord.com/api/oauth2/authorize?client_id=1163078011390804049&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 4`,
    token: process.env.CLIENT_TOKEN4,
    // https://discord.com/api/oauth2/authorize?client_id=1163079803881140234&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 5`,
    token: process.env.CLIENT_TOKEN5,
    // https://discord.com/api/oauth2/authorize?client_id=1163080633690628246&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 6`,
    token: process.env.CLIENT_TOKEN6,
    // https://discord.com/api/oauth2/authorize?client_id=1163080918555181196&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 7`,
    token: process.env.CLIENT_TOKEN7,
    // https://discord.com/api/oauth2/authorize?client_id=1163081149548068944&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 8`,
    token: process.env.CLIENT_TOKEN8,
    // https://discord.com/api/oauth2/authorize?client_id=1163081412207984650&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 9`,
    token: process.env.CLIENT_TOKEN9,
    // https://discord.com/api/oauth2/authorize?client_id=1163081652306710568&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 10`,
    token: process.env.CLIENT_TOKEN10,
    // https://discord.com/api/oauth2/authorize?client_id=1163081829390221333&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 11`,
    token: process.env.CLIENT_TOKEN11,
    // https://discord.com/api/oauth2/authorize?client_id=1163082025251635300&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 12`,
    token: process.env.CLIENT_TOKEN12,
    // https://discord.com/api/oauth2/authorize?client_id=1163082288280637492&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 13`,
    token: process.env.CLIENT_TOKEN13,
    // https://discord.com/api/oauth2/authorize?client_id=1163083417710231642&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 14`,
    token: process.env.CLIENT_TOKEN14,
    // https://discord.com/api/oauth2/authorize?client_id=1163087697372532776&permissions=8&scope=bot
  },
];

// todo: sync state between processes. Send updated node to server and trigger sync as broadcast
spawnClient(botsList.find(f => f.name === `${BOT_NAME} ${process.argv[2]}`));
