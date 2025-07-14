import { useQuery } from "@tanstack/react-query";

import { type ConversationResponse } from "../types";
import privateClient from "@/lib/client/private-client";
import { ENDPOINTS } from "@/modules/endpoints";

export const useGetOrCreateConversations = (userTwoId: string) => {
  const query = useQuery({
    enabled: !!userTwoId,
    queryKey: ["conversation", userTwoId],
    queryFn: async () => {
      const response = await privateClient.get(
        ENDPOINTS.CHAT.GET_CONVERSATION_BY_USER_ID(userTwoId)
      );

      return response.data as ConversationResponse;
    },
  });

  return query;
};
