import privateClient from "@/lib/client/private-client";
import type { GetMessagesResponse } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
export const getMessagesByConversationId = async ({
  cursor,
  conversationId,
}: {
  cursor: string | undefined;
  conversationId: string;
}) => {
  try {
    const res = await privateClient.get(
      ENDPOINTS.CHAT.GET_MESSAGES_BY_CONVERSATION_ID(conversationId),
      {
        params: {
          cursor,
        },
      }
    );

    return res.data as GetMessagesResponse;
  } catch {
    return {
      items: [],
      nextCursor: null,
    };
  }
};
