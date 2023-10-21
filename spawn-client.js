import { io as ioClient } from "socket.io-client";
import { getClient } from "./handler.js";

const wait = async ms => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

export default async function(botOptions) {
  const socket = ioClient(process.env.SOCKET_SERVER);
  const botNumber = parseInt(botOptions.name.split(" ").pop()) || 0;
  await wait(2000 * botNumber);
  const client = getClient(botOptions.name, socket);

  void client.login(botOptions.token);
}
