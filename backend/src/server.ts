import express from "express";
import http from "http";
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types";
import "dotenv/config";
import classRoomSocket from "./socket";

import router from "./routes";
import configureMiddleware from "./middlewares/config";

const app = express();

configureMiddleware(app);

app.use("/", router());

const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

io.on("connection", (socket) => classRoomSocket.init({ socket, io }));

app.set("io", io);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
