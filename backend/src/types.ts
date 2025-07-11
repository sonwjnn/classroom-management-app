import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type ServerIo = {
  socket?: Socket & {
    server?: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newMessage: (message: Omit<Message, "id">) => void;
  userTyping: (data: { is_typing: boolean }) => void;
  messageSent: (data: {
    success: boolean;
    messageData?: Omit<Message, "id">;
    error?: string;
  }) => void;
}

export interface ClientToServerEvents {
  join: (phone: string) => void;
  sendMessage: (data: {
    from_phone: string;
    to_phone: string;
    message: string;
  }) => void;
  typing: (data: { to_phone: string; is_typing: boolean }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "student" | "instructor";
  created_at: Date;
  updated_at: Date;
  password?: string;
  access_code: string;
  code_created_at: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  instructor_phone: string;
  student_phone: string;
  status: "assigned" | "completed";
  created_at: Date;
  completed_at: Date;
}

export interface Message {
  id: string;
  from_phone: string;
  to_phone: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
