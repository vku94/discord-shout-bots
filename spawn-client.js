import { io as ioClient } from 'socket.io-client';
import { getClient } from './handler.js';

export default function(botOptions) {
  const socket = ioClient(process.env.SOCKET_SERVER);
  const client = getClient(botOptions.name, socket);

  void client.login(botOptions.token);
}
