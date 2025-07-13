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
  instructor_phone: string;
  role: "student" | "instructor";
  created_at: Date;
  updated_at: Date;
  password?: string;
  status: "active" | "inactive";
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_students?: StudentLesson[];
}

export interface StudentLesson {
  id: string;
  lesson_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  status: "assigned" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  from_phone: string;
  to_phone: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
