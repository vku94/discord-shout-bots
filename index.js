import dotenv from "dotenv";
import spawnClient from "./spawn-client.js";
import { BOT_NAME } from "./constants.js";

dotenv.config();

const botsList = [
  {
    name: `${BOT_NAME} 1`,
    token: process.env.CLIENT_TOKEN1
    // https://discord.com/api/oauth2/authorize?client_id=1162702694964805632&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 2`,
    token: process.env.CLIENT_TOKEN2
    // https://discord.com/api/oauth2/authorize?client_id=1162789457922097204&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 3`,
    token: process.env.CLIENT_TOKEN3
    // https://discord.com/api/oauth2/authorize?client_id=1163078011390804049&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 4`,
    token: process.env.CLIENT_TOKEN4
    // https://discord.com/api/oauth2/authorize?client_id=1163079803881140234&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 5`,
    token: process.env.CLIENT_TOKEN5
    // https://discord.com/api/oauth2/authorize?client_id=1163080633690628246&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 6`,
    token: process.env.CLIENT_TOKEN6
    // https://discord.com/api/oauth2/authorize?client_id=1163080918555181196&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 7`,
    token: process.env.CLIENT_TOKEN7
    // https://discord.com/api/oauth2/authorize?client_id=1163081149548068944&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 8`,
    token: process.env.CLIENT_TOKEN8
    // https://discord.com/api/oauth2/authorize?client_id=1163081412207984650&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 9`,
    token: process.env.CLIENT_TOKEN9
    // https://discord.com/api/oauth2/authorize?client_id=1163081652306710568&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 10`,
    token: process.env.CLIENT_TOKEN10
    // https://discord.com/api/oauth2/authorize?client_id=1163081829390221333&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 11`,
    token: process.env.CLIENT_TOKEN11
    // https://discord.com/api/oauth2/authorize?client_id=1163082025251635300&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 12`,
    token: process.env.CLIENT_TOKEN12
    // https://discord.com/api/oauth2/authorize?client_id=1163082288280637492&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 13`,
    token: process.env.CLIENT_TOKEN13
    // https://discord.com/api/oauth2/authorize?client_id=1163083417710231642&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 14`,
    token: process.env.CLIENT_TOKEN14
    // https://discord.com/api/oauth2/authorize?client_id=1163087697372532776&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 15`,
    token: process.env.CLIENT_TOKEN15
    // https://discord.com/api/oauth2/authorize?client_id=1163167223779696740&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 16`,
    token: process.env.CLIENT_TOKEN16
    // https://discord.com/api/oauth2/authorize?client_id=1163167264841941254&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 17`,
    token: process.env.CLIENT_TOKEN17
    // https://discord.com/api/oauth2/authorize?client_id=1163167314104045668&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 18`,
    token: process.env.CLIENT_TOKEN18
    // https://discord.com/api/oauth2/authorize?client_id=1163167370978803765&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 19`,
    token: process.env.CLIENT_TOKEN19
    // https://discord.com/api/oauth2/authorize?client_id=1163167411554500671&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 20`,
    token: process.env.CLIENT_TOKEN20
    // https://discord.com/api/oauth2/authorize?client_id=1163167454319628318&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 21`,
    token: process.env.CLIENT_TOKEN21
    // https://discord.com/api/oauth2/authorize?client_id=1163167498439499918&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 22`,
    token: process.env.CLIENT_TOKEN22
    // https://discord.com/api/oauth2/authorize?client_id=1163167537702371441&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 23`,
    token: process.env.CLIENT_TOKEN23
    // https://discord.com/api/oauth2/authorize?client_id=1163167574167670814&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 24`,
    token: process.env.CLIENT_TOKEN24
    // https://discord.com/api/oauth2/authorize?client_id=1163167617209606205&permissions=8&scope=bot
  },
  {
    name: `${BOT_NAME} 25`,
    token: process.env.CLIENT_TOKEN25
    // https://discord.com/api/oauth2/authorize?client_id=1163183312014155907&permissions=8&scope=bot
  }
];

spawnClient(botsList.find(f => f.name === `${BOT_NAME} ${process.argv[2]}`));
