import { saveMessage } from "../lib/firebase";
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

const init = ({ socket, io }: IInIt) => {
  socket.on("join", (phone: string) => {
    connectedUsers.set(phone, socket.id);
    socket.join(phone);
    console.log(`User ${phone} joined with socket ${socket.id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { from_phone, to_phone, message } = data;

    try {
      const messageData = {
        from_phone,
        to_phone,
        message,
        timestamp: new Date(),
        read: false,
      };

      await saveMessage(messageData);

      const recipientSocketId = connectedUsers.get(to_phone);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", messageData);
      }

      socket.emit("messageSent", { success: true, messageData });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      socket.emit("messageSent", { success: false, error: errorMessage });
    }
  });

  socket.on("typing", (data: { to_phone: string; is_typing: boolean }) => {
    const { to_phone, is_typing } = data;
    const recipientSocketId = connectedUsers.get(to_phone);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("userTyping", { is_typing });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const [phone, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(phone);
        break;
      }
    }
  });
};

export default { init };
