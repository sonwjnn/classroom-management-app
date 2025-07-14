import type { User } from "../auth/types";

export type ConversationResponse = {
  id: string;
  user_one_id: string;
  user_two_id: string;
  user_one: User;
  user_two: User;
};

export type Message = {
  id: string;
  content: string;

  userId: string;
  user?: User;

  conversationId: string;
  conversation: ConversationResponse;

  // deleted?: boolean;

  created_at: string;
  updated_at: string;
};

export type GetMessagesResponse = {
  items: Message[];
  nextCursor: string | null;
};

export type AddMessageRequest = {
  content: string;
  conversationId: string;
};
