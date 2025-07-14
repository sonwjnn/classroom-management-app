import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types";

import { Socket, Server } from "socket.io";

interface IInIt {
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
}

const connectedUsers = new Map<string, string>();

const init = ({ socket, io }: IInIt) => {};

export default { init };
