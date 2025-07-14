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
  messageSent: (data: {
    success: boolean;
    messageData?: Omit<Message, "id">;
    error?: string;
  }) => void;
}

export interface ClientToServerEvents {
  join: (user_id: string) => void;
  sendMessage: (data: {
    user_id: string;
    conversation_id: string;
    message: string;
  }) => void;
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

export interface Conversation {
  id: string;
  user_one_id: string;
  user_two_id: string;
  created_at: string;
  updated_at: string;
}
export interface Message {
  id: string;
  content: string;
  user_id: string;
  conversation_id: string;
  created_at: Date;
}
